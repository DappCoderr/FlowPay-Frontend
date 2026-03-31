import { useCallback, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { shortAddress } from '@/utils/format';
import { Logo, Button } from '@/components/atoms';

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

  return (
    <header className="bg-black border-b border-white/10 backdrop-blur-lg sticky top-0 z-40 shadow-lg\">
      <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          {isConnected && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'text-sm font-medium text-white'
                    : 'text-sm font-medium text-white/60 hover:text-white transition-colors'
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  isActive
                    ? 'text-sm font-medium text-white'
                    : 'text-sm font-medium text-white/60 hover:text-white transition-colors'
                }
              >
                History
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? 'text-sm font-medium text-white'
                    : 'text-sm font-medium text-white/60 hover:text-white transition-colors'
                }
              >
                About
              </NavLink>
            </>
          )}
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              isActive
                ? 'text-sm font-medium text-white'
                : 'text-sm font-medium text-white/60 hover:text-white transition-colors'
            }
          >
            FAQ
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <span className="hidden sm:inline-block text-sm text-white/70">
                {shortAddress(user.addr)}
              </span>
              <Button variant="ghost" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={login}
              className="text-sm px-3 py-1.5"
            >
              Connect
            </Button>
          )}

          <Button
            variant="icon"
            className="md:hidden text-white/80"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-2">
            {isConnected && (
              <>
                <NavLink
                  to="/"
                  className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/history"
                  className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  History
                </NavLink>
                <NavLink
                  to="/about"
                  className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </NavLink>
              </>
            )}
            <NavLink
              to="/faq"
              className="text-sm font-medium text-white/80 hover:text-white py-2 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              FAQ
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
