import { useGetCreatorAnalytics } from '@/hooks';
import { Card } from '@/components/molecules';
import { BarChart3, TrendingUp, Award, Zap } from 'lucide-react';

export function StreamAnalytics({ creatorAddress }) {
  const {
    data: analytics,
    isLoading,
    error,
  } = useGetCreatorAnalytics(creatorAddress);

  if (!creatorAddress) {
    return (
      <Card title="Creator Analytics" className="bg-white/5">
        <p className="text-white/60">Connect your wallet to see analytics</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title="Creator Analytics"
        className="bg-red-500/10 border border-red-500/20"
      >
        <p className="text-red-400 text-sm">Failed to load analytics</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card title="Creator Analytics" className="bg-white/5">
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card title="Creator Analytics" className="bg-white/5">
        <p className="text-white/60">No analytics data available yet</p>
      </Card>
    );
  }

  const stats = [
    {
      icon: Zap,
      label: 'Total Streams',
      value: analytics.totalStreams || 0,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Active Streams',
      value: analytics.activeStreams || 0,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Award,
      label: 'Executed',
      value: analytics.executedStreams || 0,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: BarChart3,
      label: 'Cancelled',
      value: analytics.cancelledStreams || 0,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const tokenStats = [
    {
      label: 'Total FLOW Scheduled',
      value: (parseFloat(analytics.totalTokensScheduled) || 0).toFixed(2),
      change: '+',
      color: 'text-cyan-400',
    },
    {
      label: 'Total FLOW Distributed',
      value: (parseFloat(analytics.totalTokensDistributed) || 0).toFixed(2),
      change: '+',
      color: 'text-emerald-400',
    },
    {
      label: 'Platform Fees Paid',
      value: (parseFloat(analytics.totalFeesPaid) || 0).toFixed(2),
      change: '-',
      color: 'text-red-400',
    },
    {
      label: 'Pending Payout',
      value: (parseFloat(analytics.pendingPayout) || 0).toFixed(2),
      change: '⏳',
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Creator Analytics"
        className="bg-white/5 border border-white/10"
      >
        {/* Stream Count Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`${stat.bgColor} rounded-lg p-4 text-center`}
              >
                <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-white/60 mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Token Statistics */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-sm font-semibold text-white/70 mb-4 uppercase tracking-wider">
            Token Statistics
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {tokenStats.map((stat, idx) => (
              <div
                key={idx}
                className="flex justify-between items-start p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div>
                  <p className="text-sm text-white/60 mb-1">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-lg">{stat.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stream IDs */}
        {analytics.streamIDs && analytics.streamIDs.length > 0 && (
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wider">
              Stream IDs ({analytics.streamIDs.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {analytics.streamIDs.map((streamID) => (
                <div
                  key={streamID}
                  className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80"
                >
                  #{streamID}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default StreamAnalytics;
