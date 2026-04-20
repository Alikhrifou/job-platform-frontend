import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import type { JobOfferResponse } from '../../types';
import { useAppSelector } from '../../hooks/redux';

const JOB_TYPE_COLORS: Record<string, string> = {
  INTERNSHIP: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700',
  JOB: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700',
  PART_TIME: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
  CONTRACT: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
};

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);
  const { t } = useTranslation();

  const jobTypeLabels = useMemo<Record<string, string>>(() => ({
    INTERNSHIP: t('jobs.internship'), JOB: t('jobs.fullTime'), PART_TIME: t('jobs.partTime'), CONTRACT: t('jobs.contract'),
  }), [t]);

  const [job, setJob] = useState<JobOfferResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<JobOfferResponse>(`/api/jobs/${jobId}`)
      .then((r) => setJob(r.data))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      setApplying(true);
      setError('');
      await api.post('/api/applications', { jobId: Number(jobId), coverLetter });
      setApplied(true);
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || t('jobs.failedToApply'));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
  if (!job) return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
      <p className="text-lg font-medium">{t('jobs.jobNotFound')}</p>
      <Link to="/jobs" className="mt-3 text-sm text-indigo-600 hover:underline dark:text-indigo-400">← {t('jobs.backToJobs')}</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back */}
      <Link to="/jobs" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('jobs.backToJobs')}
      </Link>

      {/* Main card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            {/* Badges */}
            <div className="mb-3 flex flex-wrap gap-2">
              {job.jobType && (
                <span className={`rounded-lg border px-3 py-0.5 text-xs font-semibold ${JOB_TYPE_COLORS[job.jobType] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {jobTypeLabels[job.jobType] ?? job.jobType}
                </span>
              )}
              {!job.isActive && (
                <span className="rounded-lg border border-red-200 bg-red-50 px-3 py-0.5 text-xs font-semibold text-red-500">{t('jobs.closed')}</span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{job.title}</h1>
            <p className="mt-1.5 text-base font-semibold text-indigo-600 dark:text-indigo-400">{job.companyName}</p>

            {/* Meta info */}
            <div className="mt-3 flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
              {(job.salary || job.salaryRange) && (
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.salaryRange ?? `${job.salary?.toLocaleString()} DA/year`}
                </span>
              )}
              {job.closingDate && (
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Closes {new Date(job.closingDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Apply button */}
          <div className="shrink-0">
            {applied ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5">
                <svg className="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-emerald-700">{t('jobs.applied')}</span>
              </div>
            ) : role === 'STUDENT' && job.isActive ? (
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? t('common.cancel') : t('jobs.applyNow')}
              </Button>
            ) : !isAuthenticated && job.isActive ? (
              <Button onClick={() => navigate('/login')}>{t('jobs.loginToApply')}</Button>
            ) : null}
          </div>
        </div>

        {/* Apply form */}
        {showForm && (
          <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-800 dark:bg-indigo-950/30">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{t('jobs.yourApplication')}</h3>
            <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">{t('jobs.coverLetter')} <span className="text-slate-400">({t('jobs.optional')})</span></label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder={t('jobs.coverLetterPlaceholder')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
            <div className="mt-3 flex gap-2">
              <Button onClick={handleApply} loading={applying} size="sm">{t('jobs.submitApplication')}</Button>
              <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
            <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('jobs.jobDescription')}
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">{job.description}</p>
        </div>
      )}

      {/* Required Skills */}
      {Object.keys(job.requiredSkills).length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
            <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            {t('jobs.requiredSkills')}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(job.requiredSkills).map(([skill, level]) => (
              <div key={skill} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 dark:border-slate-700 dark:bg-slate-800">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{skill}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <div
                      key={v}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        v <= level ? 'bg-indigo-500' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-400">{level}/5</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer meta */}
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <span>{job.applicationsCount} {t('jobs.applicants')}</span>
        <span>·</span>
        <span>{t('jobs.posted')} {new Date(job.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
