import * as fcl from '@onflow/fcl';

export const CANCEL_STREAM = `
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FlowPay from 0xFlowPay

transaction(streamID: UInt64) {

    let signerAddress:  Address
    let signerReceiver: &{FungibleToken.Receiver}

    prepare(signer: auth(BorrowValue) &Account) {

        self.signerAddress = signer.address

        self.signerReceiver = signer.capabilities
            .borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            ?? panic("FlowPay TX: Cannot borrow FlowToken receiver capability")
    }

    execute {

        FlowPay.cancelStream(
            streamID:       streamID,
            caller:         self.signerAddress,
            refundReceiver: self.signerReceiver
        )

        log("FlowPay: Stream #\\(streamID) cancelled. Escrow refunded.")
    }
}
`;

export const cancel_stream = async (streamId, onStatus) => {
  try {
    onStatus?.('preparing');

    const txId = await fcl.mutate({
      cadence: CANCEL_STREAM,
      args: (arg, t) => [arg(streamId, t.UInt64)],
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
