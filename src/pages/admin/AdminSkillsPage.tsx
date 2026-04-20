import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import type { Skill } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface SkillForm { name: string; category: string; description: string }
const empty: SkillForm = { name: '', category: '', description: '' };

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<SkillForm>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const { t } = useTranslation();

  const load = () => {
    setLoading(true);
    api.get<Skill[]>('/api/skills')
      .then((r) => setSkills(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async () => {
    if (!form.name.trim() || !form.category.trim()) return;
    if (editId) {
      const { data } = await api.put<Skill>(`/api/admin/skills/${editId}`, form);
      setSkills((prev) => prev.map((s) => (s.id === data.id ? data : s)));
    } else {
      const { data } = await api.post<Skill>('/api/admin/skills', form);
      setSkills((prev) => [...prev, data]);
    }
    setForm(empty);
    setEditId(null);
  };

  const startEdit = (s: Skill) => {
    setEditId(s.id);
    setForm({ name: s.name, category: s.category, description: s.description ?? '' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/api/admin/skills/${deleteTarget.id}`);
    setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin" className="text-sm text-indigo-600 hover:underline">&larr; {t('admin.dashboard')}</Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{t('admin.manageSkills')}</h1>
      </div>

      {/* Add / Edit form */}
      <div className="mb-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800 dark:text-slate-100">{editId ? t('admin.editSkill') : t('admin.addSkill')}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input label={t('admin.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="React" />
          <Input label={t('admin.category')} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Frontend" />
          <Input label={t('admin.descriptionLabel')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t('admin.optional')} />
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={handleSave}>{editId ? t('admin.update') : t('admin.create')}</Button>
          {editId && <Button size="sm" variant="ghost" onClick={() => { setForm(empty); setEditId(null); }}>{t('common.cancel')}</Button>}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 dark:bg-slate-800 text-xs uppercase text-gray-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">{t('admin.name')}</th>
                <th className="px-4 py-3">{t('admin.category')}</th>
                <th className="px-4 py-3">{t('admin.descriptionLabel')}</th>
                <th className="px-4 py-3 text-right">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {skills.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 dark:bg-slate-800">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400 dark:text-slate-500">{s.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{s.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">{s.category}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{s.description ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(s)}>{t('common.edit')}</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteTarget(s)}>{t('common.delete')}</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('admin.deleteSkill')}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              {t('admin.deleteSkillConfirm', { name: deleteTarget.name })}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
              <Button variant="danger" onClick={confirmDelete}>{t('common.delete')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
