import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { StudentProfileRequest, StudentProfileResponse, Skill } from '../../types';

const schema = yup.object({
  university: yup.string(),
  major: yup.string(),
  bio: yup.string(),
  portfolioUrl: yup.string().url('Must be a valid URL').nullable(),
  gpa: yup.number().min(0).max(4).nullable(),
});

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Record<number, number>>({});
  const [saved, setSaved] = useState(false);
  const [resumeFile, setResumeFile] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StudentProfileRequest>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    Promise.all([
      api.get<StudentProfileResponse>('/api/students/profile').catch(() => null),
      api.get<Skill[]>('/api/skills'),
    ]).then(([profileRes, skillsRes]) => {
      setSkills(skillsRes.data);
      if (profileRes) {
        setProfile(profileRes.data);
        // Only treat as uploaded file if it's a filename (not an old external URL)
        const resume = profileRes.data.resumeUrl;
        setResumeFile(resume && !resume.startsWith('http') ? resume : null);
        setResumeName(profileRes.data.resumeOriginalName ?? null);
        reset({
          university: profileRes.data.university,
          major: profileRes.data.major,
          bio: profileRes.data.bio,
          gpa: profileRes.data.gpa,
          portfolioUrl: profileRes.data.portfolioUrl,
        });
        const map: Record<number, number> = {};
        skillsRes.data.forEach((s) => {
          if (profileRes.data.skills[s.name] !== undefined) map[s.id] = profileRes.data.skills[s.name];
        });
        setSelectedSkills(map);
      }
    });
  }, [reset]);

  const toggleSkill = (id: number) => {
    setSelectedSkills((prev) => {
      const next = { ...prev };
      if (next[id] !== undefined) delete next[id];
      else next[id] = 3;
      return next;
    });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setUploadError('Only PDF and DOCX files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post<{ resumeUrl: string; resumeOriginalName: string }>('/api/students/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeFile(res.data.resumeUrl);
      setResumeName(res.data.resumeOriginalName);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResumeDelete = async () => {
    try {
      await api.delete('/api/students/profile/resume');
      setResumeFile(null);
      setResumeName(null);
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Delete failed');
    }
  };

  const openResume = async () => {
    if (!resumeFile) return;
    try {
      const res = await api.get(`/api/students/resume/${resumeFile}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      setUploadError('Failed to open resume');
    }
  };

  const onSubmit = async (data: StudentProfileRequest) => {
    await api.post('/api/students/profile', { ...data, skills: selectedSkills });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Basic info */}
        <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800 dark:text-slate-100">Academic Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="University" placeholder="MIT" error={errors.university?.message} {...register('university')} />
            <Input label="Major" placeholder="Computer Science" error={errors.major?.message} {...register('major')} />
            <Input label="GPA" type="number" step="0.01" placeholder="3.8" error={errors.gpa?.message} {...register('gpa')} />
          </div>
        </section>

        {/* Bio & links */}
        <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800 dark:text-slate-100">About & Links</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Bio</label>
              <textarea {...register('bio')} rows={3} placeholder="Tell companies about yourself..." className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Input label="Portfolio URL" placeholder="https://myportfolio.com" error={errors.portfolioUrl?.message} {...register('portfolioUrl')} />

            {/* Resume Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Resume (PDF or DOCX, max 5MB)</label>
              {resumeFile ? (
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 px-4 py-3">
                  <svg className="h-8 w-8 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 3.5L18.5 8H14V3.5zM6 20V4h7v5a1 1 0 0 0 1 1h5v10H6z"/>
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-slate-100">{resumeName || 'Resume'}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Uploaded</p>
                  </div>
                  <button type="button" onClick={openResume} className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700 transition">
                    View
                  </button>
                  <button type="button" onClick={handleResumeDelete} className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-700 transition">
                    Delete
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 px-4 py-6 text-center transition hover:border-blue-400 dark:hover:border-blue-500">
                  <svg className="h-8 w-8 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-slate-300">
                    {uploading ? 'Uploading...' : 'Click to upload your resume'}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500">PDF or DOCX up to 5MB</span>
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
                </label>
              )}
              {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800 dark:text-slate-100">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => {
              const selected = selectedSkills[s.id] !== undefined;
              return (
                <button key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${selected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-blue-300'}`}>
                  {s.name}
                </button>
              );
            })}
          </div>

          {Object.keys(selectedSkills).length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Set proficiency (1–5):</p>
              {skills.filter((s) => selectedSkills[s.id] !== undefined).map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-slate-200">{s.name}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button key={v} type="button" onClick={() => setSelectedSkills((p) => ({ ...p, [s.id]: v }))}
                        className={`h-7 w-7 rounded-full text-xs font-medium transition ${selectedSkills[s.id] >= v ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-blue-100'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting} size="lg">Save Profile</Button>
          {saved && <span className="text-sm text-green-600">✓ Saved successfully</span>}
        </div>
      </form>
    </div>
  );
}
