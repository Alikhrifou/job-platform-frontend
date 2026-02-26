import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../features/auth/authSlice';
import Button from '../ui/Button';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role, email } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const dashboardPath =
    role === 'STUDENT' ? '/student' :
    role === 'COMPANY' ? '/company' :
    role === 'ADMIN'   ? '/admin' : '/jobs';

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/jobs" className="text-xl font-bold text-blue-600">
          JobMatch
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/jobs" className="text-sm text-gray-600 hover:text-blue-600">
            Jobs
          </Link>

          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="text-sm text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
              <span className="text-xs text-gray-400">{email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
