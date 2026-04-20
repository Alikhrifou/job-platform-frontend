import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { JobOfferResponse } from '../../types';
import Button from '../../components/ui/Button';

const JOB_TYPE_COLORS: Record<string, string> = {
  INTERNSHIP: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700',
  JOB: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700',
  PART_TIME: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
  CONTRACT: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
};

const JOB_TYPE_LABELS: Record<string, string> = {
  INTERNSHIP: 'Internship',
  JOB: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOfferResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback((query: string) => {
    setLoading(true);
    const url = query.trim()
      ? `/api/jobs/search?title=${encodeURIComponent(query.trim())}`
      : '/api/jobs';
    api.get<JobOfferResponse[]>(url)
      .then((r) => setJobs(r.data))
      .finally(() => setLoading(false));
  }, []);

  // Initial load
  useEffect(() => {
    fetchJobs('');
  }, [fetchJobs]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchJobs(search), 400);
    return () => clearTimeout(timer);
  }, [search, fetchJobs]);

  const filtered = jobs;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Browse Jobs</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Find your next opportunity from top companies</p>
      </div>

      {/* Search bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs or companies..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-800"
          />
        </div>
        <span className="text-sm text-slate-400">
          {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'} found
        </span>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <svg className="mb-3 h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">No jobs found</p>
          <p className="mt-1 text-sm">Try a different search term</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600 dark:hover:shadow-indigo-900/30"
            >
              <div>
                {/* Job type + active badge */}
                <div className="mb-3 flex items-center gap-2">
                  {job.jobType && (
                    <span className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${JOB_TYPE_COLORS[job.jobType] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {JOB_TYPE_LABELS[job.jobType] ?? job.jobType}
                    </span>
                  )}
                  {!job.isActive && (
                    <span className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-500">Closed</span>
                  )}
                </div>

                {/* Title + company */}
                <h2 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors dark:text-white dark:group-hover:text-indigo-400">
                  {job.title}
                </h2>
                <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">{job.companyName}</p>

                {/* Meta */}
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  {(job.salary || job.salaryRange) && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.salaryRange ?? `${job.salary?.toLocaleString()} DA`}
                    </span>
                  )}
                </div>

                {/* Skills */}
                {Object.keys(job.requiredSkills).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Object.entries(job.requiredSkills).slice(0, 4).map(([skill, level]) => (
                      <span key={skill} className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {skill} <span className="text-slate-400 dark:text-slate-500">{level}/5</span>
                      </span>
                    ))}
                    {Object.keys(job.requiredSkills).length > 4 && (
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                        +{Object.keys(job.requiredSkills).length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-xs text-slate-400">{job.applicationsCount} applicants</span>
                <Link to={`/jobs/${job.id}`}>
                  <Button size="sm">View job →</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
