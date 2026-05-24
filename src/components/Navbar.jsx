import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Trophy, BookOpen, Users, LogOut, FlaskConical, Repeat2 } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isDemo } = useAuth();
  const { t, lang, toggle } = useLang();
  const location = useLocation();

  const links = [
    { to: '/', label: t.navCollection, icon: BookOpen },
    { to: '/grupos', label: t.navGroups, icon: Users },
    { to: '/repetidas', label: lang === 'en' ? 'Spares' : 'Repetidas', icon: Repeat2 },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {isDemo && (
        <div className="bg-yellow-400 text-yellow-900 text-xs text-center py-1 px-4 flex items-center justify-center gap-1.5 font-medium">
          <FlaskConical className="w-3.5 h-3.5" />
          {t.demoWarning}
        </div>
      )}
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-orange-600">
          <Trophy className="w-5 h-5" />
          <span className="hidden sm:inline">Figuritas 2026</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:inline truncate max-w-32">
            {user?.displayName || user?.email}
          </span>
          <button
            onClick={toggle}
            className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Change language"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
            title="Cerrar sesión / Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
