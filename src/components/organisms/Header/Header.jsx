import { useCallback, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { shortAddress } from '@/utils/format';
import { Logo, Button } from '@/components/atoms';
import { Menu, X } from 'lucide-react';

/**
 * Enhanced Header Component
 * - Better mobile responsive design
 * - Smooth animations
 * - Premium styling
 */
export function Header() {
  const navigate = useNavigate();
  const { user, login, logout } = useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isConnected = !!user?.addr;

  const handleDisconnect = useCallback(() => {
    logout();
    setMobileOpen(false);
    navigate('/', { replace: true });
  }, [logout, navigate]);

  const navLink = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-white font-semibold'
        : 'text-white/60 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-20 flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 mx-auto">
            {isConnected && (
              <>
                <NavLink to="/" className={navLink}>
                  Home
                </NavLink>
                <NavLink to="/history" className={navLink}>
                  History
                </NavLink>
                <NavLink to="/about" className={navLink}>
                  About
                </NavLink>
              </>
            )}
            <NavLink to="/faq" className={navLink}>
              FAQ
            </NavLink>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden sm:flex items-center gap-4">
            {isConnected ? (
              <>
                <span className="hidden md:inline-block text-sm text-white/70 px-3 py-2 rounded-lg bg-white/5">
                  {shortAddress(user.addr)}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={login}>
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/50 backdrop-blur-xl animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
            {/* Navigation Links */}
            {isConnected && (
              <>
                <NavLink
                  to="/"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/history"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/history'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  History
                </NavLink>
                <NavLink
                  to="/about"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/about'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </NavLink>
              </>
            )}
            <NavLink
              to="/faq"
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/faq'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-white/70 hover:bg-white/5'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </NavLink>

            {/* Divider */}
            <div className="border-t border-white/10 my-3" />

            {/* Account Section */}
            {isConnected ? (
              <>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Connected As</p>
                  <p className="text-sm font-mono text-white break-all">
                    {shortAddress(user.addr)}
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDisconnect}
                  className="w-full justify-center"
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={login}
                className="w-full justify-center"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}