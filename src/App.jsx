import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { UIProvider } from '@/contexts/UIContext';
import { AppRoutes } from '@/router';
import { MainLayout } from '@/components/templates';

function AppContent() {
  const { user, isLoading } = useWallet();
  const isConnected = !!user?.addr;

  return (
    <MainLayout>
      <AppRoutes isConnected={isConnected} isLoading={isLoading} />
    </MainLayout>
  );
}

function App() {
  return (
    <WalletProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </WalletProvider>
  );
}

export default App;
