import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import type { UserResponse } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const emptyForm = { email: '', password: '', firstName: '', lastName: '', phoneNumber: '', role: 'ADMIN' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<UserResponse | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const { t } = useTranslation();

  const load = () => {
    setLoading(true);
    api.get<UserResponse[]>('/api/admin/users')
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleActive = async (id: number) => {
    const { data } = await api.put<UserResponse>(`/api/admin/users/${id}/toggle-active`);
    setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/api/admin/users/${deleteTarget.id}`);
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleCreate = async () => {
    setFormError('');
    if (!form.email || !form.password || !form.firstName || !form.lastName || !form.phoneNumber) {
      setFormError('All fields are required');
      return;
    }
    setCreating(true);
    try {
      const { data } = await api.post<UserResponse>('/api/admin/users', form);
      setUsers((prev) => [...prev, data]);
      setForm(emptyForm);
      setShowCreate(false);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-purple-100 text-purple-700',
      COMPANY: 'bg-blue-100 text-blue-700',
      STUDENT: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[role] ?? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200'}`}>
        {role}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/admin" className="text-sm text-indigo-600 hover:underline">&larr; {t('admin.dashboard')}</Link>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{t('admin.manageUsers')}</h1>
        </div>
        <Button onClick={() => setShowCreate(true)}>{t('admin.createUser')}</Button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50 dark:bg-slate-800 text-xs uppercase text-gray-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">{t('admin.name')}</th>
                <th className="px-4 py-3">{t('auth.email')}</th>
                <th className="px-4 py-3">{t('admin.role')}</th>
                <th className="px-4 py-3">{t('admin.status')}</th>
                <th className="px-4 py-3 text-right">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400 dark:text-slate-500">{u.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-slate-100">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-4 py-3">{roleBadge(u.role)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? t('admin.active') : t('admin.disabled')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(u.id)}>
                        {u.isActive ? t('admin.disable') : t('admin.enable')}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteTarget(u)}>
                        {t('common.delete')}
                      </Button>
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('admin.deleteUser')}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
              {t('admin.deleteUserConfirm', { name: `${deleteTarget.firstName} ${deleteTarget.lastName}`, email: deleteTarget.email })}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
              <Button variant="danger" onClick={confirmDelete}>{t('common.delete')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Create user modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('admin.createNewUser')}</h3>

            {formError && (
              <p className="mt-2 rounded-lg bg-red-50 dark:bg-red-950/30 px-3 py-2 text-sm text-red-600 dark:text-red-400">{formError}</p>
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label={t('auth.firstName')} value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
              <Input label={t('auth.lastName')} value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
              <Input label={t('auth.email')} type="email" value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              <Input label={t('admin.phone')} value={form.phoneNumber}
                onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))} />
              <Input label={t('auth.password')} type="password" value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200">{t('admin.role')}</label>
                <select value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="ADMIN">Admin</option>
                  <option value="STUDENT">Student</option>
                  <option value="COMPANY">Company</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => { setShowCreate(false); setForm(emptyForm); setFormError(''); }}>{t('common.cancel')}</Button>
              <Button onClick={handleCreate} loading={creating}>{t('admin.createUser')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
