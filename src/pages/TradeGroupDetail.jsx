import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { demoGetGroup, demoGetUser, demoLeaveGroup } from '../lib/demoStore';
import { SECTIONS } from '../data/stickers';
import { Users, ArrowLeft, Copy, Check, ChevronDown, ChevronUp, LogOut } from 'lucide-react';

const ALL_STICKERS = SECTIONS.flatMap(s => s.stickers.map(st => ({ ...st, sectionId: s.id })));

function getQty(val) {
  if (!val) return 0;
  if (typeof val === 'string') return val === 'spare' ? 1 : 0;
  return val.q ?? 0;
}
function getNeeded(val) {
  if (!val) return false;
  if (typeof val === 'string') return val === 'needed';
  return !!val.n;
}

export default function TradeGroupDetail() {
  const { id }           = useParams();
  const navigate         = useNavigate();
  const { user, isDemo } = useAuth();
  const { lang, teamNames } = useLang();

  const [group, setGroup]       = useState(null);
  const [membersData, setMembersData] = useState({});
  const [loading, setLoading]   = useState(true);
  const [copied, setCopied]     = useState(false);
  const [expanded, setExpanded] = useState({});
  const [leaving, setLeaving]   = useState(false);

  const T = {
    back:        lang === 'en' ? 'Back'                    : 'Volver',
    members:     lang === 'en' ? 'members'                 : 'miembros',
    code:        lang === 'en' ? 'Code'                    : 'Código',
    copied:      lang === 'en' ? 'Copied!'                 : '¡Copiado!',
    leave:       lang === 'en' ? 'Leave group'             : 'Salir del grupo',
    youLabel:    lang === 'en' ? '(you)'                   : '(vos)',
    matchTitle:  lang === 'en' ? 'Trade matches'           : 'Coincidencias de intercambio',
    iGive:       lang === 'en' ? 'I can give them'        : 'Yo les puedo dar',
    theyGive:    lang === 'en' ? 'They can give me'        : 'Me pueden dar',
    noMatch:     lang === 'en' ? 'No matches yet.'         : 'Sin coincidencias por ahora.',
    spares:      lang === 'en' ? 'spares'                  : 'repetidas',
    loading:     lang === 'en' ? 'Loading...'              : 'Cargando...',
    notFound:    lang === 'en' ? 'Group not found.'        : 'Grupo no encontrado.',
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let g;
      if (isDemo) {
        g = demoGetGroup(id);
        if (!g) { setGroup(null); setLoading(false); return; }
      } else {
        const snap = await getDoc(doc(db, 'tradeGroups', id));
        if (!snap.exists()) { setGroup(null); setLoading(false); return; }
        g = { id: snap.id, ...snap.data() };
      }
      setGroup(g);

      const membersStickers = {};
      if (isDemo) {
        g.members.forEach(uid => {
          const u = demoGetUser(uid);
          membersStickers[uid] = u?.stickers || {};
        });
      } else {
        await Promise.all(
          g.members.map(async uid => {
            const uSnap = await getDoc(doc(db, 'users', uid));
            membersStickers[uid] = uSnap.data()?.stickers || {};
          })
        );
      }
      setMembersData(membersStickers);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [id, isDemo]);

  useEffect(() => { load(); }, [load]);

  const copyCode = () => {
    navigator.clipboard.writeText(group.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (!window.confirm(lang === 'en' ? 'Leave this group?' : '¿Salir del grupo?')) return;
    setLeaving(true);
    try {
      if (isDemo) {
        demoLeaveGroup(id, user.uid);
      } else {
        await updateDoc(doc(db, 'tradeGroups', id), {
          members: arrayRemove(user.uid),
          [`memberNames.${user.uid}`]: null,
        });
      }
      navigate('/intercambio');
    } catch (e) { console.error(e); }
    setLeaving(false);
  };

  const toggleExpand = (uid) => setExpanded(p => ({ ...p, [uid]: !p[uid] }));

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center text-slate-400">{T.loading}</div>
  );
  if (!group) return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center text-slate-400">{T.notFound}</div>
  );

  const myStickers = membersData[user.uid] || {};

  const otherMembers = (group.members || []).filter(uid => uid !== user.uid);

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 sm:p-5 text-white mb-5 shadow-[0_4px_20px_rgba(99,102,241,0.25)]">
        <button
          onClick={() => navigate('/intercambio')}
          className="flex items-center gap-1.5 text-indigo-200 hover:text-white text-xs mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {T.back}
        </button>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">{group.name}</h2>
            <p className="text-indigo-200 text-xs mt-1">
              {group.members?.length} {T.members}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? T.copied : group.code}
            </button>
            <button
              onClick={handleLeave}
              disabled={leaving}
              className="p-1.5 bg-white/10 hover:bg-red-400/40 rounded-xl transition-colors"
              title={T.leave}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Members + matches */}
      {otherMembers.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            {lang === 'en'
              ? 'Share the code so others can join and see matches.'
              : 'Compartí el código para que otros se unan y ver coincidencias.'}
          </p>
          <button
            onClick={copyCode}
            className="mt-3 flex items-center gap-1.5 mx-auto text-indigo-500 text-sm font-semibold hover:text-indigo-700"
          >
            <Copy className="w-4 h-4" />
            {lang === 'en' ? 'Copy code' : 'Copiar código'}: {group.code}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {otherMembers.map(uid => {
            const theirStickers = membersData[uid] || {};
            const memberName = group.memberNames?.[uid] || uid;

            // iGive: mis repetidas que a ellos les faltan
            const iGive = ALL_STICKERS.filter(st =>
              getQty(myStickers[st.id]) > 0 && getNeeded(theirStickers[st.id])
            );

            // theyGive: sus repetidas que a mí me faltan
            const theyGive = ALL_STICKERS.filter(st =>
              getQty(theirStickers[st.id]) > 0 && getNeeded(myStickers[st.id])
            );

            const isExpanded = expanded[uid];

            return (
              <div key={uid} className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Member header */}
                <button
                  onClick={() => toggleExpand(uid)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                    {memberName[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-700 text-sm truncate">{memberName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {iGive.length > 0 || theyGive.length > 0
                        ? `${iGive.length + theyGive.length} ${lang === 'en' ? 'matches' : 'coincidencias'}`
                        : T.noMatch}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {iGive.length > 0 && (
                      <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                        ↑{iGive.length}
                      </span>
                    )}
                    {theyGive.length > 0 && (
                      <span className="text-[11px] font-semibold bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full">
                        ↓{theyGive.length}
                      </span>
                    )}
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-50 px-4 pb-4 pt-3 grid sm:grid-cols-2 gap-4">

                    {/* I give them */}
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-600 mb-2 flex items-center gap-1">
                        ↑ {T.iGive} ({iGive.length})
                      </p>
                      {iGive.length === 0 ? (
                        <p className="text-xs text-slate-400">{T.noMatch}</p>
                      ) : (
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {iGive.map(st => (
                            <div key={st.id} className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400 w-14 shrink-0 font-mono">{st.number}</span>
                              <span className="text-slate-600 truncate">{teamNames[st.sectionId] ?? st.sectionId}</span>
                              <span className="ml-auto shrink-0 bg-emerald-50 text-emerald-600 font-semibold px-1.5 py-0.5 rounded-full text-[10px]">
                                +{getQty(myStickers[st.id])}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* They give me */}
                    <div>
                      <p className="text-[11px] font-semibold text-sky-600 mb-2 flex items-center gap-1">
                        ↓ {T.theyGive} ({theyGive.length})
                      </p>
                      {theyGive.length === 0 ? (
                        <p className="text-xs text-slate-400">{T.noMatch}</p>
                      ) : (
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {theyGive.map(st => (
                            <div key={st.id} className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400 w-14 shrink-0 font-mono">{st.number}</span>
                              <span className="text-slate-600 truncate">{teamNames[st.sectionId] ?? st.sectionId}</span>
                              <span className="ml-auto shrink-0 bg-sky-50 text-sky-600 font-semibold px-1.5 py-0.5 rounded-full text-[10px]">
                                +{getQty(theirStickers[st.id])}
                              </span>
                            </div>
                          ))}
                        </div>
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
  );
}
