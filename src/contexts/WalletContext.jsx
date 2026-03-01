import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import fcl from '../flow/fclConfig'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [user, setUser] = useState({ loggedIn: false })

  useEffect(() => {
    const unsubscribe = fcl.currentUser().subscribe(setUser)
    return () => unsubscribe()
  }, [])

  const login = useCallback(() => fcl.authenticate(), [])
  const logout = useCallback(() => fcl.unauthenticate(), [])

  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout]
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
