import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { Trophy, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(t.googleError);
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          setError(t.nameRequired);
          setLoading(false);
          return;
        }
        await register(email, password, displayName.trim());
      }
      navigate('/');
    } catch (err) {
      const msgs = {
        'auth/user-not-found': t.errUserNotFound,
        'auth/wrong-password': t.errWrongPass,
        'auth/email-already-in-use': t.errEmailInUse,
        'auth/weak-password': t.errWeakPass,
        'auth/invalid-email': t.errInvalidEmail,
        'auth/invalid-credential': t.errInvalidCred,
      };
      setError(msgs[err.code] || t.errGeneric);
    }
    setLoading(false);
  }

  const steps = [
    { icon: '✏️', text: lang === 'es' ? 'Creá tu cuenta con email o Google' : 'Create your account with email or Google' },
    { icon: '📋', text: lang === 'es' ? 'Marcá tus figuritas: pegadas, repetidas y las que te faltan' : 'Mark your stickers: glued, spares and needed' },
    { icon: '🔗', text: lang === 'es' ? 'Entrá a Intercambio → Unirse y escribí el código del grupo de tu clase' : 'Go to Trade → Join and enter your class group code' },
    { icon: '🎯', text: lang === 'es' ? 'La app te muestra automáticamente con quién podés intercambiar' : 'The app shows you automatically who you can trade with' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Trophy className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow">{t.appName}</h1>
          <p className="text-indigo-200 mt-1">{t.appSub}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
              }`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              {t.loginTitle}
            </button>
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'register' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
              }`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              {t.registerTitle}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-semibold text-sm shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-60"
            >
              {loading ? t.loadingBtn : mode === 'login' ? t.enterBtn : t.createBtn}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">{t.orSep}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t.googleBtn}
          </button>
        </div>

        {/* How it works */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <p className="text-white font-semibold text-sm mb-3 text-center">
            {lang === 'es' ? '¿Cómo funciona?' : 'How does it work?'}
          </p>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base shrink-0 mt-0.5">{s.icon}</span>
                <p className="text-indigo-100 text-xs leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
