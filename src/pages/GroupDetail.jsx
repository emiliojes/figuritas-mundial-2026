import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { demoGetGroup, demoGetUsers } from '../lib/demoStore';
import { ALL_STICKERS } from '../data/stickers';
import { ArrowLeft, Sparkles, Users, RefreshCw } from 'lucide-react';

function getStickerName(id) {
  return ALL_STICKERS.find(s => s.id === id)?.name || id;
}

function computeMatches(myStickers, otherStickers) {
  const iGive = [];
  const iReceive = [];

  Object.entries(myStickers).forEach(([id, status]) => {
    if (status === 'spare' && (otherStickers[id] === 'needed')) {
      iGive.push(id);
    }
  });

  Object.entries(otherStickers).forEach(([id, status]) => {
    if (status === 'spare' && (myStickers[id] === 'needed')) {
      iReceive.push(id);
    }
  });

  return { iGive, iReceive };
}

function MatchBadge({ id }) {
  return (
    <span className="inline-flex items-center bg-orange-50 border border-orange-200 text-orange-700 text-xs px-2 py-0.5 rounded-lg font-medium">
      {id} · {getStickerName(id)}
    </span>
  );
}

function MemberCard({ member, myStickers }) {
  const { iGive, iReceive } = computeMatches(myStickers, member.stickers);
  const hasMatch = iGive.length > 0 || iReceive.length > 0;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 ${hasMatch ? 'border-orange-200' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">
          {(member.displayName || member.email || '?')[0].toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-gray-800 text-sm">{member.displayName || member.email}</div>
          <div className="text-xs text-gray-400">
            {Object.values(member.stickers).filter(v => v === 'spare').length} para dar ·{' '}
            {Object.values(member.stickers).filter(v => v === 'needed').length} le faltan
          </div>
        </div>
        {hasMatch && (
          <span className="ml-auto flex items-center gap-1 text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-lg">
            <Sparkles className="w-3 h-3" /> Match!
          </span>
        )}
      </div>

      {hasMatch ? (
        <div className="space-y-2 text-xs">
          {iGive.length > 0 && (
            <div>
              <p className="text-green-600 font-medium mb-1">📤 Vos le podés dar:</p>
              <div className="flex flex-wrap gap-1">
                {iGive.map(id => <MatchBadge key={id} id={id} />)}
              </div>
            </div>
          )}
          {iReceive.length > 0 && (
            <div>
              <p className="text-blue-600 font-medium mb-1">📥 Él/ella te puede dar:</p>
              <div className="flex flex-wrap gap-1">
                {iReceive.map(id => <MatchBadge key={id} id={id} />)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">Sin intercambios posibles por ahora.</p>
      )}
    </div>
  );
}

export default function GroupDetail() {
  const { id } = useParams();
  const { user, isDemo } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [myStickers, setMyStickers] = useState({});
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    if (isDemo) {
      const groupData = demoGetGroup(id);
      if (!groupData) { navigate('/grupos'); return; }
      setGroup(groupData);
      const allUsers = demoGetUsers(groupData.members);
      const me = allUsers.find(u => u.uid === user.uid);
      setMyStickers(me?.stickers || {});
      setMembers(allUsers.filter(u => u.uid !== user.uid));
    } else {
      const groupSnap = await getDoc(doc(db, 'groups', id));
      if (!groupSnap.exists()) { navigate('/grupos'); return; }
      const groupData = { id: groupSnap.id, ...groupSnap.data() };
      setGroup(groupData);
      const memberDocs = await Promise.all(
        groupData.members.map(uid => getDoc(doc(db, 'users', uid)))
      );
      const me = memberDocs.find(d => d.id === user.uid);
      setMyStickers(me?.data()?.stickers || {});
      const others = memberDocs
        .filter(d => d.id !== user.uid && d.exists())
        .map(d => ({ uid: d.id, ...d.data(), stickers: d.data()?.stickers || {} }));
      setMembers(others);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Cargando grupo...
      </div>
    );
  }

  const matchCount = members.filter(m => {
    const { iGive, iReceive } = computeMatches(myStickers, m.stickers);
    return iGive.length > 0 || iReceive.length > 0;
  }).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/grupos')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Grupos
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white mb-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-orange-100 text-sm mt-1 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {group.members.length} miembros
              <span className="bg-white/20 px-2 py-0.5 rounded-lg font-mono tracking-widest text-xs">
                {group.code}
              </span>
            </p>
          </div>
          {matchCount > 0 && (
            <div className="text-center">
              <div className="text-3xl font-bold">{matchCount}</div>
              <div className="text-xs text-orange-100">matches 🎉</div>
            </div>
          )}
        </div>
      </div>

      {/* Matches summary */}
      {matchCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-5 text-sm text-yellow-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span>¡Tenés posibles intercambios con <strong>{matchCount} {matchCount === 1 ? 'persona' : 'personas'}</strong>!</span>
        </div>
      )}

      {/* Members */}
      <h2 className="font-semibold text-gray-600 text-sm mb-3 uppercase tracking-wide">
        Otros miembros
      </h2>

      {members.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Todavía no hay otros miembros.</p>
          <p className="text-sm mt-1">Compartí el código <span className="font-mono font-bold text-gray-600">{group.code}</span> con tus compañeros.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members
            .sort((a, b) => {
              const aM = computeMatches(myStickers, a.stickers);
              const bM = computeMatches(myStickers, b.stickers);
              const aScore = aM.iGive.length + aM.iReceive.length;
              const bScore = bM.iGive.length + bM.iReceive.length;
              return bScore - aScore;
            })
            .map(member => (
              <MemberCard key={member.uid} member={member} myStickers={myStickers} />
            ))}
        </div>
      )}

      <button
        onClick={load}
        className="mt-6 flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors mx-auto"
      >
        <RefreshCw className="w-4 h-4" /> Actualizar
      </button>
    </div>
  );
}
