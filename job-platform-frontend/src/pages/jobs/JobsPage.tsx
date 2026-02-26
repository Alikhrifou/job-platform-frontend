import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { JobOfferResponse } from '../../types';
import Button from '../../components/ui/Button';

const JOB_TYPE_COLORS: Record<string, string> = {
  INTERNSHIP: 'bg-purple-100 text-purple-700',
  JOB: 'bg-blue-100 text-blue-700',
  PART_TIME: 'bg-yellow-100 text-yellow-700',
  CONTRACT: 'bg-green-100 text-green-700',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOfferResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<JobOfferResponse[]>('/api/jobs')
      .then((r) => setJobs(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or company..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:w-72"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400">No jobs found.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <div key={job.id} className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-gray-900">{job.title}</h2>
                  {job.jobType && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${JOB_TYPE_COLORS[job.jobType] ?? 'bg-gray-100 text-gray-600'}`}>
                      {job.jobType}
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-600">{job.companyName}</p>
                <p className="mt-1 text-xs text-gray-500">📍 {job.location}</p>
                {job.salaryRange && <p className="mt-1 text-xs text-gray-500">💰 {job.salaryRange}</p>}

                {Object.keys(job.requiredSkills).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Object.entries(job.requiredSkills).slice(0, 4).map(([skill, level]) => (
                      <span key={skill} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {skill} · {level}/5
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">{job.applicationsCount} applicants</span>
                <Link to={`/jobs/${job.id}`}>
                  <Button size="sm">View</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
