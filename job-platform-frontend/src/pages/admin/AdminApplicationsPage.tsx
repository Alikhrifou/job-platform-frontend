import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { ApplicationResponse } from '../../types';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  SHORTLISTED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  INTERVIEW_SCHEDULED: 'bg-indigo-100 text-indigo-700',
  OFFER_EXTENDED: 'bg-purple-100 text-purple-700',
  DECLINED: 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200',
};

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApplicationResponse[]>('/api/admin/applications')
      .then((r) => setApps(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin" className="text-sm text-indigo-600 hover:underline">&larr; Dashboard</Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">All Applications</h1>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>
      ) : apps.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">No applications yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 dark:bg-slate-800 text-xs uppercase text-gray-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 dark:bg-slate-800">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400 dark:text-slate-500">{a.id}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-slate-100">{a.studentName ?? `Student #${a.studentId}`}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{a.jobTitle}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{a.companyName}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[a.status] ?? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200'}`}>
                      {a.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{a.matchScore != null ? `${a.matchScore}%` : '—'}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-slate-400 text-xs">{a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
