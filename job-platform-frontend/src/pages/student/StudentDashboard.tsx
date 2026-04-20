import { useAppSelector } from '../../hooks/redux';
import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'My Profile',
    description: 'Update your skills, GPA, portfolio and bio',
    to: '/student/profile',
    gradient: 'from-indigo-500 to-violet-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Browse Jobs',
    description: 'Discover internships and full-time opportunities',
    to: '/jobs',
    gradient: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'My Applications',
    description: 'Track the status of your job applications',
    to: '/student/applications',
    gradient: 'from-emerald-500 to-teal-500',
    icon: (
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

export default function StudentDashboard() {
  const { email } = useAppSelector((s) => s.auth);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-indigo-600">Student Portal</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Welcome back!</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{email}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-800/60"
          >
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-md`}>
              {card.icon}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white transition-colors group-hover:text-indigo-700">{card.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{card.description}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
              Open <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

