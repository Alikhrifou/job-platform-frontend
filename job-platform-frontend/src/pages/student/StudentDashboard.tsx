import { useAppSelector } from '../../hooks/redux';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function StudentDashboard() {
  const { email } = useAppSelector((s) => s.auth);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">{email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="My Profile"
          description="Update your skills, GPA, and bio"
          icon="🎓"
          to="/student/profile"
        />
        <DashboardCard
          title="Browse Jobs"
          description="Find internships and job offers"
          icon="💼"
          to="/jobs"
        />
        <DashboardCard
          title="My Applications"
          description="Track your application status"
          icon="📋"
          to="/student/applications"
        />
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
