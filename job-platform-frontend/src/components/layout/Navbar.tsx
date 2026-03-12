import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../features/auth/authSlice';
import Button from '../ui/Button';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, email } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const dashboardPath =
    role === 'STUDENT' ? '/student' :
    role === 'COMPANY' ? '/company' :
    role === 'ADMIN'   ? '/admin' : '/jobs';

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-colors duration-200 ${
        isActive(to)
          ? 'text-indigo-600'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
      {isActive(to) && (
        <span className="absolute -bottom-[21px] left-0 h-0.5 w-full rounded-full bg-indigo-600" />
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        {/* Logo */}
        <Link to="/jobs" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-200">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-lg font-bold text-transparent">
            JobMatch
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLink('/jobs', 'Jobs')}
          {isAuthenticated && navLink(dashboardPath, 'Dashboard')}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white shadow">
                  {(email ?? 'U').charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[140px] truncate text-xs font-medium text-slate-600">
                  {email}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
