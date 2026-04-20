import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const roleHomeMap: Record<string, string> = {
  STUDENT: '/student',
  COMPANY: '/company',
  ADMIN: '/admin',
};

export default function GuestRoute() {
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);

  if (isAuthenticated && role) {
    return <Navigate to={roleHomeMap[role] ?? '/jobs'} replace />;
  }

  return <Outlet />;
}
