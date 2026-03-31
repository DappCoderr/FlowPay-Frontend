import * as fcl from '@onflow/fcl';

export async function send_flow_tokens(recipientAddress, amount) {
  const SEND_FLOW_TX = `
transaction(amount: UFix64, to: Address) {
  let sentVault: @AnyResource

  prepare(signer: auth(BorrowValue) &Account) {
    let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
      ?? panic("Could not borrow a reference to the owner's vault!")

    self.sentVault <- vaultRef.withdraw(amount : amount)
  }

  execute {
    let recipient = getAccount(to)
    let receiverRef = recipient.capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
      ?? panic("Could not borrow a reference to the receiver!")

    receiverRef.deposit(from: <-self.sentVault)

    log("FlowToken Sent")
  }
}
`;

  try {
    const txId = await fcl.mutate({
      cadence: SEND_FLOW_TX,
      args: (arg, t) => [
        arg(amount, t.UFix64),
        arg(recipientAddress, t.Address),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 9999,
    });

    const unsub = fcl.tx(txId).subscribe((tx) => {
      if (tx?.status === 1) {
        // pending
      }
      if (tx?.status === 4) {
        // sealed
      }
    });

    const sealed = await fcl.tx(txId).onceSealed();
    unsub && unsub();

    if (sealed?.errorMessage) {
      throw new Error(sealed.errorMessage);
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
}

