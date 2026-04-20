import { useAppSelector } from '../../hooks/redux';
import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'Users',
    description: 'Manage students, companies and admins',
    to: '/admin/users',
    gradient: 'from-indigo-500 to-violet-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Jobs',
    description: 'Oversee all job listings on the platform',
    to: '/admin/jobs',
    gradient: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Applications',
    description: 'Monitor all submitted applications',
    to: '/admin/applications',
    gradient: 'from-emerald-500 to-teal-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Skills',
    description: 'Manage the platform skill catalog',
    to: '/admin/skills',
    gradient: 'from-amber-500 to-orange-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const { email } = useAppSelector((s) => s.auth);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">Admin Portal</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{email}</p>
      </div>

      {/* Stats banner */}
      <div className="mb-8 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
            <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">Administrator Access</p>
            <p className="text-xs text-amber-600">You have full platform control and visibility</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-800/60"
          >
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-md`}>
              {card.icon}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 transition-colors">{card.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{card.description}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
              Manage <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
