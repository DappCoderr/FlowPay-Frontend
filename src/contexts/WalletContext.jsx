import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAuth } from '@/hooks';

const WalletContext = createContext();

/**
 * WalletProvider - Provides wallet context with auth and account setup
 * Uses the useAuth hook for authentication state management
 * Adds FlowPay account setup logic on top
 * eslint-disable-next-line react-refresh/only-export-components
 */
export function WalletProvider({ children }) {
  // Use the useAuth hook for all authentication state
  const { user, balance, connectWallet, disconnectWallet, isLoading } =
    useAuth();
  // Setup state (currently disabled - will be used when contracts are deployed)
  // const [isSettingUp, setIsSettingUp] = useState(false)
  // const [setupError, setSetupError] = useState(null)

  // Backward compatibility aliases
  const login = useCallback(() => connectWallet(), [connectWallet]);
  const logout = useCallback(() => disconnectWallet(), [disconnectWallet]);

  // Setup FlowPay account - currently disabled as it requires contract deployment
  // Uncomment when contracts are deployed on testnet/mainnet
  /*
  useEffect(() => {
    const runSetup = async () => {
      if (!user?.addr || isSettingUp) return
      setIsSettingUp(true)
      setSetupError(null)
      try {
        // Setup would be called here once contracts are deployed
        // await setupFlowPayAccount((status) => {
        //   if (status === 'sealed') setSetupError(null)
        // })
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setSetupError(message)
      } finally {
        setIsSettingUp(false)
      }
    }

    runSetup()
  }, [user?.addr, isSettingUp])
  */

  // Provide all auth and wallet context
  const value = useMemo(
    () => ({
      user,
      balance,
      login,
      logout,
      connectWallet,
      disconnectWallet,
      isLoading,
    }),
    [user, balance, login, logout, connectWallet, disconnectWallet, isLoading]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
/**
 * useWallet - Hook to access wallet context
 * Provides backward compatibility for existing components using WalletContext
 * For new code, use useAuth() hook directly
 */
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
