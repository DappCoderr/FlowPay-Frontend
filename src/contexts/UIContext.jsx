import React, { createContext, useContext, useState } from 'react'

const UIContext = createContext()

export function UIProvider({ children }) {
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)

  return (
    <UIContext.Provider value={{ howItWorksOpen, setHowItWorksOpen }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
