import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, ArrowLeftRight, Trophy, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const ADMIN_UID = 'qKStGD3E07MXsBoFlSvwiBJs7MB2';
const TOTAL_STICKERS = 670;

function pct(n, total) {
  if (!total) return 0;
  return Math.round((n / total) * 100);
}

function parseStickers(stickers = {}) {
  let have = 0, spares = 0, needed = 0;
  Object.values(stickers).forEach(v => {
    if (!v) return;
    const h = typeof v === 'object' ? !!v.h : v === 'have' || v === 'spare';
    const q = typeof v === 'object' ? (v.q ?? 0) : (v === 'spare' ? 1 : 0);
    const n = typeof v === 'object' ? !!v.n : v === 'needed';
    if (h) have++;
    if (q > 0) spares += q;
    if (n) needed++;
  });
  return { have, spares, needed };
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState('lastActive');

  useEffect(() => {
    if (!user || user.uid !== ADMIN_UID) {
      navigate('/');
    }
  }, [user, navigate]);

  async function load() {
    setLoading(true);
    try {
      const [usersSnap, groupsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'tradeGroups')),
      ]);
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setGroups(groupsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (!user || user.uid !== ADMIN_UID) return null;

  const sorted = [...users].sort((a, b) => {
    const sa = parseStickers(a.stickers);
    const sb = parseStickers(b.stickers);
    if (sortBy === 'have') return sb.have - sa.have;
    if (sortBy === 'needed') return sb.needed - sa.needed;
    if (sortBy === 'spares') return sb.spares - sa.spares;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  const totalHave   = users.reduce((s, u) => s + parseStickers(u.stickers).have, 0);
  const totalNeeded = users.reduce((s, u) => s + parseStickers(u.stickers).needed, 0);
  const totalSpares = users.reduce((s, u) => s + parseStickers(u.stickers).spares, 0);
  const avgComplete = users.length
    ? Math.round(users.reduce((s, u) => s + pct(parseStickers(u.stickers).have, TOTAL_STICKERS), 0) / users.length)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Panel de Admin</h1>
          <p className="text-slate-400 text-sm mt-0.5">Vista de actividad de usuarios</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Usuarios', value: users.length, icon: Users, color: 'indigo' },
          { label: 'Grupos intercambio', value: groups.length, icon: ArrowLeftRight, color: 'violet' },
          { label: 'Promedio completado', value: `${avgComplete}%`, icon: Trophy, color: 'emerald' },
          { label: 'Total repetidas', value: totalSpares, icon: BookOpen, color: 'rose' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className={`inline-flex p-2 rounded-xl mb-2 bg-${color}-50`}>
              <Icon className={`w-4 h-4 text-${color}-500`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Grupos de intercambio */}
      {groups.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
          <h2 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-violet-500" />
            Grupos de intercambio ({groups.length})
          </h2>
          <div className="space-y-2">
            {groups.map(g => (
              <div key={g.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2">
                <div>
                  <span className="font-medium text-slate-700 text-sm">{g.name}</span>
                  <span className="ml-2 font-mono text-xs text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">{g.code || g.id}</span>
                </div>
                <span className="text-xs text-slate-400">{g.members?.length ?? 1} miembros</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            Usuarios ({users.length})
          </h2>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="lastActive">Más recientes</option>
            <option value="have">Más pegadas</option>
            <option value="needed">Más faltan</option>
            <option value="spares">Más repetidas</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Cargando...</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {sorted.map(u => {
              const { have, spares, needed } = parseStickers(u.stickers);
              const completion = pct(have, TOTAL_STICKERS);
              const isOpen = expanded === u.id;
              const userGroups = groups.filter(g => g.members?.includes(u.id));

              return (
                <div key={u.id}>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                    onClick={() => setExpanded(isOpen ? null : u.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center shrink-0">
                          {(u.displayName || u.email || '?')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-700 text-sm truncate">
                            {u.displayName || '(sin nombre)'}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 ml-3">
                        <div className="hidden sm:flex items-center gap-3 text-xs">
                          <span className="text-emerald-600 font-semibold">{have}✓</span>
                          <span className="text-indigo-500 font-semibold">+{spares}</span>
                          <span className="text-rose-500 font-semibold">{needed}!</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full transition-all"
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-8 text-right">{completion}%</span>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 bg-slate-50 border-t border-slate-100">
                      <div className="grid grid-cols-3 gap-3 mt-3 mb-3">
                        {[
                          { label: 'Pegadas', value: have, max: TOTAL_STICKERS, color: 'emerald' },
                          { label: 'Repetidas', value: spares, max: null, color: 'indigo' },
                          { label: 'Faltan', value: needed, max: TOTAL_STICKERS, color: 'rose' },
                        ].map(({ label, value, max, color }) => (
                          <div key={label} className={`bg-${color}-50 rounded-xl p-3 text-center`}>
                            <p className={`text-xl font-bold text-${color}-600`}>{value}</p>
                            <p className="text-xs text-slate-400">{label}</p>
                            {max && <p className="text-xs text-slate-300">de {max}</p>}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <p><span className="font-medium text-slate-500">UID:</span> <span className="font-mono">{u.id}</span></p>
                        {u.createdAt && (
                          <p><span className="font-medium text-slate-500">Registro:</span> {new Date(u.createdAt).toLocaleDateString('es-AR')}</p>
                        )}
                        {userGroups.length > 0 && (
                          <p>
                            <span className="font-medium text-slate-500">Grupos:</span>{' '}
                            {userGroups.map(g => (
                              <span key={g.id} className="font-mono bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded mr-1">{g.name}</span>
                            ))}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
