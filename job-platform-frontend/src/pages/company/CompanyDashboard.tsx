import { useAppSelector } from '../../hooks/redux';
import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'Company Profile',
    description: 'Update your company info, description and branding',
    to: '/company/profile',
    gradient: 'from-indigo-500 to-violet-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Post a Job',
    description: 'Create a new job offer or internship listing',
    to: '/company/jobs/new',
    gradient: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: 'My Job Offers',
    description: 'Manage, edit and close your active job postings',
    to: '/company/jobs',
    gradient: 'from-amber-500 to-orange-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Applications',
    description: 'Review candidates and their match scores',
    to: '/company/jobs',
    gradient: 'from-emerald-500 to-teal-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function CompanyDashboard() {
  const { email } = useAppSelector((s) => s.auth);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">Company Portal</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">{email}</p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.to + card.title}
            to={card.to}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
          >
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-md`}>
              {card.icon}
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{card.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{card.description}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
              Open <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
