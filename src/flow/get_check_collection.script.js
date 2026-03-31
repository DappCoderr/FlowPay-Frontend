import * as fcl from '@onflow/fcl';

const GET_HANDLER_CHECK = `
import FlowTransactionScheduler from 0xFlowTransactionScheduler
import FlowPayScheduler from 0xFlowPayScheduler

access(all) fun main(addr: Address): Bool {
    let account = getAccount(addr)
    return account.capabilities.get<&{FlowTransactionScheduler.TransactionHandler}>(FlowPayScheduler.HandlerPublicPath).check()
}
`;

export async function checkHandlerInitialized(address) {
  try {
    const response = await fcl.query({
      cadence: GET_HANDLER_CHECK,
      args: (arg, t) => [arg(address, t.Address)],
    });
    return response;
  } catch (error) {
    console.error('Error checking handler initialization:', error);
    return false;
  }
}
