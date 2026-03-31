import { useQuery } from '@tanstack/react-query';
import { get_flow_token_balance } from '../flow/get_flow_token_balance.script';

/**
 * Hook to fetch FLOW token balance for an address
 * @param {string} address - The Flow address to check balance for
 * @returns {Object} TanStack Query result with balance data, isLoading, error, etc.
 */
export function useGetFlowBalance(address) {
  return useQuery({
    queryKey: ['flowBalance', address],
    queryFn: async () => {
      if (!address) {
        throw new Error('Address is required');
      }
      return get_flow_token_balance(address);
    },
    enabled: !!address, // Only run query if address provided
    staleTime: 30000, // 30 seconds - increased from 15
    gcTime: 5 * 60 * 1000, // 5 minutes - cache time
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if stale
    retry: 2,
  });
}

export default useGetFlowBalance;
