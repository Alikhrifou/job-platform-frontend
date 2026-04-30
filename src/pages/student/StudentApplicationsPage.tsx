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

function InterviewPanel({ app, onUpdated }: { app: ApplicationResponse; onUpdated: (updated: ApplicationResponse) => void }) {
  const { t } = useTranslation();
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const respond = async (action: 'ACCEPT' | 'RESCHEDULE') => {
    setLoading(true);
    try {
      const res = await api.patch<ApplicationResponse>(`/api/applications/${app.id}/interview-response`, {
        action,
        rescheduleNote: action === 'RESCHEDULE' ? note : undefined,
      });
      onUpdated(res.data);
      setRescheduleMode(false);
      setNote('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 px-4 py-3 flex flex-col gap-2">
      <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">🗓 {t('student.interviewScheduled')}</p>

      {app.interviewDate ? (
        <p className="text-sm font-medium text-gray-800 dark:text-slate-200">
          📅 {new Date(app.interviewDate).toLocaleString()}
        </p>
      ) : (
        <p className="text-sm text-gray-500 dark:text-slate-400">{t('student.interviewDetailsComingSoon')}</p>
      )}

      {app.interviewLink && (
        <a
          href={app.interviewLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 underline break-all"
        >
          🔗 {t('student.joinInterview')}
        </a>
      )}

      {/* Confirmed badge */}
      {app.interviewConfirmed && (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400">
          ✅ {t('student.interviewConfirmed')}
        </span>
      )}

      {/* Reschedule requested badge */}
      {app.rescheduleRequested && !app.interviewConfirmed && (
        <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-3 py-2">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">⏳ {t('student.rescheduleRequested')}</p>
          {app.rescheduleNote && (
            <p className="mt-0.5 text-xs text-gray-600 dark:text-slate-300">"{app.rescheduleNote}"</p>
          )}
        </div>
      )}

      {/* Action buttons — only show if date is set and no response yet */}
      {app.interviewDate && !app.interviewConfirmed && !app.rescheduleRequested && (
        <>
          {!rescheduleMode ? (
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => respond('ACCEPT')}
                disabled={loading}
                className="rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
              >
                {loading ? '…' : `✓ ${t('student.acceptInterview')}`}
              </button>
              <button
                onClick={() => setRescheduleMode(true)}
                className="rounded-lg border border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 px-4 py-1.5 text-xs font-semibold transition-colors"
              >
                🔁 {t('student.requestReschedule')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('student.rescheduleNotePlaceholder')}
                className="w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-800 dark:text-slate-100 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-amber-300 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => respond('RESCHEDULE')}
                  disabled={loading || !note.trim()}
                  className="rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
                >
                  {loading ? '…' : t('student.sendRescheduleRequest')}
                </button>
                <button
                  onClick={() => { setRescheduleMode(false); setNote(''); }}
                  className="rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-1.5 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function StudentApplicationsPage() {
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    api.get<ApplicationResponse[]>('/api/applications/my-applications')
      .then((r) => setApps(r.data))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdated = (updated: ApplicationResponse) => {
    setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

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
            <div key={app.id} className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 shadow-sm">
              <div className="flex items-center justify-between">
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
              {app.status === 'INTERVIEW_SCHEDULED' && (
                <InterviewPanel app={app} onUpdated={handleUpdated} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
