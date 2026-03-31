import { useQuery } from '@tanstack/react-query';
import { get_all_stream_ids } from '../flow/get_all_stream_ids.script';

/**
 * Hook to fetch all stream IDs
 * @returns {Object} TanStack Query result with data, isLoading, error, etc.
 */
export function useGetAllStreamIds() {
  return useQuery({
    queryKey: ['allStreamIds'],
    queryFn: async () => {
      return get_all_stream_ids();
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

export default useGetAllStreamIds;
