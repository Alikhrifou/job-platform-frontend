import { useAppSelector } from '../../hooks/redux';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function CompanyDashboard() {
  const { email } = useAppSelector((s) => s.auth);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">{email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Company Profile" description="Update your company info and logo" icon="🏢" to="/company/profile" />
        <DashboardCard title="Post a Job" description="Create a new job or internship offer" icon="📝" to="/company/jobs/new" />
        <DashboardCard title="My Job Offers" description="Manage your active postings" icon="💼" to="/company/jobs" />
        <DashboardCard title="Applications" description="Review candidates for your jobs" icon="📥" to="/company/applications" />
      </div>
    </div>
  );
}

function DashboardCard({ title, description, icon, to }: {
  title: string; description: string; icon: string; to: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <Link to={to} className="mt-4 block">
        <Button size="sm" variant="secondary" className="w-full">Go →</Button>
      </Link>
    </div>
  );
}
