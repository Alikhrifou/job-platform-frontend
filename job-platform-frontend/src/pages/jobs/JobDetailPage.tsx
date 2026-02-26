import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import type { JobOfferResponse } from '../../types';
import { useAppSelector } from '../../hooks/redux';

const JOB_TYPE_COLORS: Record<string, string> = {
  INTERNSHIP: 'bg-purple-100 text-purple-700',
  JOB: 'bg-blue-100 text-blue-700',
  PART_TIME: 'bg-yellow-100 text-yellow-700',
  CONTRACT: 'bg-green-100 text-green-700',
};

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);

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
      setError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-gray-200" />;
  if (!job) return <div className="text-center text-gray-400 py-20">Job not found.</div>;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-blue-600 font-medium">{job.companyName}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">📍 {job.location}</span>
              {job.jobType && (
                <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${JOB_TYPE_COLORS[job.jobType] ?? 'bg-gray-100 text-gray-600'}`}>
                  {job.jobType.replace('_', ' ')}
                </span>
              )}
              {!job.isActive && <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs text-red-600">Closed</span>}
            </div>
            {(job.salary || job.salaryRange) && (
              <p className="mt-2 text-sm text-gray-500">💰 {job.salaryRange ?? `${job.salary} €`}</p>
            )}
            {job.closingDate && (
              <p className="mt-1 text-xs text-gray-400">Closes {new Date(job.closingDate).toLocaleDateString()}</p>
            )}
          </div>

          <div className="shrink-0">
            {applied ? (
              <span className="rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">✓ Applied</span>
            ) : role === 'STUDENT' && job.isActive ? (
              <Button onClick={() => setShowForm(!showForm)}>Apply Now</Button>
            ) : !isAuthenticated && job.isActive ? (
              <Button onClick={() => navigate('/login')}>Login to Apply</Button>
            ) : null}
          </div>
        </div>

        {/* Apply form */}
        {showForm && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Cover Letter (optional)</label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you a good fit for this role?"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            <div className="mt-3 flex gap-2">
              <Button onClick={handleApply} loading={applying} size="sm">Submit Application</Button>
              <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {job.description && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-800">Job Description</h2>
          <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{job.description}</p>
        </div>
      )}

      {/* Required Skills */}
      {Object.keys(job.requiredSkills).length > 0 && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-800">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(job.requiredSkills).map(([skill, level]) => (
              <div key={skill} className="flex items-center gap-1 rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5">
                <span className="text-sm font-medium text-gray-700">{skill}</span>
                <span className="text-xs text-gray-400">·</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <div key={v} className={`h-2 w-2 rounded-full ${v <= level ? 'bg-blue-500' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">{job.applicationsCount} applicants · Posted {new Date(job.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
