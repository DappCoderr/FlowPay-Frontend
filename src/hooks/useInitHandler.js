import { useCallback, useState } from 'react';
import { init_scheduler_handler } from '@/flow/init_scheduler_handler.txn';

/**
 * Hook to initialize FlowPayScheduler Handler
 * This is required before users can create streams
 */
export function useInitHandler() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [error, setError] = useState(null);

  const initHandler = useCallback(async () => {
    try {
      setIsInitializing(true);
      setError(null);
      setTxStatus('preparing');

      await init_scheduler_handler((status) => {
        setTxStatus(status);
      });

      setTxStatus('success');
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      setTxStatus(null);
      console.error('Failed to initialize handler:', err);
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  return {
    initHandler,
    isInitializing,
    txStatus,
    error,
  };
}

export default useInitHandler;
