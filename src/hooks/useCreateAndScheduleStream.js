import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create_and_schedule_stream } from '../flow/create_and_schedule_stream.txn';

/**
 * Hook to create and schedule a new payment stream
 * @returns {Object} TanStack Query mutation with mutate function and status
 */
export function useCreateAndScheduleStream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params) => {
      const {
        recipients,
        amounts,
        delaySeconds,
        recurrenceRaw,
        totalRounds,
        onStatus,
      } = params;
      return create_and_schedule_stream(
        { recipients, amounts, delaySeconds, recurrenceRaw, totalRounds },
        onStatus
      );
    },
    onSuccess: () => {
      // Invalidate related queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: ['allStreamIds'] });
      queryClient.invalidateQueries({ queryKey: ['streamsByCreator'] });
      queryClient.invalidateQueries({ queryKey: ['creatorAnalytics'] });
    },
    onError: (error) => {
      console.error('Stream creation failed:', error);
    },
  });
}

export default useCreateAndScheduleStream;
