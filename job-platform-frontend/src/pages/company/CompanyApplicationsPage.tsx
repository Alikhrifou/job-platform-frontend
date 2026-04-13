import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios';
import type { ApplicationResponse, ApplicationStatus } from '../../types';
import Button from '../../components/ui/Button';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  SHORTLISTED: 'bg-blue-100 text-blue-700',
  INTERVIEW_SCHEDULED: 'bg-purple-100 text-purple-700',
  OFFER_EXTENDED: 'bg-emerald-100 text-emerald-700',
  DECLINED: 'bg-gray-100 text-gray-600',
};

const STATUS_OPTIONS: ApplicationStatus[] = [
  'PENDING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'OFFER_EXTENDED', 'REJECTED', 'DECLINED',
];

export default function CompanyApplicationsPage() {
  const { jobId } = useParams();
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ApplicationResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const url = jobId ? `/api/applications/job/${jobId}` : '/api/applications/company';
    api.get<ApplicationResponse[]>(url)
      .then((r) => setApps(r.data))
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId: number, status: ApplicationStatus) => {
    const { data } = await api.patch<ApplicationResponse>(
      `/api/applications/${appId}/status?status=${status}`
    );
    setApps((prev) => prev.map((a) => (a.id === data.id ? data : a)));
    if (selected?.id === appId) setSelected(data);
  };

  const filtered = statusFilter === 'ALL' ? apps : apps.filter((a) => a.status === statusFilter);

  const counts = apps.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="flex flex-col gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />)}</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link to="/company/jobs" className="text-sm text-indigo-600 hover:underline">&larr; My Jobs</Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {jobId ? 'Job Applications' : 'All Applications'}
        </h1>
        <p className="text-sm text-gray-500">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Stats row */}
      {apps.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${statusFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            All ({apps.length})
          </button>
          {STATUS_OPTIONS.filter((s) => counts[s]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${statusFilter === s ? 'bg-indigo-600 text-white' : `${STATUS_STYLES[s]} hover:opacity-80`}`}
            >
              {s.replace(/_/g, ' ')} ({counts[s]})
            </button>
          ))}
        </div>
      )}

      {apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
          <p className="text-4xl">📭</p>
          <p className="mt-2">No applications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((app) => (
            <div key={app.id} className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                {/* Left: student info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{app.studentName}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[app.status] ?? 'bg-gray-100'}`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {app.studentEmail && <p className="text-sm text-gray-500">{app.studentEmail}</p>}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                    {!jobId && <> &middot; <span className="font-medium text-gray-600">{app.jobTitle}</span></>}
                  </p>
                  {app.studentUniversity && (
                    <p className="text-xs text-gray-500 mt-1">
                      🎓 {app.studentUniversity}{app.studentMajor && ` · ${app.studentMajor}`}{app.studentGpa ? ` · GPA ${app.studentGpa}` : ''}
                    </p>
                  )}
                  {app.coverLetter && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>}
                </div>

                {/* Right: score + actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {app.matchScore !== undefined && app.matchScore > 0 && (
                    <div className="text-center">
                      <span className={`text-lg font-bold ${app.matchScore >= 70 ? 'text-green-600' : app.matchScore >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {app.matchScore.toFixed(0)}%
                      </span>
                      <p className="text-[10px] text-gray-400">Match</p>
                    </div>
                  )}
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    <Button size="sm" variant="secondary" onClick={() => setSelected(app)}>
                      View Profile
                    </Button>
                    {app.studentEmail && (
                      <a href={`mailto:${app.studentEmail}`}>
                        <Button size="sm" variant="outline">Contact</Button>
                      </a>
                    )}
                  </div>
                  {app.status === 'PENDING' && (
                    <div className="flex gap-1.5 mt-1">
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(app.id, 'SHORTLISTED')}>
                        Shortlist
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => updateStatus(app.id, 'ACCEPTED')}>
                        Accept
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(app.id, 'REJECTED')}>
                        Reject
                      </Button>
                    </div>
                  )}
                  {app.status === 'SHORTLISTED' && (
                    <div className="flex gap-1.5 mt-1">
                      <Button size="sm" variant="primary" onClick={() => updateStatus(app.id, 'INTERVIEW_SCHEDULED')}>
                        Schedule Interview
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(app.id, 'REJECTED')}>
                        Reject
                      </Button>
                    </div>
                  )}
                  {app.status === 'INTERVIEW_SCHEDULED' && (
                    <div className="flex gap-1.5 mt-1">
                      <Button size="sm" variant="primary" onClick={() => updateStatus(app.id, 'OFFER_EXTENDED')}>
                        Extend Offer
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateStatus(app.id, 'REJECTED')}>
                        Reject
                      </Button>
                    </div>
                  )}
                  {(app.status !== 'PENDING' && app.status !== 'DECLINED') && (
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                      className="mt-1 rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student Profile Side Panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Student Profile</h2>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 hover:bg-gray-100 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Name & contact */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{selected.studentName}</h3>
              {selected.studentEmail && (
                <a href={`mailto:${selected.studentEmail}`} className="text-sm text-indigo-600 hover:underline">{selected.studentEmail}</a>
              )}
            </div>

            {/* Academic info */}
            <section className="mb-5 rounded-xl border border-gray-200 p-4">
              <h4 className="text-xs font-semibold uppercase text-gray-400 mb-2">Academic Info</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {selected.studentUniversity && (
                  <div><p className="text-gray-400 text-xs">University</p><p className="font-medium text-gray-800">{selected.studentUniversity}</p></div>
                )}
                {selected.studentMajor && (
                  <div><p className="text-gray-400 text-xs">Major</p><p className="font-medium text-gray-800">{selected.studentMajor}</p></div>
                )}
                {selected.studentGpa !== undefined && selected.studentGpa > 0 && (
                  <div><p className="text-gray-400 text-xs">GPA</p><p className="font-medium text-gray-800">{selected.studentGpa}</p></div>
                )}
                {selected.matchScore !== undefined && selected.matchScore > 0 && (
                  <div><p className="text-gray-400 text-xs">Match Score</p><p className="font-bold text-indigo-600">{selected.matchScore.toFixed(0)}%</p></div>
                )}
              </div>
            </section>

            {/* Bio */}
            {selected.studentBio && (
              <section className="mb-5 rounded-xl border border-gray-200 p-4">
                <h4 className="text-xs font-semibold uppercase text-gray-400 mb-2">About</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{selected.studentBio}</p>
              </section>
            )}

            {/* Links */}
            {(selected.studentPortfolioUrl || selected.studentResumeUrl) && (
              <section className="mb-5 rounded-xl border border-gray-200 p-4">
                <h4 className="text-xs font-semibold uppercase text-gray-400 mb-2">Links</h4>
                <div className="flex flex-col gap-2">
                  {selected.studentPortfolioUrl && (
                    <a href={selected.studentPortfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline break-all">
                      🌐 Portfolio
                    </a>
                  )}
                  {selected.studentResumeUrl && (
                    <a href={selected.studentResumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline break-all">
                      📄 Resume
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* Cover letter */}
            {selected.coverLetter && (
              <section className="mb-5 rounded-xl border border-gray-200 p-4">
                <h4 className="text-xs font-semibold uppercase text-gray-400 mb-2">Cover Letter</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.coverLetter}</p>
              </section>
            )}

            {/* Application status */}
            <section className="mb-5 rounded-xl border border-gray-200 p-4">
              <h4 className="text-xs font-semibold uppercase text-gray-400 mb-2">Application for {selected.jobTitle}</h4>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${STATUS_STYLES[selected.status]}`}>
                  {selected.status.replace(/_/g, ' ')}
                </span>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value as ApplicationStatus)}
                  className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </section>

            {/* Action buttons */}
            <div className="flex gap-2">
              {selected.studentEmail && (
                <a href={`mailto:${selected.studentEmail}`} className="flex-1">
                  <Button className="w-full" variant="primary">
                    ✉ Contact Student
                  </Button>
                </a>
              )}
              {selected.status === 'PENDING' && (
                <>
                  <Button variant="primary" onClick={() => updateStatus(selected.id, 'ACCEPTED')}>Accept</Button>
                  <Button variant="danger" onClick={() => updateStatus(selected.id, 'REJECTED')}>Reject</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
