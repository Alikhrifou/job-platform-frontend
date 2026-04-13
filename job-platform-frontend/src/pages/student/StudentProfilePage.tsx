import { useEffect, useState } from 'react';
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
  resumeUrl: yup.string().url('Must be a valid URL').nullable(),
  gpa: yup.number().min(0).max(4).nullable(),
});

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Record<number, number>>({});
  const [saved, setSaved] = useState(false);

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
        reset({
          university: profileRes.data.university,
          major: profileRes.data.major,
          bio: profileRes.data.bio,
          gpa: profileRes.data.gpa,
          portfolioUrl: profileRes.data.portfolioUrl,
          resumeUrl: profileRes.data.resumeUrl,
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

  const onSubmit = async (data: StudentProfileRequest) => {
    await api.post('/api/students/profile', { ...data, skills: selectedSkills });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Basic info */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">Academic Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="University" placeholder="MIT" error={errors.university?.message} {...register('university')} />
            <Input label="Major" placeholder="Computer Science" error={errors.major?.message} {...register('major')} />
            <Input label="GPA" type="number" step="0.01" placeholder="3.8" error={errors.gpa?.message} {...register('gpa')} />
          </div>
        </section>

        {/* Bio & links */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">About & Links</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea {...register('bio')} rows={3} placeholder="Tell companies about yourself..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Input label="Portfolio URL" placeholder="https://myportfolio.com" error={errors.portfolioUrl?.message} {...register('portfolioUrl')} />
            <Input label="Resume URL" placeholder="https://drive.google.com/..." error={errors.resumeUrl?.message} {...register('resumeUrl')} />
          </div>
        </section>

        {/* Skills */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => {
              const selected = selectedSkills[s.id] !== undefined;
              return (
                <button key={s.id} type="button" onClick={() => toggleSkill(s.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${selected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  {s.name}
                </button>
              );
            })}
          </div>

          {Object.keys(selectedSkills).length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Set proficiency (1–5):</p>
              {skills.filter((s) => selectedSkills[s.id] !== undefined).map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{s.name}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button key={v} type="button" onClick={() => setSelectedSkills((p) => ({ ...p, [s.id]: v }))}
                        className={`h-7 w-7 rounded-full text-xs font-medium transition ${selectedSkills[s.id] >= v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-blue-100'}`}>
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
