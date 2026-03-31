// this script returns the array for all the stream Ids that has been created
// Result: [8, 1, 10, 11, 4, 2, 7, 9, 6, 5, 3]

import * as fcl from '@onflow/fcl';

const GET_ALL_STREAM_IDS = `
import FlowPay from 0xFlowPay

access(all) fun main(): [UInt64] {
    return FlowPay.getAllStreamIDs()
}
`;

export async function get_all_stream_ids() {
  try {
    const response = await fcl.query({
      cadence: GET_ALL_STREAM_IDS,
      args: () => [],
    });
    return response;
  } catch (error) {
    console.error('Error fetching all stream ids:', error);
    throw error;
  }
}
