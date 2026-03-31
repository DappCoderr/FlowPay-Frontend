import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancel_stream } from '../flow/cancel_stream.txn';

export function useCancelStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params) => {
      const { streamID, onStatus } = params;
      return cancel_stream(streamID, onStatus);
    },
    onSuccess: () => {
      // Invalidate stream queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: ['userStreams'] });
      queryClient.invalidateQueries({ queryKey: ['streamAnalytics'] });
    },
    onError: (error) => {
      console.error('Stream cancellation failed:', error);
    },
  });
}

export default useCancelStream;
