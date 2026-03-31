 import * as fcl from '@onflow/fcl';

export const INIT_SCHEDULER_HANDLER = `
import FlowTransactionScheduler from 0xFlowTransactionScheduler
import FlowTransactionSchedulerUtils from 0xFlowTransactionSchedulerUtils
import FlowPayScheduler from 0xFlowPayScheduler

transaction {

    prepare(
        signer: auth(
            Storage,
            SaveValue,
            BorrowValue,
            IssueStorageCapabilityController,
            PublishCapability,
            GetStorageCapabilityController
        ) &Account
    ) {

        // ── Step 1: FlowTransactionSchedulerUtils Manager ─────────────────
        if !signer.storage.check<@{FlowTransactionSchedulerUtils.Manager}>(
            from: FlowTransactionSchedulerUtils.managerStoragePath
        ) {
            let manager <- FlowTransactionSchedulerUtils.createManager()
            signer.storage.save(<- manager, to: FlowTransactionSchedulerUtils.managerStoragePath)

            let cap = signer.capabilities.storage.issue<&{FlowTransactionSchedulerUtils.Manager}>(
                FlowTransactionSchedulerUtils.managerStoragePath
            )
            signer.capabilities.publish(cap, at: FlowTransactionSchedulerUtils.managerPublicPath)

            log("FlowPay: SchedulerUtils Manager created")
        } else {
            log("FlowPay: SchedulerUtils Manager already exists — skipping")
        }

        // ── Step 2: FlowPayScheduler Handler ──────────────────────────────
        if signer.storage.check<@FlowPayScheduler.Handler>(
            from: FlowPayScheduler.HandlerStoragePath
        ) {
            log("FlowPay: Handler already exists — skipping")
            return
        }

        // Store the Handler resource
        let handler <- FlowPayScheduler.createHandler(owner: signer.address)
        signer.storage.save(<- handler, to: FlowPayScheduler.HandlerStoragePath)

        // Issue the ENTITLED capability — the Flow protocol uses this to call executeTransaction()
        let entitledCap = signer.capabilities.storage.issue<
            auth(FlowTransactionScheduler.Execute) &{FlowTransactionScheduler.TransactionHandler}
        >(FlowPayScheduler.HandlerStoragePath)

        // Publish a PUBLIC (read-only metadata) capability
        let publicCap = signer.capabilities.storage.issue<
            &{FlowTransactionScheduler.TransactionHandler}
        >(FlowPayScheduler.HandlerStoragePath)
        signer.capabilities.publish(publicCap, at: FlowPayScheduler.HandlerPublicPath)

        log("FlowPay: Handler initialised for account \(signer.address)")
        log("FlowPay: Account is ready to schedule autonomous stream execution")
    }
}
`;

export const init_scheduler_handler = async (onStatus) => {
  try {
    onStatus?.('preparing');

    const txId = await fcl.mutate({
      cadence: INIT_SCHEDULER_HANDLER,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 9999,
    });

    onStatus?.('submitting');

    const unsub = fcl.tx(txId).subscribe((tx) => {
      if (tx?.status === 1) onStatus?.('pending');
      if (tx?.status === 4) onStatus?.('sealed');
    });

    const sealed = await fcl.tx(txId).onceSealed();
    unsub && unsub();

    if (sealed?.errorMessage) {
      const msg = sealed.errorMessage;
      let friendly = msg;
      if (msg.includes('Insufficient balance')) {
        friendly = 'Insufficient FLOW balance for stream escrow';
      } else if (msg.includes('Cannot borrow FlowToken vault')) {
        friendly = 'FlowToken vault not found. Please deposit FLOW first.';
      }
      throw new Error(friendly);
    }

    return sealed;
  } catch (error) {
    const msg =
      (typeof error === 'string' && error) ||
      (error && error.message) ||
      (error && error.errorMessage) ||
      'Transaction failed';

    if (msg.toLowerCase().includes('declined')) {
      throw new Error('User denied transaction');
    }
    throw new Error(msg);
  }
};