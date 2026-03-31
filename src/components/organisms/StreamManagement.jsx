import { useState, useMemo, memo } from 'react';
import { useGetStreamsByCreator, useCancelStream, useGetStream } from '@/hooks';
import { Card } from '@/components/molecules';
import { Button } from '@/components/atoms';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Modal } from '@/components/molecules';

// Status configuration - memoized outside component
const STATUS_CONFIG = {
  active: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    label: 'Active',
    icon: Zap,
  },
  executing: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    label: 'Executing',
    icon: Clock,
  },
  completed: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    label: 'Completed',
    icon: CheckCircle,
  },
  cancelled: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    label: 'Cancelled',
    icon: AlertCircle,
  },
  pending: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    label: 'Pending',
    icon: Clock,
  },
};

// Helper function to determine stream status
const getStreamStatus = (streamData) => {
  const rawValue = streamData.status?.rawValue;
  const isComplete = streamData.executionCount >= streamData.totalRounds;
  
  if (rawValue === 0) return 'active';
  if (rawValue === 2) return 'cancelled';
  if (isComplete) return 'completed';
  if (rawValue === 1) return 'executing';
  
  return 'pending';
};

// Memoized badge component
const StreamStatusBadge = memo(({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <div
      className={`${config.bg} ${config.text} px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium w-fit`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
});

StreamStatusBadge.displayName = 'StreamStatusBadge';

/**
 * StreamManagement Component - Table View
 * Displays all streams in a tabular format for easy comparison and management
 */
export function StreamManagement({ creatorAddress }) {
  // All hooks must be called at the top level, before any conditional returns
  const {
    data: streams,
    isLoading,
    error,
    refetch,
  } = useGetStreamsByCreator(creatorAddress);
  const { mutate: cancelStream, isPending: isCancelling } = useCancelStream();
  const [selectedStreamID, setSelectedStreamID] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const { data: selectedStream, isLoading: isLoadingStreamDetails } = useGetStream(
    selectedStreamID
  );

  const streamList = streams || [];
  
  // Memoize filtered streams to avoid recalculating on every render
  const { activeStreams, completedStreams, executingStreams, cancelledStreams } = useMemo(() => {
    return {
      activeStreams: streamList.filter((s) => s.status?.rawValue === 0),
      completedStreams: streamList.filter(
        (s) => s.status?.rawValue === 1 && s.executionCount >= s.totalRounds
      ),
      executingStreams: streamList.filter(
        (s) => s.status?.rawValue === 1 && s.executionCount < s.totalRounds
      ),
      cancelledStreams: streamList.filter((s) => s.status?.rawValue === 2),
    };
  }, [streamList]);

  const toggleRowExpand = (streamID) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(streamID)) {
      newExpanded.delete(streamID);
    } else {
      newExpanded.add(streamID);
    }
    setExpandedRows(newExpanded);
  };

  // Early returns AFTER all hooks have been called
  if (!creatorAddress) {
    return (
      <Card title="Stream History" className="bg-white/3 border border-white/10 shadow-lg\">
        <p className="text-white/70 text-center py-8\">
          Connect your wallet to view your streams
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title="Stream History"
        className="bg-red-500/10 border border-red-500/20 shadow-lg"
      >
        <div className="space-y-3">
          <p className="text-red-400 text-sm\">Failed to load streams</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card title="Stream History" className="bg-white/3 border border-white/10 shadow-lg\">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-linear-to-r from-white/10 to-transparent rounded-lg animate-pulse"
            />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {streamList.length > 0 && (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 p-4 rounded-xl bg-linear-to-br from-green-500/15 to-transparent border border-green-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-green-400/80 text-xs font-medium uppercase tracking-wider mb-1">Active</p>
            <p className="text-3xl font-bold text-green-400">
              {activeStreams.length}
            </p>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 p-4 rounded-xl bg-linear-to-br from-blue-500/15 to-transparent border border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-blue-400/80 text-xs font-medium uppercase tracking-wider mb-1">Executing</p>
            <p className="text-3xl font-bold text-blue-400">
              {executingStreams.length}
            </p>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 p-4 rounded-xl bg-linear-to-br from-cyan-500/15 to-transparent border border-cyan-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-cyan-400/80 text-xs font-medium uppercase tracking-wider mb-1">Completed</p>
            <p className="text-3xl font-bold text-cyan-400">
              {completedStreams.length}
            </p>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 p-4 rounded-xl bg-linear-to-br from-red-500/15 to-transparent border border-red-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-red-400/80 text-xs font-medium uppercase tracking-wider mb-1">Cancelled</p>
            <p className="text-3xl font-bold text-red-400">
              {cancelledStreams.length}
            </p>
          </div>
        </div>
      )}

      {/* Streams Table */}
      <Card
        title={`Stream History (${streamList.length})`}
        className="bg-white/3 border border-white/10 shadow-lg"
      >
        {streamList.length === 0 ? (
          <p className="text-white/60 text-center py-8">
            No payment streams yet. Create one to get started!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/80 uppercase tracking-wide">
                    Stream ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/80 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/80 uppercase tracking-wide">
                    Recipients
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-white/80 uppercase tracking-wide">
                    Escrow
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-white/80 uppercase tracking-wide">
                    Progress
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/80 uppercase tracking-wide">
                    Created
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/80 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {streamList.map((stream) => {
                  const status = getStreamStatus(stream);
                  const isActive = stream.status?.rawValue === 0;
                  const isExpanded = expandedRows.has(stream.streamID);

                  return (
                    <tr
                      key={stream.streamID}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-white">
                          #{stream.streamID}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <StreamStatusBadge status={status} />
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-white/80">
                          {stream.recipients?.length || 0}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm font-semibold text-white">
                          {parseFloat(stream.totalEscrowed).toFixed(2)}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col items-end">
                          <p className="text-sm font-semibold text-white">
                            {stream.executionCount}/{stream.totalRounds}
                          </p>
                          <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{
                                width: `${(stream.executionCount / stream.totalRounds) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-white/70">
                          {new Date(
                            parseInt(stream.createdAt) * 1000
                          ).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setSelectedStreamID(stream.streamID);
                              toggleRowExpand(stream.streamID);
                            }}
                            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isActive && (
                            <button
                              onClick={() => 
                                cancelStream(
                                  { streamID: stream.streamID },
                                  { onSuccess: () => refetch() }
                                )
                              }
                              disabled={isCancelling}
                              className="p-1.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                              title="Cancel stream"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleRowExpand(stream.streamID)}
                            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Expanded Row Details */}
      {streamList.map((stream) => {
        const isExpanded = expandedRows.has(stream.streamID);
        if (!isExpanded) return null;

        return (
          <Card
            key={`expanded-${stream.streamID}`}
            title={`Stream #${stream.streamID} - Recipients`}
            className="bg-white/3 border border-white/10 ml-4 md:ml-8 shadow-lg"
          >
            <div className="space-y-2">
              {stream.recipients?.map((recipient, idx) => (
                <div
                  key={idx}
                    className="p-3 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center hover:bg-white/7 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-xs text-white/60 mb-1">Recipient {idx + 1}</p>
                    <p className="text-sm font-mono text-white break-all">
                      {recipient.address}
                    </p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-xs text-white/60 mb-1">Amount per cycle</p>
                    <p className="text-sm font-semibold text-cyan-400">
                      {parseFloat(recipient.amount).toFixed(2)} FLOW
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      {/* Stream Details Modal */}
      <Modal
        isOpen={!!selectedStreamID}
        onClose={() => setSelectedStreamID(null)}
        title={selectedStreamID ? `Stream #${selectedStreamID} Details` : 'Stream Details'}
      >
        {isLoadingStreamDetails ? (
          <div className="space-y-3">
            <div className="h-10 bg-white/10 rounded animate-pulse" />
            <div className="h-10 bg-white/10 rounded animate-pulse" />
            <div className="h-20 bg-white/10 rounded animate-pulse" />
          </div>
        ) : selectedStream ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-sm mb-1">Status</p>
                <StreamStatusBadge
                  status={getStreamStatus(selectedStream)}
                />
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Total Escrowed</p>
                <p className="text-lg font-bold text-white">
                  {parseFloat(selectedStream.totalEscrowed).toFixed(2)} FLOW
                </p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Execution Progress</p>
                <p className="text-lg font-bold text-white">
                  {selectedStream.executionCount} / {selectedStream.totalRounds}{' '}
                  rounds
                </p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">
                  Platform Fee per Cycle
                </p>
                <p className="text-lg font-bold text-white">
                  {parseFloat(selectedStream.platformFeePerCycle).toFixed(4)}{' '}
                  FLOW
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-white/60 text-sm mb-3">
                Recipients ({selectedStream.recipients?.length || 0})
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedStream.recipients?.map((recipient, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white/5 flex justify-between items-center"
                  >
                    <p className="text-white/80 text-sm break-all">
                      {recipient.address}
                    </p>
                    <p className="text-white font-semibold shrink-0 ml-2">
                      {parseFloat(recipient.amount).toFixed(2)} FLOW
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/10 flex-col sm:flex-row">
              <Button
                onClick={() => setSelectedStreamID(null)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              {selectedStream.status?.rawValue === 0 && (
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    cancelStream(
                      { streamID: selectedStreamID },
                      { onSuccess: () => setSelectedStreamID(null) }
                    );
                  }}
                  disabled={isCancelling}
                >
                  Cancel Stream
                </Button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-white/60 text-center py-8">
            Failed to load stream details. Please try again.
          </p>
        )}
      </Modal>
    </div>
  );
}
