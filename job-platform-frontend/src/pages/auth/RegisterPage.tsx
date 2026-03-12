import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../api/axios';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { RegisterRequest } from '../../types';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  role: yup.string().oneOf(['STUDENT', 'COMPANY'], 'Select a role').required('Role is required'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: { role: 'STUDENT' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setServerError('');
      await api.post('/api/auth/register', data);
      navigate('/login');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200">
              <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-1.5 text-sm text-slate-500">Join thousands of professionals on JobMatch</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Role selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {(['STUDENT', 'COMPANY'] as const).map((r) => (
                  <label
                    key={r}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition-all duration-200 ${
                      selectedRole === r
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <input type="radio" value={r} {...register('role')} className="hidden" />
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${
                      selectedRole === r ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {r === 'STUDENT' ? '🎓' : '🏢'}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${
                        selectedRole === r ? 'text-indigo-700' : 'text-slate-700'
                      }`}>
                        {r === 'STUDENT' ? 'Student' : 'Company'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {r === 'STUDENT' ? 'Find your dream job' : 'Hire top talent'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && <p className="text-xs font-medium text-red-500">{errors.role.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="First name" placeholder="Ali" error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Last name" placeholder="Benali" error={errors.lastName?.message} {...register('lastName')} />
            </div>

            <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" placeholder="••••••••" hint="At least 6 characters" error={errors.password?.message} {...register('password')} />
            <Input label="Phone number" placeholder="+213 0600000000" error={errors.phoneNumber?.message} {...register('phoneNumber')} />

            {serverError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <svg className="h-4 w-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600">{serverError}</p>
              </div>
            )}

            <Button type="submit" loading={isSubmitting} size="lg" className="mt-1 w-full">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
