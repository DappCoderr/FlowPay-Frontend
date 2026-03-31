// Result: A.e0c7dc1075c0f1f9.FlowPay.StreamInfo(streamID: 5, creator: 0xa86e8cb694c5dd49, recipients: [A.e0c7dc1075c0f1f9.FlowPay.RecipientEntry(address: 0xa344be2f5840a360, amount: 100.00000000), A.e0c7dc1075c0f1f9.FlowPay.RecipientEntry(address: 0xadfb95fa72848fd3, amount: 100.00000000)], totalEscrowed: 202.00000000, platformFeePerCycle: 2.00000000, executionTime: 1774793913.00000000, recurrence: A.e0c7dc1075c0f1f9.FlowPay.RecurrenceType(rawValue: 0), nextExecutionTime: nil, totalRounds: 1, completedRounds: 1, status: A.e0c7dc1075c0f1f9.FlowPay.StreamStatus(rawValue: 1), executionCount: 1, createdAt: 1774793883.00000000, updatedAt: 1774793913.00000000)

import * as fcl from '@onflow/fcl';

const GET_STREAM = `
import FlowPay from 0xFlowPay

access(all) fun main(streamID: UInt64): FlowPay.StreamInfo? {
    return FlowPay.getStream(streamID: streamID)
}
`;

export async function get_stream(streamID) {
  try {
    const response = await fcl.query({
      cadence: GET_STREAM,
      args: (arg, t) => [arg(streamID, t.UInt64)],
    });
    return response;
  } catch (error) {
    console.error('Error fetching stream info:', error);
    throw error;
  }
}
