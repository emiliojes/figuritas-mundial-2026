import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SECTIONS, getHave, getNeeded, getQty } from '../data/stickers';

export default function UserProfile() {
  const { uid } = useParams();
  const [stickerMap, setStickerMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (!snap.exists()) {
          setError('Usuario no encontrado');
          return;
        }
        setStickerMap(snap.data()?.stickers || {});
      } catch (err) {
        setError('Error al cargar datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-500">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const neededStickers = SECTIONS.flatMap(section =>
    section.stickers
      .filter(st => !getHave(stickerMap[st.id]) && !getNeeded(stickerMap[st.id]))
      .map(st => ({ ...st, section }))
  );

  const haveStickers = SECTIONS.flatMap(section =>
    section.stickers
      .filter(st => getHave(stickerMap[st.id]))
      .map(st => ({ ...st, section }))
  );

  const spareStickers = SECTIONS.flatMap(section =>
    section.stickers
      .filter(st => getQty(stickerMap[st.id]) > 0)
      .map(st => ({ ...st, section }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-3 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Figuritas para intercambio</h1>
          <p className="text-slate-600">
            <span className="font-semibold text-rose-600">{neededStickers.length}</span> faltan • 
            <span className="font-semibold text-emerald-600">{haveStickers.length}</span> pegadas • 
            <span className="font-semibold text-indigo-600">{spareStickers.length}</span> repetidas
          </p>
        </div>

        {neededStickers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-rose-600 mb-4">❌ Le faltan</h2>
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 gap-2">
              {neededStickers.map(st => (
                <div
                  key={st.id}
                  className="bg-rose-50 border-2 border-rose-200 rounded-lg p-2 text-center"
                >
                  <div className="text-[10px] font-bold text-rose-700">{st.number}</div>
                  <div className="text-[9px] text-rose-600 truncate">{st.name}</div>
                  <div className="text-[8px] text-slate-500 mt-1">{st.section.id}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {spareStickers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-indigo-600 mb-4">↔️ Tiene repetidas</h2>
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 gap-2">
              {spareStickers.map(st => (
                <div
                  key={st.id}
                  className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center"
                >
                  <div className="text-[10px] font-bold text-indigo-700">{st.number}</div>
                  <div className="text-[9px] text-indigo-600 truncate">{st.name}</div>
                  <div className="text-[8px] text-slate-500 mt-1">
                    +{getQty(stickerMap[st.id])} {st.section.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {neededStickers.length === 0 && spareStickers.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-slate-500">
            Este usuario aún no ha agregado figuritas a su colección.
          </div>
        )}
      </div>
    </div>
  );
}
