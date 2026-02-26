import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Company Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">Company Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="Company Name" placeholder="Acme Corp" error={errors.companyName?.message} {...register('companyName')} />
            </div>
            <Input label="Industry" placeholder="Technology" {...register('industry')} />
            <Input label="Employee Count" type="number" placeholder="150" error={errors.employeeCount?.message} {...register('employeeCount')} />
            <Input label="Website" placeholder="https://company.com" error={errors.website?.message} {...register('website')} />
            <Input label="Logo URL" placeholder="https://..." error={errors.logoUrl?.message} {...register('logoUrl')} />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">Location</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Address" placeholder="123 Main St" {...register('address')} />
            <Input label="City" placeholder="Paris" {...register('city')} />
            <Input label="State / Region" placeholder="Île-de-France" {...register('state')} />
            <Input label="Zip Code" placeholder="75001" {...register('zipCode')} />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-800">Description</h2>
          <textarea {...register('description')} rows={4} placeholder="Tell candidates about your company..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSubmitting} size="lg">Save Profile</Button>
          {saved && <span className="text-sm text-green-600">✓ Saved successfully</span>}
        </div>
      </form>
    </div>
  );
}
