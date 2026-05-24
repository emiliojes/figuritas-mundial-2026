import { useEffect, useState } from 'react';
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, query, where
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { demoCreateGroup, demoJoinGroup, demoGetMyGroups } from '../lib/demoStore';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Hash, ArrowRight, Copy, CheckCheck } from 'lucide-react';

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function Groups() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { isDemo } = useAuth();
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  async function loadMyGroups() {
    setLoading(true);
    if (isDemo) {
      setMyGroups(demoGetMyGroups(user.uid));
    } else {
      const q = query(collection(db, 'groups'), where('members', 'array-contains', user.uid));
      const snap = await getDocs(q);
      setMyGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    setLoading(false);
  }

  useEffect(() => { loadMyGroups(); }, [user.uid]);

  async function createGroup(e) {
    e.preventDefault();
    setError('');
    if (!newGroupName.trim()) return;
    let code;
    if (isDemo) {
      const g = demoCreateGroup(newGroupName.trim(), user.uid);
      code = g.code;
    } else {
      code = generateCode();
      const groupRef = doc(collection(db, 'groups'));
      await setDoc(groupRef, {
        name: newGroupName.trim(),
        code,
        members: [user.uid],
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      });
    }
    setNewGroupName('');
    setSuccess(`Grupo "${newGroupName.trim()}" creado con código ${code}`);
    loadMyGroups();
    setTimeout(() => setSuccess(''), 4000);
  }

  async function joinGroup(e) {
    e.preventDefault();
    setError('');
    const code = joinCode.trim().toUpperCase();
    if (!code) return;

    try {
      let groupName;
      if (isDemo) {
        const g = demoJoinGroup(code, user.uid);
        groupName = g.name;
      } else {
        const q = query(collection(db, 'groups'), where('code', '==', code));
        const snap = await getDocs(q);
        if (snap.empty) { setError('No existe un grupo con ese código.'); return; }
        const groupDoc = snap.docs[0];
        const groupData = groupDoc.data();
        if (groupData.members.includes(user.uid)) { setError('Ya sos miembro de ese grupo.'); return; }
        await updateDoc(doc(db, 'groups', groupDoc.id), { members: arrayUnion(user.uid) });
        groupName = groupData.name;
      }
      setJoinCode('');
      setSuccess(`Te uniste a "${groupName}"!`);
      loadMyGroups();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      if (err.message === 'no-group') setError('No existe un grupo con ese código.');
      else if (err.message === 'already-member') setError('Ya sos miembro de ese grupo.');
      else setError('Ocurrió un error. Intentá de nuevo.');
    }
  }

  async function copyCode(code) {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-orange-500" /> Mis Grupos
      </h1>

      {/* Messages */}
      {error && <p className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-2 mb-4">{error}</p>}
      {success && <p className="bg-green-50 text-green-600 text-sm rounded-xl px-4 py-2 mb-4">{success}</p>}

      {/* Create & Join */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {/* Create */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-500" /> Crear grupo
          </h2>
          <form onSubmit={createGroup} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nombre del grupo (ej: 3ro B)"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Crear
            </button>
          </form>
        </div>

        {/* Join */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Hash className="w-4 h-4 text-orange-500" /> Unirse con código
          </h2>
          <form onSubmit={joinGroup} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Código de 6 letras (ej: AB12CD)"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-400 tracking-widest"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Unirse
            </button>
          </form>
        </div>
      </div>

      {/* My groups list */}
      <h2 className="font-semibold text-gray-600 text-sm mb-3 uppercase tracking-wide">
        Grupos en los que estás
      </h2>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Cargando grupos...</div>
      ) : myGroups.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Todavía no pertenecés a ningún grupo.</p>
          <p className="text-sm mt-1">Creá uno o unite con un código.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myGroups.map(group => (
            <div
              key={group.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-gray-800">{group.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{group.members.length} miembros</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded-lg tracking-widest text-gray-600">
                    {group.code}
                  </span>
                  <button
                    onClick={() => copyCode(group.code)}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                    title="Copiar código"
                  >
                    {copiedCode === group.code
                      ? <CheckCheck className="w-3.5 h-3.5 text-green-500" />
                      : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => navigate(`/grupos/${group.id}`)}
                className="flex items-center gap-1 text-sm text-orange-600 font-medium hover:underline"
              >
                Ver <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
