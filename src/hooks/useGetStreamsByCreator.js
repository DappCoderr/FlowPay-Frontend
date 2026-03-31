import { useQuery } from '@tanstack/react-query';
import { get_streams_by_creator } from '../flow/get_streams_by_creator.script';

/**
 * Hook to fetch all streams created by a specific address
 * @param {string} creatorAddress - The creator's Flow address
 * @returns {Object} TanStack Query result with streams array, isLoading, error, etc.
 */
export function useGetStreamsByCreator(creatorAddress) {
  return useQuery({
    queryKey: ['streamsByCreator', creatorAddress],
    queryFn: async () => {
      if (!creatorAddress) {
        throw new Error('Creator address is required');
      }
      return get_streams_by_creator(creatorAddress);
    },
    enabled: !!creatorAddress, // Only run query if creatorAddress provided
    staleTime: 60000, // 60 seconds - increased from 30 to reduce refetches
    gcTime: 5 * 60 * 1000, // 5 minutes - cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if stale
    retry: 2,
  });
}

export default useGetStreamsByCreator;
