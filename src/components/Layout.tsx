import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';
import { ChatbotWidget } from './ChatbotWidget';

export function Layout() {
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const avatarStorageKey = user?._id ? `profile-avatar-${user._id}` : '';
  const avatarUrl = user?.avatarUrl || (avatarStorageKey ? localStorage.getItem(avatarStorageKey) : '') || '';
  const userInitials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'U';

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-white after:transition-transform after:duration-300 after:content-[''] ${
      isActive
        ? 'text-white after:scale-x-100'
        : 'text-white/95 hover:text-white after:scale-x-0 hover:after:scale-x-100'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/20 bg-sky-500/95 px-6 py-3 text-white shadow-[0_10px_30px_rgba(14,116,144,0.22)] backdrop-blur-md">
        <Link className="inline-flex h-10 items-center gap-3" to="/" aria-label="Heshan Moto home">
          <img 
            src="/logo.png" 
            alt="Heshan Moto Logo" 
            className="h-30 w-30 object-contain"
          />
          <span className="text-xl font-bold tracking-tight"><i className='text-indigo-900 font-bold text-2xl'>Heshan</i> <i className="text-amber-400 text-[14px] italic font-medium ml-1">Moto</i> </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-6">
          <NavLink
            to="/"
            className={navLinkClasses}
          >
            Home
          </NavLink>

          <NavLink
            to="/leasing-offer"
            className={navLinkClasses}
          >
            Leasing Offer
          </NavLink>

          <NavLink
            to="/contact-us"
            className={navLinkClasses}
          >
            Contact Us
          </NavLink>

          <NavLink
            to="/compare"
            className={navLinkClasses}
          >
            Compare
          </NavLink>

          <NavLink
            to="/faq"
            className={navLinkClasses}
          >
            Help
          </NavLink>

          {!isAuthenticated && (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
                  isActive
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                }`
              }
            >
              + Register
            </NavLink>
          )}

          {!isAuthenticated && (
            <NavLink
              to="/login"
              className={navLinkClasses}
            >
              Login
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink
              to="/bookings"
              className={navLinkClasses}
            >
              My Bookings
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink
              to="/profile"
              className={navLinkClasses}
            >
              Profile
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={navLinkClasses}
            >
              Admin
            </NavLink>
          )}

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-2 py-1 pr-3 text-sm font-medium text-white/95 backdrop-blur hover:bg-white/20"
                aria-label="Open profile"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-sky-700 text-xs font-bold text-white shadow-sm">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user?.name || 'Profile'} className="h-full w-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </span>
                <span className="max-w-24 truncate">{user?.name}</span>
              </Link>

              <button
                className="text-sm font-medium text-white/95 transition hover:text-white"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  );
}
