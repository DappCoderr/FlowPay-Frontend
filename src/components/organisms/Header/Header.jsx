import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useWallet } from '@/contexts/WalletContext'
import { shortAddress } from '@/utils/format'
import { Logo, Button } from '@/components/atoms'

export function Header() {
  const { user, login, logout } = useWallet()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isConnected = !!(user?.addr)

  return (
    <header className="bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          {isConnected && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'text-sm font-medium text-white' : 'text-sm font-medium text-white/60 hover:text-white'
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? 'text-sm font-medium text-white' : 'text-sm font-medium text-white/60 hover:text-white'
                }
              >
                About
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <span className="hidden sm:inline-block text-sm text-white/70">{shortAddress(user.addr)}</span>
              <Button variant="ghost" onClick={logout}>Disconnect</Button>
            </>
          ) : (
            <Button variant="primary" onClick={login} className="text-sm px-3 py-1.5">
              Connect
            </Button>
          )}

          <Button
            variant="icon"
            className="md:hidden text-white/80"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-2">
            {isConnected && (
              <>
                <NavLink to="/" className="text-sm font-medium text-white/80 hover:text-white py-2" onClick={() => setMobileOpen(false)}>Home</NavLink>
                <NavLink to="/about" className="text-sm font-medium text-white/80 hover:text-white py-2" onClick={() => setMobileOpen(false)}>About</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
