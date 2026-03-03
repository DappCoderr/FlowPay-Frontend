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
        await setupFlowPayAccount((status) => {
          // Provide richer setup status to UI via setupError for now.
          if (status === 'preparing') setSetupError('Preparing account setup...')
          if (status === 'submitting') setSetupError('Submitting setup transaction...')
          if (status === 'pending') setSetupError('Waiting for setup to be sealed...')
          if (status === 'sealed') setSetupError(null)
        })
      } catch (err) {
        // Surface friendly error messages for common wallet issues.
        const message = err instanceof Error ? err.message : String(err)
        if (message.includes('Missing FlowToken vault')) {
          setSetupError(
            'Account setup failed: missing FlowToken vault. Please deposit FLOW and create a vault.'
          )
        } else {
          setSetupError(message)
        }
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
