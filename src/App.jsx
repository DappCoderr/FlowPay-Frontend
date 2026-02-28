import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Landing from './pages/Landing'
import { WalletProvider, useWallet } from './contexts/WalletContext'
import { useState } from 'react'

function Header() {
  const { user, logout, login } = useWallet()
  const [open, setOpen] = useState(false)

  const short = (addr = '') => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '')

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold">FP</div>
          <div>
            <h1 className="text-xl font-semibold">FlowPay</h1>
            <p className="text-xs text-gray-500">Payments on Flow</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-sm font-medium text-purple-600' : 'text-sm font-medium text-gray-700 hover:text-gray-900'}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'text-sm font-medium text-purple-600' : 'text-sm font-medium text-gray-700 hover:text-gray-900'}>About</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {user && user.addr ? (
            <>
              <span className="hidden sm:inline-block text-sm text-gray-700">{short(user.addr)}</span>
              <button onClick={logout} className="text-sm px-3 py-1 bg-red-600 text-white rounded-md">Disconnect</button>
            </>
          ) : (
            <button onClick={login} className="text-sm px-3 py-1 bg-purple-600 text-white rounded-md">Connect</button>
          )}

          <button className="md:hidden text-gray-600" onClick={() => setOpen(o => !o)} aria-label="menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-2">
            <NavLink to="/" className="text-sm font-medium text-gray-700">Home</NavLink>
            <NavLink to="/about" className="text-sm font-medium text-gray-700">About</NavLink>
          </div>
        </div>
      )}
    </header>
  )
}

function AppContent() {
  const { user } = useWallet()

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/" element={user && user.addr ? <Home /> : <Landing />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
}

export default App
