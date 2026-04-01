import { useState, useCallback } from 'react';
import { useAuth, useCheckHandlerInit } from '@/hooks';
import { shortAddress } from '@/utils/format';
import { Button } from '@/components/atoms';
import { Card } from '@/components/molecules';
import {
  StreamAnalytics,
  CreateStreamModal,
  SendFlowModal,
  ReceiveFlowModal,
  HandlerSetup,
} from '@/components/organisms';
import { Plus, TrendingUp, AlertCircle } from 'lucide-react';

/**
 * Home Page
 * Premium dashboard with smooth interactions
 */
export default function Home() {
  const { user, balance, isLoading } = useAuth();
  const { isInitialized, isChecking } = useCheckHandlerInit(user?.addr);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [setupRefresh, setSetupRefresh] = useState(0);
  const address = user?.addr;

  const handleSetupComplete = useCallback(() => {
    setSetupRefresh((prev) => prev + 1);
  }, []);

  if (isLoading || isChecking) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-12 bg-white/5 rounded-lg skeleton w-1/3" />
          <div className="h-20 bg-white/5 rounded-xl skeleton" />
          <div className="h-48 bg-white/5 rounded-xl skeleton" />
        </div>
      </div>
    );
  }

  // Show setup if handler not initialized
  if (!isInitialized && isInitialized !== null) {
    return (
      <div className="space-y-8">
        <div className="animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Welcome to FlowPay
          </h1>
          <p className="text-white/60 text-lg">
            Let's initialize your account for autonomous payment streaming
          </p>
        </div>
        <div className="grid grid-cols-12 gap-6 animate-slide-up animation-delay-100">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <HandlerSetup 
              userAddress={address} 
              onComplete={handleSetupComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="grid grid-cols-12 gap-6 items-start animate-fade-in">
        <div className="col-span-12 lg:col-span-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
            Dashboard
          </h1>
          <p className="text-white/60 text-lg">
            Manage your payment streams and view real-time analytics
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 flex gap-2 sm:gap-3 animate-fade-in animation-delay-100">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setCreateModalOpen(true)}
            className="flex-1 sm:flex-none group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Create Stream</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* User Info Cards Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 animate-fade-in animation-delay-100">
        {/* Account Card */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Card
            title="Connected Account"
            variant="elevated"
            interactive={false}
          >
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Wallet Address
                </p>
                <p className="text-sm font-mono text-white/90 break-all bg-white/5 p-3 rounded-lg">
                  {address ? shortAddress(address) : 'Not connected'}
                </p>
              </div>
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                  FLOW Balance
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                    {balance ? parseFloat(balance).toFixed(2) : '—'}
                  </p>
                  <span className="text-sm text-white/60">FLOW</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions Card */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Card
            title="Quick Actions"
            variant="elevated"
            interactive={false}
          >
            <div className="space-y-3">
              <Button
                onClick={() => setSendModalOpen(true)}
                className="w-full justify-center"
                variant="secondary"
                size="default"
              >
                Send FLOW
              </Button>
              <Button
                onClick={() => setReceiveModalOpen(true)}
                className="w-full justify-center"
                variant="secondary"
                size="default"
              >
                Receive FLOW
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Card */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Card
            title="Getting Started"
            variant="accent"
            interactive={false}
          >
            <div className="space-y-3">
              <p className="text-sm text-white/80 leading-relaxed">
                Create your first payment stream to get started. Add recipients, set frequency, and let FlowPay handle the rest.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                className="w-full justify-center"
              >
                Create First Stream →
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Creator Analytics - Full Width */}
      {address && (
        <div className="col-span-full animate-fade-in animation-delay-200">
          <StreamAnalytics creatorAddress={address} />
        </div>
      )}

      {/* Modals */}
      <CreateStreamModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        userAddress={address}
      />
      <SendFlowModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        userAddress={address}
        balance={balance}
      />
      <ReceiveFlowModal
        open={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        userAddress={address}
      />
    </div>
  );
}