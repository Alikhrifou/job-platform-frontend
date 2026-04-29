import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import type { JobOfferResponse } from '../../types';
import Button from '../../components/ui/Button';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobOfferResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<JobOfferResponse | null>(null);
  const { t } = useTranslation();

  const load = () => {
    setLoading(true);
    api.get<JobOfferResponse[]>('/api/admin/jobs')
      .then((r) => setJobs(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/api/admin/jobs/${deleteTarget.id}`);
    setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin" className="text-sm text-indigo-600 hover:underline">&larr; {t('admin.dashboard')}</Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{t('admin.manageJobs')}</h1>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 dark:bg-slate-800 text-xs uppercase text-gray-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 cursor-pointer">ID</th>
                <th className="px-4 py-3 cursor-pointer">{t('admin.title')}</th>
                <th className="px-4 py-3 cursor-pointer">{t('admin.company')}</th>
                <th className="px-4 py-3 cursor-pointer">{t('company.location')}</th>
                <th className="px-4 py-3 cursor-pointer">{t('admin.type')}</th>
                <th className="px-4 py-3 cursor-pointer">{t('admin.status')}</th>
                <th className="px-4 py-3 cursor-pointer">{t('admin.apps')}</th>
                <th className="px-4 py-3 cursor-pointer text-right">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map((j) => (
                <tr key={j.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400 dark:text-slate-500">{j.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{j.title}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{j.companyName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{j.location}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {j.jobType ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${j.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {j.isActive ? t('admin.active') : t('admin.inactive')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{j.applicationsCount}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(j)}>{t('common.delete')}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('company.deleteJob')}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              {t('admin.deleteJobConfirm', { title: deleteTarget.title })}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
              <Button variant="danger" onClick={confirmDelete}>{t('common.delete')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
