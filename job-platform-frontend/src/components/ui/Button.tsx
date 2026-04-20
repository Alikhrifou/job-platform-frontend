import { memo } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-violet-700 hover:shadow-indigo-300 disabled:from-indigo-300 disabled:to-violet-300 disabled:shadow-none dark:shadow-indigo-900/30',
  secondary:
    'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-slate-500',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-100 hover:from-red-600 hover:to-rose-600 disabled:opacity-50 dark:shadow-red-900/30',
  ghost:
    'bg-transparent text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-slate-800 dark:hover:text-indigo-300',
  outline:
    'bg-transparent border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-slate-800',
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs font-semibold',
  md: 'px-4.5 py-2 text-sm font-semibold',
  lg: 'px-6 py-2.5 text-sm font-semibold',
};

export default memo(function Button({
  loading,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 active:scale-[0.97] disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${props.className ?? ''}`}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
});
