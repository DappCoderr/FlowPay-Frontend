// this script returns - creator analytics which you can see the result
// Result: {"totalTokensScheduled": 5099.00000000, "cancelledStreams": 3, "executedStreams": 8, "pendingPayout": 0.00000000, "totalTokensDistributed": 4266.00000000, "totalFeesPaid": 42.66000000, "streamIDs": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], "totalStreams": 11, "activeStreams": 0}

import * as fcl from '@onflow/fcl';

const GET_CREATOR_ANALYTICS = `

import FlowPay from 0xFlowPay

access(all) fun main(creator: Address): {String: AnyStruct} {
    let streams = FlowPay.getStreamsByCreator(creator: creator)

    var totalStreams:           UInt64 = 0
    var activeStreams:          UInt64 = 0
    var executedStreams:        UInt64 = 0
    var cancelledStreams:       UInt64 = 0
    var totalTokensScheduled = 0.0
    var totalTokensDistributed = 0.0
    var totalFeesPaid = 0.0
    var pendingPayout = 0.0
    var streamIDs:             [UInt64] = []

    for info in streams {
        totalStreams = totalStreams + 1
        streamIDs.append(info.streamID)

        let payout      = info.payoutPerCycle()
        let feePerCycle = payout * 1.0 / 100.0

        totalTokensScheduled = totalTokensScheduled + payout
        totalFeesPaid        = totalFeesPaid + (feePerCycle * UFix64(info.executionCount))
        totalTokensDistributed = totalTokensDistributed + (payout * UFix64(info.executionCount))

        switch info.status {
            case FlowPay.StreamStatus.active:
                activeStreams = activeStreams + 1
                pendingPayout = pendingPayout + payout
            case FlowPay.StreamStatus.executed:
                executedStreams = executedStreams + 1
            case FlowPay.StreamStatus.cancelled:
                cancelledStreams = cancelledStreams + 1
        }
    }

    return {
        "totalStreams":            totalStreams,
        "activeStreams":           activeStreams,
        "executedStreams":         executedStreams,
        "cancelledStreams":        cancelledStreams,
        "totalTokensScheduled":   totalTokensScheduled,
        "totalTokensDistributed": totalTokensDistributed,
        "totalFeesPaid":          totalFeesPaid,
        "pendingPayout":          pendingPayout,
        "streamIDs":               streamIDs
    }
}
`;

export async function get_creator_analytics(creatorAddress) {
  try {
    const response = await fcl.query({
      cadence: GET_CREATOR_ANALYTICS,
      args: (arg, t) => [arg(creatorAddress, t.Address)],
    });
    return response;
  } catch (error) {
    console.error('Error fetching creator analytics:', error);
    throw error;
  }
}
