import { useAuth } from '@/hooks';
import { StreamManagement, StreamAnalytics } from '@/components/organisms';

/**
 * History Page
 * Display all payment streams and stream history
 * Features:
 * - View all streams (active, executed, cancelled)
 * - Stream analytics
 * - Manage existing streams
 * - View stream execution history
 */
export default function History() {
  const { user, isLoading } = useAuth();
  const address = user?.addr;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-white/10 rounded w-1/4" />
          <div className="h-32 bg-white/10 rounded" />
          <div className="h-64 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header Section */}
      <div className="col-span-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3">Stream History</h1>
        <p className="text-white/70 leading-relaxed text-base md:text-lg max-w-3xl">
          View and manage all your payment streams. Track active, completed, and cancelled streams in one place.
        </p>
      </div>

      {/* Stream Analytics - Full Width */}
      {address && (
        <div className="col-span-full">
          <StreamAnalytics creatorAddress={address} />
        </div>
      )}

      {/* Stream Management - Full Width */}
      {address && (
        <div className="col-span-full">
          <StreamManagement creatorAddress={address} />
        </div>
      )}
    </div>
  );
}
