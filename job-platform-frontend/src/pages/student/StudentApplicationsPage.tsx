import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import type { ApplicationResponse } from '../../types';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  SHORTLISTED: 'bg-blue-100 text-blue-700',
  INTERVIEW_SCHEDULED: 'bg-purple-100 text-purple-700',
  OFFER_EXTENDED: 'bg-emerald-100 text-emerald-700',
  DECLINED: 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300',
};

export default function StudentApplicationsPage() {
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    api.get<ApplicationResponse[]>('/api/applications/my-applications')
      .then((r) => setApps(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700" />)}
    </div>
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t('student.myApplications')}</h1>

      {apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-slate-600 py-16 text-center text-gray-400 dark:text-slate-500">
          <p className="text-4xl">📭</p>
          <p className="mt-2">{t('student.noApplications')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {apps.map((app) => (
            <div key={app.id} className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 shadow-sm">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{app.jobTitle}</h3>
                <p className="text-sm text-blue-600">{app.companyName}</p>
                <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{t('student.applied')} {new Date(app.appliedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_STYLES[app.status] ?? 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'}`}>
                  {app.status.replace('_', ' ')}
                </span>
                {app.matchScore !== undefined && (
                  <span className="text-xs text-gray-500 dark:text-slate-400">{t('student.match')}: {app.matchScore.toFixed(0)}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
