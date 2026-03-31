import { useQuery } from '@tanstack/react-query';
import { checkHandlerInitialized } from '@/flow/get_check_collection.script';

/**
 * Hook to check if user has FlowPayScheduler Handler initialized
 * Handler is required for autonomous stream execution
 */
export function useCheckHandlerInit(userAddress) {
  const { data: isInitialized, isLoading: isChecking, error } = useQuery({
    queryKey: ['handlerInit', userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('User address is required');
      }
      return checkHandlerInitialized(userAddress);
    },
    enabled: !!userAddress,
    staleTime: 60000, // 60 seconds
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  return {
    isInitialized,
    isChecking,
    error,
  };
}

export default useCheckHandlerInit;
