import { useEffect, useState, useCallback } from 'react';
import * as fcl from '@onflow/fcl';
import { get_flow_token_balance } from '../flow/get_flow_token_balance.script';

/**
 * authHook - Manages wallet authentication and balance
 *
 * Features:
 * - Connect/disconnect wallet
 * - Track user address
 * - Fetch and display wallet balance
 * - Handle loading and error states
 *
 * Usage:
 * const { user, isConnected, balance, isLoading, error, connectWallet, disconnectWallet } = useAuth()
 */
export function useAuth() {
  const [user, setUser] = useState({ loggedIn: false, addr: null });
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // Track if initial auth check is done

  // Subscribe to FCL user state changes
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = fcl.currentUser().subscribe(async (currentUser) => {
      if (!isMounted) return;
      
      setUser(currentUser);
      setError(null);

      // Fetch balance when user connects
      if (currentUser?.loggedIn && currentUser?.addr) {
        try {
          const userBalance = await get_flow_token_balance(currentUser.addr);
          if (isMounted) {
            setBalance(parseFloat(userBalance).toFixed(2));
          }
        } catch (err) {
          console.error('Error fetching balance:', err);
          if (isMounted) {
            setError('Failed to fetch wallet balance');
            setBalance(null);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
            setAuthChecked(true);
          }
        }
      } else {
        // Clear balance when user disconnects
        if (isMounted) {
          setBalance(null);
          setIsLoading(false);
          setAuthChecked(true);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe && unsubscribe();
    };
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fcl.authenticate();
    } catch (err) {
      console.error('Wallet connection failed:', err);
      setError('Failed to connect wallet');
      setIsLoading(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fcl.unauthenticate();
      setBalance(null);
      setUser({ loggedIn: false, addr: null });
    } catch (err) {
      console.error('Wallet disconnection failed:', err);
      setError('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!user?.addr) return;

    try {
      setIsLoading(true);
      setError(null);
      const userBalance = await get_flow_token_balance(user.addr);
      setBalance(parseFloat(userBalance).toFixed(2));
    } catch (err) {
      console.error('Error refreshing balance:', err);
      setError('Failed to refresh balance');
    } finally {
      setIsLoading(false);
    }
  }, [user?.addr]);

  return {
    // User state
    user,
    isConnected: user?.loggedIn ?? false,
    userAddress: user?.addr ?? null,

    // Balance
    balance,

    // States
    isLoading,
    error,

    // Methods
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };
}

export default useAuth;
