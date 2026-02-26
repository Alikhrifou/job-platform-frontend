import { useAppSelector } from '../../hooks/redux';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { email } = useAppSelector((s) => s.auth);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">{email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Users', icon: '👥', to: '/admin/users' },
          { title: 'Jobs', icon: '💼', to: '/admin/jobs' },
          { title: 'Applications', icon: '📋', to: '/admin/applications' },
          { title: 'Skills', icon: '🛠️', to: '/admin/skills' },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl">{item.icon}</div>
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <Link to={item.to} className="mt-4 block">
              <Button size="sm" variant="secondary" className="w-full">Manage →</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
