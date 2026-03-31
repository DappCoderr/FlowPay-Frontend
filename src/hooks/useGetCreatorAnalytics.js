import { useQuery } from '@tanstack/react-query';
import { get_creator_analytics } from '../flow/get_creator_analytics.script';

/**
 * Hook to fetch analytics for a stream creator
 * @param {string} creatorAddress - The creator's Flow address
 * @returns {Object} TanStack Query result with analytics data, isLoading, error, etc.
 */
export function useGetCreatorAnalytics(creatorAddress) {
  return useQuery({
    queryKey: ['creatorAnalytics', creatorAddress],
    queryFn: async () => {
      if (!creatorAddress) {
        throw new Error('Creator address is required');
      }
      return get_creator_analytics(creatorAddress);
    },
    enabled: !!creatorAddress, // Only run query if creatorAddress provided
    staleTime: 60000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes - cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if stale
    retry: 2,
  });
}

export default useGetCreatorAnalytics;
