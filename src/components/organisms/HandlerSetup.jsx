import { useEffect } from 'react';
import { useCheckHandlerInit, useInitHandler } from '@/hooks';
import { Button } from '@/components/atoms';
import { Card } from '@/components/molecules';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

/**
 * HandlerSetup Component
 * Guides users to initialize FlowPayScheduler Handler if not yet done
 * Handler is required for autonomous stream execution
 */
export function HandlerSetup({ userAddress, onComplete }) {
  const { isInitialized, isChecking } = useCheckHandlerInit(userAddress);
  const { initHandler, isInitializing, txStatus, error } = useInitHandler();

  useEffect(() => {
    if (isInitialized === true) {
      onComplete?.();
    }
  }, [isInitialized, onComplete]);

  if (isChecking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin">
              <Loader className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-white/60">Checking account setup...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isInitialized) {
    return (
      <div className="space-y-6">
        <Card className="bg-green-500/10 border-green-500/20">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Account Ready
              </h3>
              <p className="text-green-400/80">
                Your account is set up and ready to create payment streams
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Not initialized - show setup flow
  return (
    <div className="space-y-6">
      <Card className="bg-blue-500/10 border-blue-500/20">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Account Setup Required
              </h3>
              <p className="text-blue-400/80 text-sm mb-4">
                Your account needs to be initialized to enable autonomous stream
                execution. This is a one-time setup that allows FlowPay to
                schedule and execute your payment streams automatically.
              </p>
              <div className="space-y-3 text-sm text-blue-400/70">
                <div className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>Enables automatic payment scheduling</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>One-time transaction required</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>Minimal FLOW cost (~0.001 FLOW)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {txStatus === 'preparing' && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-400 text-sm">Preparing transaction...</p>
            </div>
          )}

          {txStatus === 'submitting' && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-400 text-sm">Submitting transaction...</p>
            </div>
          )}

          {txStatus === 'pending' && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-400 text-sm">
                Transaction pending on-chain...
              </p>
            </div>
          )}

          {txStatus === 'sealed' && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 text-sm">
                ✓ Setup completed successfully! Refreshing...
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-blue-500/20">
            <Button
              onClick={initHandler}
              disabled={isInitializing}
              className="w-full"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Account'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default HandlerSetup;
