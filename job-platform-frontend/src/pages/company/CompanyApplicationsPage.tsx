import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import type { ApplicationResponse } from '../../types';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  SHORTLISTED: 'bg-blue-100 text-blue-700',
  INTERVIEW_SCHEDULED: 'bg-purple-100 text-purple-700',
  OFFER_EXTENDED: 'bg-emerald-100 text-emerald-700',
  DECLINED: 'bg-gray-100 text-gray-600',
};

export default function CompanyApplicationsPage() {
  const { jobId } = useParams();
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApplicationResponse[]>(`/api/applications/job/${jobId}`)
      .then((r) => setApps(r.data))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />)}</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Applications</h1>

      {apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
          <p className="text-4xl">📭</p>
          <p className="mt-2">No applications yet for this job.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {apps.map((app) => (
            <div key={app.id} className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{app.studentName}</h3>
                  <p className="text-xs text-gray-400">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                  {app.coverLetter && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>}
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_STYLES[app.status] ?? 'bg-gray-100'}`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>
                  {app.matchScore !== undefined && (
                    <span className="text-xs text-gray-500">Match: <span className="font-semibold text-blue-600">{app.matchScore.toFixed(0)}%</span></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
