import { useEffect, useState, useCallback } from 'react'
import fcl from '@/flow/fclConfig'
import { getFlowBalance } from '../flow/send_flow_tokens.txn'

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
  const [user, setUser] = useState({ loggedIn: false, addr: null })
  const [balance, setBalance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Subscribe to FCL user state changes
  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = fcl.currentUser().subscribe(async (currentUser) => {
      setUser(currentUser)
      setError(null)

      // Fetch balance when user connects
      if (currentUser?.loggedIn && currentUser?.addr) {
        try {
          const userBalance = await getFlowBalance(currentUser.addr)
          setBalance(parseFloat(userBalance).toFixed(2))
        } catch (err) {
          console.error('Error fetching balance:', err)
          setError('Failed to fetch wallet balance')
          setBalance(null)
        } finally {
          setIsLoading(false)
        }
      } else {
        // Clear balance when user disconnects
        setBalance(null)
        setIsLoading(false)
      }
    })

    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      await fcl.authenticate()
    } catch (err) {
      console.error('Wallet connection failed:', err)
      setError('Failed to connect wallet')
      setIsLoading(false)
    }
  }, [])

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      await fcl.unauthenticate()
      setBalance(null)
      setUser({ loggedIn: false, addr: null })
    } catch (err) {
      console.error('Wallet disconnection failed:', err)
      setError('Failed to disconnect wallet')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!user?.addr) return

    try {
      setIsLoading(true)
      setError(null)
      const userBalance = await getFlowBalance(user.addr)
      setBalance(parseFloat(userBalance).toFixed(2))
    } catch (err) {
      console.error('Error refreshing balance:', err)
      setError('Failed to refresh balance')
    } finally {
      setIsLoading(false)
    }
  }, [user?.addr])

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
  }
}

export default useAuth
