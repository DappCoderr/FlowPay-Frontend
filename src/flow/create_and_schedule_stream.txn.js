import * as fcl from '@onflow/fcl';

// eslint-disable-next-line no-useless-escape
export const CREATE_AND_SCHEDULE_STREAM = `
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FlowPay from 0xFlowPay

transaction(
    recipients:     [Address],
    amounts:        [UFix64],
    delaySeconds:   UFix64,
    recurrenceRaw:  UInt8,
    totalRounds:    UInt64
) {

    let createdStreamID: UInt64
    let signerAddress: Address
    let payoutPerCycleAmount: UFix64

    prepare(signer: auth(Capabilities, Storage, BorrowValue) &Account) {

        self.signerAddress = signer.address

        // ═════════════════════════════════════════════════════════════════
        // INPUT VALIDATION
        // ═════════════════════════════════════════════════════════════════

        assert(
            recipients.length == amounts.length,
            message: "Recipients and amounts arrays must have equal length"
        )
        assert(recipients.length > 0, message: "At least one recipient required")
        assert(recipients.length <= 100, message: "Maximum 100 recipients per stream")
        assert(recurrenceRaw <= 2, message: "Invalid recurrence (0=one-time, 1=weekly, 2=monthly)")
        assert(delaySeconds > 0.0, message: "Delay must be greater than zero")
        assert(totalRounds > 0, message: "totalRounds must be at least 1")

        if recurrenceRaw == 0 {
            assert(totalRounds == 1, message: "One-time streams must have totalRounds = 1")
        }

        var idx = 0
        while idx < amounts.length {
            assert(amounts[idx] > 0.0, message: "Amount at index \(idx) must be positive")
            idx = idx + 1
        }

        // ═════════════════════════════════════════════════════════════════
        // CALCULATE ESCROW
        // ═════════════════════════════════════════════════════════════════

        var payoutPerCycle = 0.0
        var i = 0
        while i < amounts.length {
            payoutPerCycle = payoutPerCycle + amounts[i]
            i = i + 1
        }

        self.payoutPerCycleAmount = payoutPerCycle

        let platformFeePerCycle = payoutPerCycle * 1.0 / 100.0
        let totalRequired = (payoutPerCycle + platformFeePerCycle) * UFix64(totalRounds)

        // ═════════════════════════════════════════════════════════════════
        // WITHDRAW ESCROW
        // ═════════════════════════════════════════════════════════════════

        let signerVault = signer.storage
            .borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault")

        assert(
            signerVault.balance >= totalRequired,
            message: "Insufficient balance. Need: \(totalRequired) FLOW"
        )

        let escrow <- signerVault.withdraw(amount: totalRequired) as! @FlowToken.Vault

        // ═════════════════════════════════════════════════════════════════
        // BUILD RECIPIENTS
        // ═════════════════════════════════════════════════════════════════

        var entries: [FlowPay.RecipientEntry] = []
        var recipIdx = 0
        while recipIdx < recipients.length {
            entries.append(FlowPay.RecipientEntry(address: recipients[recipIdx], amount: amounts[recipIdx]))
            recipIdx = recipIdx + 1
        }

        // ═════════════════════════════════════════════════════════════════
        // MAP RECURRENCE
        // ═════════════════════════════════════════════════════════════════

        let recurrence =
            recurrenceRaw == 0 ? FlowPay.RecurrenceType.oneTime  :
            recurrenceRaw == 1 ? FlowPay.RecurrenceType.weekly   :
                                 FlowPay.RecurrenceType.monthly

        // ═════════════════════════════════════════════════════════════════
        // CREATE STREAM
        // ═════════════════════════════════════════════════════════════════

        self.createdStreamID = FlowPay.createStream(
            creator:      signer.address,
            recipients:   entries,
            delaySeconds: delaySeconds,
            recurrence:   recurrence,
            totalRounds:  totalRounds,
            escrow:       <- escrow
        )

        // ═════════════════════════════════════════════════════════════════
        // SCHEDULE THE STREAM (with sensible defaults)
        // ═════════════════════════════════════════════════════════════════
        // We use automatic defaults:
        // - priority = Medium (balanced)
        // - schedulingFee = 0.1 FLOW (standard)
        // - executionEffort = 9999 (CORRECTED: maximum allowed by Flow)
        // Users don't need to think about these!

        FlowPay.scheduleStreamExecution(
            streamID:        self.createdStreamID,
            signer:          signer,
            priority:        1,              // Medium (automatic)
            schedulingFee:   1.51,           // ✅ FIXED: Covers Medium priority execution cost
            executionEffort: 7500            // Maximum for Medium priority
        )
    }

    execute {
        log("✅ Stream created and scheduled!")
        log("Stream ID: \(self.createdStreamID)")
        log("Payout per cycle: \(self.payoutPerCycleAmount) FLOW")
    }
}

`;

export const create_and_schedule_stream = async (
  { recipients, amounts, delaySeconds, recurrenceRaw, totalRounds },
  onStatus
) => {
  try {
    onStatus?.('preparing');

    const txId = await fcl.mutate({
      cadence: CREATE_AND_SCHEDULE_STREAM,
      args: (arg, t) => [
        arg(recipients, t.Array(t.Address)),
        arg(amounts, t.Array(t.UFix64)),
        arg(delaySeconds, t.UFix64),
        arg(String(recurrenceRaw), t.UInt8),
        arg(String(totalRounds), t.UInt64),
      ],
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
