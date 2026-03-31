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
import { Plus } from 'lucide-react';

/**
 * Home Page
 * Main dashboard for FlowPay users
 * Features:
 * - Wallet connection & balance display
 * - Create new payment streams
 * - View and manage existing streams
 * - Creator analytics
 * - Send/Receive FLOW tokens
 */
export default function Home() {
  const { user, balance, isLoading } = useAuth();
  const { isInitialized, isChecking } = useCheckHandlerInit(user?.addr);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [setupRefresh, setSetupRefresh] = useState(0);
  const address = user?.addr;

  const openCreateModal = useCallback(() => setCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => {
    setCreateModalOpen(false);
  }, []);
  const openSendModal = useCallback(() => setSendModalOpen(true), []);
  const closeSendModal = useCallback(() => setSendModalOpen(false), []);
  const openReceiveModal = useCallback(() => setReceiveModalOpen(true), []);
  const closeReceiveModal = useCallback(() => setReceiveModalOpen(false), []);

  const handleSetupComplete = useCallback(() => {
    // Force re-check handler initialization after setup
    setSetupRefresh((prev) => prev + 1);
  }, []);

  if (isLoading || isChecking) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-white/10 rounded w-1/4" />
          <div className="h-32 bg-white/10 rounded" />
          <div className="h-64 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  // Show setup if handler not initialized
  if (!isInitialized && isInitialized !== null) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="col-span-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">Welcome to FlowPay</h1>
          <p className="text-white/60 text-sm md:text-base">
            Let's set up your account to start creating payment streams
          </p>
        </div>
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
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
    <div className="space-y-8 lg:space-y-10">
      {/* Header Section - Full Width */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start mb-2">
        <div className="col-span-12 lg:col-span-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3">Dashboard</h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Manage your payment streams and view analytics
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 flex gap-2 sm:gap-3">
          <Button variant="primary" size="lg" onClick={openCreateModal} className="flex-1 sm:flex-none">
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Create Stream</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>
      </div>

      {/* User Info Cards - 12 Column Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-8">
        {/* Account Card - 12/4 cols */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Card
            title="Connected Account"
            className="bg-white/3 border border-white/10 h-full shadow-lg hover:shadow-xl transition-all"
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-wide mb-2 font-medium">
                  Address
                </p>
                <p className="text-sm font-mono text-white break-all">
                  {address ? shortAddress(address) : 'Not connected'}
                </p>
              </div>
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-white/60 uppercase tracking-wide mb-2 font-medium">
                  FLOW Balance
                </p>
                <p
                  className={`text-3xl font-bold ${isLoading ? 'text-white/40' : 'text-cyan-400'}`}
                >
                  {balance ? parseFloat(balance).toFixed(2) : '—'}
                  <span className="text-lg text-white/60 ml-2">FLOW</span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions Card - 12/4 cols */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Card
            title="Quick Actions"
            className="bg-white/3 border border-white/10 h-full shadow-lg hover:shadow-xl transition-all"
          >
            <div className="space-y-2.5">
              <Button
                onClick={openSendModal}
                className="w-full justify-center"
                variant="secondary"
                size="sm"
              >
                Send FLOW
              </Button>
              <Button
                onClick={openReceiveModal}
                className="w-full justify-center"
                variant="secondary"
                size="sm"
              >
                Receive FLOW
              </Button>
            </div>
          </Card>
        </div>

        {/* Help Card - 12/4 cols */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <Card
            title="Need Help?"
            className="bg-linear-to-br from-blue-500/10 to-white/0 border border-blue-500/20 h-full shadow-lg hover:shadow-xl transition-all"
          >
            <p className="text-sm text-white/80 mb-4 leading-relaxed">
              Learn how FlowPay works and how to create payment streams.
            </p>
            <a
              href="/faq"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center group"
            >
              View FAQ
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </Card>
        </div>
      </div>

      {/* Creator Analytics - Full Width */}
      {address && (
        <div className="col-span-full">
          <StreamAnalytics creatorAddress={address} />
        </div>
      )}

      {/* Modals */}
      <CreateStreamModal
        open={createModalOpen}
        onClose={closeCreateModal}
        userAddress={address}
      />
      <SendFlowModal
        open={sendModalOpen}
        onClose={closeSendModal}
        userAddress={address}
        balance={balance}
      />
      <ReceiveFlowModal
        open={receiveModalOpen}
        onClose={closeReceiveModal}
        userAddress={address}
      />
    </div>
  );
}
