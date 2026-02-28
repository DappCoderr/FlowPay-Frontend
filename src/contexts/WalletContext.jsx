import React, { createContext, useContext, useEffect, useState } from 'react'
import fcl from '../flow/fclConfig'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [user, setUser] = useState({ loggedIn: false })

  useEffect(() => {
    const unsubscribe = fcl.currentUser().subscribe(setUser)
    return () => unsubscribe()
  }, [])

  const login = () => fcl.authenticate()
  const logout = () => fcl.unauthenticate()

  return (
    <WalletContext.Provider value={{ user, login, logout }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}
