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

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterRequest>({
    resolver: yupResolver(schema) as any,
    defaultValues: { role: 'STUDENT' },
  });

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
    <div className="flex min-h-[80vh] items-center justify-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">Join JobMatch today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" placeholder="Ali" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last name" placeholder="Ben Ali" error={errors.lastName?.message} {...register('lastName')} />
          </div>

          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
          <Input label="Phone number" placeholder="+213 0600000000" error={errors.phoneNumber?.message} {...register('phoneNumber')} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {(['STUDENT', 'COMPANY'] as const).map((r) => (
                <label key={r} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 hover:border-blue-400 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input type="radio" value={r} {...register('role')} className="accent-blue-600" />
                  <span className="text-sm font-medium">{r === 'STUDENT' ? '🎓 Student' : '🏢 Company'}</span>
                </label>
              ))}
            </div>
            {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
          </div>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
          )}

          <Button type="submit" loading={isSubmitting} size="lg" className="mt-2 w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
