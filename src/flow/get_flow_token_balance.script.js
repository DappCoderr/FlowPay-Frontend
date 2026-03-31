import * as fcl from '@onflow/fcl';

const GET_FLOW_TOKEN_BALANCE = `
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

access(all) fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .capabilities.borrow<&FlowToken.Vault>(/public/flowTokenBalance)
        ?? panic("Could not borrow a balance reference to the FlowToken Vault in account "
                .concat(account.toString()).concat(" at path /public/flowTokenBalance. ")
                .concat("Make sure you are querying an address that has ")
                .concat("a FlowToken Vault set up properly at the specified path."))

    return vaultRef.balance
}
`;

export async function get_flow_token_balance(address) {
  try {
    const response = await fcl.query({
      cadence: GET_FLOW_TOKEN_BALANCE,
      args: (arg, t) => [arg(address, t.Address)],
    });
    return response;
  } catch (error) {
    console.error('Error in getting flow token balance:', error);
    throw error;
  }
}
