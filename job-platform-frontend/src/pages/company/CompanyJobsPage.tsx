import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import type { JobOfferResponse } from '../../types';

function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<JobOfferResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const load = () => {
    api.get<JobOfferResponse[]>('/api/jobs')
      .then((r) => setJobs(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirmDelete = async () => {
    if (deleteTarget === null) return;
    await api.delete(`/api/jobs/${deleteTarget}`);
    setDeleteTarget(null);
    load();
  };

  if (loading) return <div className="flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700" />)}</div>;

  return (
    <div>
      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Job"
        message="Are you sure you want to delete this job? All associated applications will also be removed. This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Job Offers</h1>
        <Link to="/company/jobs/new"><Button>+ Post Job</Button></Link>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-slate-600 py-16 text-center text-gray-400 dark:text-slate-500">
          <p className="text-4xl">📭</p>
          <p className="mt-2">No job offers yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'}`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400">📍 {job.location} · {job.applicationsCount} applicants</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/company/applications/${job.id}`}><Button size="sm" variant="secondary">Applications</Button></Link>
                <Link to={`/company/jobs/${job.id}/edit`}><Button size="sm" variant="secondary">Edit</Button></Link>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(job.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
