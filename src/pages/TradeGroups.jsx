import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  collection, doc, getDoc, setDoc, updateDoc, arrayUnion, query, where, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { demoCreateGroup, demoJoinGroup, demoGetMyGroups } from '../lib/demoStore';
import { Users, Plus, Hash, ArrowRight, Copy, Check } from 'lucide-react';

function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function TradeGroups() {
  const { user, isDemo } = useAuth();
  const { lang } = useLang();

  const [myGroups, setMyGroups]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [newName, setNewName]       = useState('');
  const [joinCode, setJoinCode]     = useState('');
  const [creating, setCreating]     = useState(false);
  const [joining, setJoining]       = useState(false);
  const [error, setError]           = useState('');
  const [copied, setCopied]         = useState(null);

  const t = {
    title:       lang === 'en' ? 'My Trade Groups'          : 'Mis Grupos de Intercambio',
    createTitle: lang === 'en' ? 'Create group'             : 'Crear grupo',
    joinTitle:   lang === 'en' ? 'Join with code'           : 'Unirse con código',
    namePh:      lang === 'en' ? 'Group name (e.g. School)' : 'Nombre del grupo (ej: 3ro B)',
    codePh:      lang === 'en' ? '6-LETTER CODE'            : 'CÓDIGO DE 6 LETRAS',
    createBtn:   lang === 'en' ? 'Create'                   : 'Crear',
    joinBtn:     lang === 'en' ? 'Join'                     : 'Unirse',
    myGroups:    lang === 'en' ? 'GROUPS YOU\'RE IN'        : 'GRUPOS EN LOS QUE ESTÁS',
    viewBtn:     lang === 'en' ? 'View matches'             : 'Ver coincidencias',
    members:     lang === 'en' ? 'members'                  : 'miembros',
    demoMsg:     lang === 'en' ? 'Trade groups require Firebase. Running in demo mode — groups are not persisted.' : 'Los grupos de intercambio requieren Firebase. Estás en modo demo — los grupos no se guardan.',
    errName:     lang === 'en' ? 'Enter a group name.'      : 'Ingresá un nombre.',
    errCode:     lang === 'en' ? 'Enter the 6-letter code.' : 'Ingresá el código de 6 letras.',
    errNotFound: lang === 'en' ? 'Group not found.'         : 'Grupo no encontrado.',
    copied:      lang === 'en' ? 'Copied!'                  : '¡Copiado!',
    noGroups:    lang === 'en' ? 'You haven\'t joined any group yet.' : 'Todavía no estás en ningún grupo.',
    code:        lang === 'en' ? 'Code'                     : 'Código',
  };

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemo) {
        setMyGroups(demoGetMyGroups(user.uid));
      } else {
        const q = query(collection(db, 'tradeGroups'), where('members', 'array-contains', user.uid));
        const snap = await getDocs(q);
        setMyGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [user.uid, isDemo]);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  const handleCreate = async () => {
    if (!newName.trim()) { setError(t.errName); return; }
    setCreating(true); setError('');
    try {
      if (isDemo) {
        demoCreateGroup(newName.trim(), user.uid, user.displayName || user.email);
      } else {
        let code = genCode();
        const groupRef = doc(db, 'tradeGroups', code);
        let snap = await getDoc(groupRef);
        while (snap.exists()) { code = genCode(); snap = await getDoc(doc(db, 'tradeGroups', code)); }
        await setDoc(groupRef, {
          code,
          name: newName.trim(),
          owner: user.uid,
          members: [user.uid],
          memberNames: { [user.uid]: user.displayName || user.email },
          createdAt: Date.now(),
        });
      }
      setNewName('');
      await loadGroups();
    } catch (e) { console.error(e); setError(lang === 'en' ? 'Error creating group.' : 'Error al crear el grupo.'); }
    setCreating(false);
  };

  const handleJoin = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 3) { setError(t.errCode); return; }
    setJoining(true); setError('');
    try {
      if (isDemo) {
        demoJoinGroup(code, user.uid, user.displayName || user.email);
      } else {
        const groupRef = doc(db, 'tradeGroups', code);
        const snap = await getDoc(groupRef);
        if (!snap.exists()) { setError(t.errNotFound); setJoining(false); return; }
        await updateDoc(groupRef, {
          members: arrayUnion(user.uid),
          [`memberNames.${user.uid}`]: user.displayName || user.email,
        });
      }
      setJoinCode('');
      await loadGroups();
    } catch (e) {
      if (e.message === 'no-group') setError(t.errNotFound);
      else { console.error(e); setError(lang === 'en' ? 'Error joining group.' : 'Error al unirse al grupo.'); }
    }
    setJoining(false);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 sm:p-5 text-white mb-5 shadow-[0_4px_20px_rgba(99,102,241,0.25)]">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 opacity-80" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">{t.title}</h2>
            <p className="text-indigo-200 text-xs sm:text-sm mt-0.5">
              {lang === 'en' ? 'Find who has what you need' : 'Encontrá quién tiene lo que te falta'}
            </p>
          </div>
        </div>
      </div>

      {/* Demo warning */}
      {isDemo && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm mb-4">
          {lang === 'en'
            ? 'Demo mode — groups are saved in this browser only. Share the code so others can join from their device.'
            : 'Modo demo — los grupos se guardan solo en este navegador. Compartí el código para que otros se unan desde su dispositivo.'}
        </div>
      )}

      {/* Create + Join cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">

        {/* Create */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-4">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-3">
            <Plus className="w-4 h-4" /> {t.createTitle}
          </div>
          <input
            type="text"
            placeholder={t.namePh}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 placeholder:text-slate-400 mb-3"
            disabled={isDemo}
          />
          <button
            onClick={handleCreate}
            disabled={creating || isDemo}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {creating ? '...' : t.createBtn}
          </button>
        </div>

        {/* Join */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.06)] p-4">
          <div className="flex items-center gap-2 text-violet-600 font-semibold text-sm mb-3">
            <Hash className="w-4 h-4" /> {t.joinTitle}
          </div>
          <input
            type="text"
            placeholder={t.codePh}
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            maxLength={6}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 placeholder:text-slate-400 placeholder:tracking-normal mb-3 uppercase"
            disabled={isDemo}
          />
          <button
            onClick={handleJoin}
            disabled={joining || isDemo}
            className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {joining ? '...' : t.joinBtn}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-rose-500 text-sm mb-4 text-center">{error}</p>
      )}

      {/* My groups list */}
      <p className="text-[11px] font-semibold text-slate-400 tracking-widest mb-2">{t.myGroups}</p>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm">...</div>
      ) : myGroups.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t.noGroups}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {myGroups.map(g => (
            <div key={g.id} className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-700 text-sm truncate">{g.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-400">
                    {g.members?.length ?? 1} {t.members}
                  </span>
                  <span className="text-slate-200">·</span>
                  <button
                    onClick={() => copyCode(g.code)}
                    className="flex items-center gap-1 text-[11px] font-mono text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    {copied === (g.code ?? g.id)
                      ? <><Check className="w-3 h-3" /> {t.copied}</>
                      : <><Copy className="w-3 h-3" /> {g.code ?? g.id}</>
                    }
                  </button>
                </div>
              </div>
              <Link
                to={`/intercambio/${g.id}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors shrink-0"
              >
                {t.viewBtn} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
