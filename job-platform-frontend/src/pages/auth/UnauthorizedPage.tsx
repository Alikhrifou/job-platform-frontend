import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="text-6xl">🔒</div>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Access Denied</h1>
      <p className="mt-2 text-gray-500">You don't have permission to view this page.</p>
      <Link to="/jobs" className="mt-6">
        <Button>Go to Jobs</Button>
      </Link>
    </div>
  );
}
