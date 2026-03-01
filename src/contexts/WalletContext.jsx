import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import fcl from '../flow/fclConfig'
import { setupFlowPayAccount } from '@/flow/flowpay'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [user, setUser] = useState({ loggedIn: false })
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupError, setSetupError] = useState(null)

  useEffect(() => {
    const unsubscribe = fcl.currentUser().subscribe(setUser)
    return () => unsubscribe()
  }, [])

  const login = useCallback(() => fcl.authenticate(), [])
  const logout = useCallback(() => fcl.unauthenticate(), [])

  // Automatically attempt FlowPay account setup once after user connects.
  useEffect(() => {
    const runSetup = async () => {
      if (!user?.addr || isSettingUp) return
      setIsSettingUp(true)
      setSetupError(null)
      try {
        await setupFlowPayAccount()
      } catch (err) {
        // Surface minimal error; callers can inspect setupError if needed.
        setSetupError(err instanceof Error ? err.message : String(err))
      } finally {
        setIsSettingUp(false)
      }
    }

    runSetup()
  }, [user?.addr, isSettingUp])

  const value = useMemo(
    () => ({ user, login, logout, isSettingUp, setupError }),
    [user, login, logout, isSettingUp, setupError]
  )

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
