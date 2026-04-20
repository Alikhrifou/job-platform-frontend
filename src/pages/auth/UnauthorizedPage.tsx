import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';

export default function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="text-6xl">🔒</div>
      <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{t('auth.accessDenied')}</h1>
      <p className="mt-2 text-gray-500 dark:text-slate-400">{t('auth.noPermission')}</p>
      <Link to="/jobs" className="mt-6">
        <Button>{t('auth.goToJobs')}</Button>
      </Link>
    </div>
  );
}
