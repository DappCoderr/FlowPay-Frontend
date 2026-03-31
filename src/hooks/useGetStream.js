import { useQuery } from '@tanstack/react-query';
import { get_stream } from '../flow/get_stream.script';

/**
 * Hook to fetch a single stream by ID
 * @param {number} streamID - The stream ID to fetch
 * @returns {Object} TanStack Query result with stream data, isLoading, error, etc.
 */
export function useGetStream(streamID) {
  return useQuery({
    queryKey: ['stream', streamID],
    queryFn: async () => {
      if (streamID === null || streamID === undefined) {
        throw new Error('Stream ID is required');
      }
      return get_stream(streamID);
    },
    enabled: streamID !== null && streamID !== undefined, // Only run query if streamID provided
    staleTime: 30000, // 30 seconds - increased from 10
    gcTime: 5 * 60 * 1000, // 5 minutes - cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if stale
    retry: 2,
  });
}

export default useGetStream;
