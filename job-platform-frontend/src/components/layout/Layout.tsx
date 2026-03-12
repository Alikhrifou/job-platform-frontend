import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Outlet />
      </main>
      <footer className="mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} JobMatch · Built with ❤️ in Maroc
      </footer>
    </div>
  );
}
