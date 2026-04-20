import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { JobOfferRequest, JobOfferResponse, Skill } from '../../types';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  location: yup.string().required('Location is required'),
  jobType: yup.string().oneOf(['INTERNSHIP', 'JOB', 'PART_TIME', 'CONTRACT']),
  salary: yup.number().min(0).nullable(),
  salaryRange: yup.string(),
  isActive: yup.boolean(),
});

const JOB_TYPES = ['INTERNSHIP', 'JOB', 'PART_TIME', 'CONTRACT'] as const;

export default function JobFormPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!jobId;

  const [skills, setSkills] = useState<Skill[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<Record<number, number>>({});
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<JobOfferRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    api.get<Skill[]>('/api/skills').then((r) => setSkills(r.data));
    if (isEdit) {
      api.get<JobOfferResponse>(`/api/jobs/${jobId}`).then((r) => {
        const job = r.data;
        reset({ title: job.title, description: job.description, location: job.location, jobType: job.jobType as any, salary: job.salary, salaryRange: job.salaryRange, isActive: job.isActive });
        const map: Record<number, number> = {};
        skills.forEach((s) => { if (job.requiredSkills[s.name] !== undefined) map[s.id] = job.requiredSkills[s.name]; });
        setRequiredSkills(map);
      });
    }
  }, [isEdit, jobId, reset]);

  const toggleSkill = (id: number) => {
    setRequiredSkills((prev) => {
      const next = { ...prev };
      if (next[id] !== undefined) delete next[id];
      else next[id] = 3;
      return next;
    });
  };

  const onSubmit = async (data: JobOfferRequest) => {
    try {
      setServerError('');
      const payload = { ...data, requiredSkills };
      if (isEdit) await api.put(`/api/jobs/${jobId}`, payload);
      else await api.post('/api/jobs', payload);
      navigate('/company/jobs');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to save job');
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Job' : 'Post a Job'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800 dark:text-slate-100">Job Details</h2>
          <div className="flex flex-col gap-4">
            <Input label="Job Title" placeholder="Frontend Developer" error={errors.title?.message} {...register('title')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Location" placeholder="Paris, France" error={errors.location?.message} {...register('location')} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Job Type</label>
                <select {...register('jobType')} className="rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select type</option>
                  {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              <Input label="Salary (€)" type="number" placeholder="45000" error={errors.salary?.message} {...register('salary')} />
              <Input label="Salary Range" placeholder="40k–50k €" {...register('salaryRange')} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Description</label>
              <textarea {...register('description')} rows={5} placeholder="Describe the role, responsibilities, requirements..." className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200">
              <input type="checkbox" {...register('isActive')} className="accent-blue-600" />
              Publish immediately (active)
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800 dark:text-slate-100">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => {
              const selected = requiredSkills[s.id] !== undefined;
              return (
                <button key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${selected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-blue-300'}`}>
                  {s.name}
                </button>
              );
            })}
          </div>

          {Object.keys(requiredSkills).length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Required level (1–5):</p>
              {skills.filter((s) => requiredSkills[s.id] !== undefined).map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-slate-200">{s.name}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button key={v} type="button" onClick={() => setRequiredSkills((p) => ({ ...p, [s.id]: v }))}
                        className={`h-7 w-7 rounded-full text-xs font-medium transition ${requiredSkills[s.id] >= v ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-blue-100'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {serverError && <p className="rounded-lg bg-red-50 dark:bg-red-950/30 px-3 py-2 text-sm text-red-600 dark:text-red-400">{serverError}</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={isSubmitting} size="lg">{isEdit ? 'Update Job' : 'Post Job'}</Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => navigate('/company/jobs')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
