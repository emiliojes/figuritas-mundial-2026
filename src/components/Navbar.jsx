import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Trophy, BookOpen, LogOut, FlaskConical, Repeat2, ArrowLeftRight, HelpCircle, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isDemo } = useAuth();
  const { t, lang, toggle } = useLang();
  const location = useLocation();
  const [help, setHelp] = useState(false);

  const helpSteps = [
    { icon: '✏️', text: lang === 'es' ? 'Creá tu cuenta con email o Google' : 'Create your account with email or Google' },
    { icon: '📋', text: lang === 'es' ? 'En Mi Colección marcá las figuritas que pegaste (✓), las repetidas (+N) y las que te faltan (!)' : 'In My Collection mark stickers you glued (✓), spares (+N) and needed (!)' },
    { icon: '🔗', text: lang === 'es' ? 'En Intercambio → Unirse con el código del grupo de tu clase' : 'In Trade → Join with your class group code' },
    { icon: '🎯', text: lang === 'es' ? 'La app te muestra con quién podés intercambiar automáticamente' : 'The app shows you who you can trade with automatically' },
    { icon: '✅', text: lang === 'es' ? 'Cuando intercambiás: bajá el contador de repetidas y marcá la nueva como Pegada' : 'After trading: lower your spare counter and mark the new one as Glued' },
  ];

  const links = [
    { to: '/', label: t.navCollection, icon: BookOpen },
    { to: '/repetidas', label: lang === 'en' ? 'Spares' : 'Repetidas', icon: Repeat2 },
    { to: '/intercambio', label: lang === 'en' ? 'Trade' : 'Intercambio', icon: ArrowLeftRight },
  ];

  return (
    <>
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      {isDemo && (
        <div className="bg-amber-50 text-amber-700 border-b border-amber-200 text-xs text-center py-1 px-4 flex items-center justify-center gap-1.5 font-medium">
          <FlaskConical className="w-3.5 h-3.5" />
          {t.demoWarning}
        </div>
      )}
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-indigo-600">
          <Trophy className="w-5 h-5" />
          <span className="hidden sm:inline tracking-tight">Figuritas 2026</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0.5">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === to
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setHelp(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title={lang === 'es' ? '¿Cómo funciona?' : 'How does it work?'}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 hidden sm:inline truncate max-w-32">
            {user?.displayName || user?.email}
          </span>
          <button
            onClick={toggle}
            className="text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-1 text-slate-500 hover:bg-slate-100 transition-colors"
            title="Change language"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
            title="Cerrar sesión / Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>

    {help && createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setHelp(false)} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-700 text-base">
              {lang === 'es' ? '¿Cómo funciona?' : 'How does it work?'}
            </h3>
            <button onClick={() => setHelp(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-4 space-y-4">
            {helpSteps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{s.icon}</span>
                <p className="text-slate-600 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
            <div className="bg-indigo-50 rounded-xl p-3 mt-2">
              <p className="text-xs text-indigo-600 font-semibold mb-1">
                {lang === 'es' ? '🌐 Compartí la app:' : '🌐 Share the app:'}
              </p>
              <p className="text-xs text-slate-500 font-mono break-all">enchanting-muffin-0b5838.netlify.app</p>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}

