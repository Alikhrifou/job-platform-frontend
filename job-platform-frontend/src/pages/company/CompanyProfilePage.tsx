import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { CompanyProfileRequest, CompanyProfileResponse } from '../../types';

const schema = yup.object({
  companyName: yup.string().required('Company name is required'),
  industry: yup.string(),
  website: yup.string().url('Must be a valid URL').nullable(),
  address: yup.string(),
  city: yup.string(),
  state: yup.string(),
  zipCode: yup.string(),
  description: yup.string(),
  logoUrl: yup.string().url('Must be a valid URL').nullable(),
  employeeCount: yup.number().min(1).nullable(),
});

export default function CompanyProfilePage() {
  const [saved, setSaved] = useState(false);
  const { t } = useTranslation();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CompanyProfileRequest>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    api.get<CompanyProfileResponse>('/api/companies/profile')
      .then((r) => reset(r.data as any))
      .catch(() => {});
  }, [reset]);

  const onSubmit = async (data: CompanyProfileRequest) => {
    await api.post('/api/companies/profile', data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t('company.companyProfile')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800 dark:text-slate-100">{t('company.companyInfo')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label={t('company.companyName')} placeholder="Acme Corp" error={errors.companyName?.message} {...register('companyName')} />
            </div>
            <Input label={t('company.industry')} placeholder="Technology" {...register('industry')} />
            <Input label={t('company.employeeCount')} type="number" placeholder="150" error={errors.employeeCount?.message} {...register('employeeCount')} />
            <Input label={t('company.website')} placeholder="https://company.com" error={errors.website?.message} {...register('website')} />
            <Input label={t('company.logoUrl')} placeholder="https://..." error={errors.logoUrl?.message} {...register('logoUrl')} />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800 dark:text-slate-100">{t('company.location')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t('company.address')} placeholder="123 Main St" {...register('address')} />
            <Input label={t('company.city')} placeholder="Paris" {...register('city')} />
            <Input label={t('company.stateRegion')} placeholder="Île-de-France" {...register('state')} />
            <Input label={t('company.zipCode')} placeholder="75001" {...register('zipCode')} />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800 dark:text-slate-100">{t('company.description')}</h2>
          <textarea {...register('description')} rows={4} placeholder={t('company.descriptionPlaceholder')} className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting} size="lg">{t('company.saveProfile')}</Button>
          {saved && <span className="text-sm text-green-600">✓ {t('common.savedSuccessfully')}</span>}
        </div>
      </form>
    </div>
  );
}
