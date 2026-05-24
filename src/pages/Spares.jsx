import { useEffect, useState, useCallback, useRef } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { demoGetUser, demoUpdateStickers } from '../lib/demoStore';
import { SECTIONS } from '../data/stickers';
import { Repeat2, Search, Minus, Plus, X } from 'lucide-react';

const ALL_STICKERS = SECTIONS.flatMap(s =>
  s.stickers.map(st => ({ ...st, sectionId: s.id, sectionName: s.name }))
);

const FLAG_CODE = {
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz',
  CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
  USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz',
  ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
  POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co',
  FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no',
  ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
  ENG: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa',
  SCO: 'gb-sct', BRA: 'br', HAI: 'ht', MAR: 'ma',
};

function getQty(val) {
  if (!val) return 0;
  if (typeof val === 'string') return val === 'spare' ? 1 : 0;
  return val.q ?? 0;
}

export default function Spares() {
  const { user, isDemo } = useAuth();
  const { t, lang, teamNames } = useLang();
  const [stickerMap, setStickerMap] = useState({});
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [modal, setModal]   = useState(false);
  const [addQ, setAddQ]     = useState('');
  const inputRef            = useRef(null);

  const persist = useCallback(async (updated) => {
    setSaving(true);
    try {
      const toSave = {};
      Object.entries(updated).forEach(([k, v]) => { if (v) toSave[k] = v; });
      if (isDemo) demoUpdateStickers(user.uid, toSave);
      else await updateDoc(doc(db, 'users', user.uid), { stickers: toSave });
    } catch (e) { console.error(e); }
    setSaving(false);
  }, [user.uid, isDemo]);

  const handleAddSpare = useCallback(async (id) => {
    const prev    = stickerMap[id];
    const newQty  = getQty(prev) + 1;
    const updated = { ...stickerMap };
    if (typeof prev === 'object' && prev !== null) {
      updated[id] = { ...prev, q: newQty };
    } else {
      updated[id] = { h: prev === 'have' || prev === 'spare' ? 1 : 0, q: newQty, n: 0 };
    }
    setStickerMap(updated);
    await persist(updated);
  }, [stickerMap, persist]);

  const handleDecrement = useCallback(async (id) => {
    const prev = stickerMap[id];
    const newQty = Math.max(0, getQty(prev) - 1);
    const updated = { ...stickerMap };
    if (typeof prev === 'object' && prev !== null) {
      const newEntry = { ...prev, q: newQty };
      if (!newEntry.h && newQty === 0 && !newEntry.n) delete updated[id];
      else updated[id] = newEntry;
    } else {
      if (newQty === 0) delete updated[id];
      else updated[id] = { h: 0, q: newQty, n: 0 };
    }
    setStickerMap(updated);
    await persist(updated);
  }, [stickerMap, persist]);

  const handleIncrement = useCallback(async (id) => {
    const prev = stickerMap[id];
    const newQty = getQty(prev) + 1;
    const updated = { ...stickerMap };
    if (typeof prev === 'object' && prev !== null) {
      updated[id] = { ...prev, q: newQty };
    } else {
      updated[id] = { h: prev === 'have' || prev === 'spare' ? 1 : 0, q: newQty, n: 0 };
    }
    setStickerMap(updated);
    await persist(updated);
  }, [stickerMap, persist]);

  useEffect(() => {
    async function load() {
      if (isDemo) {
        const u = demoGetUser(user.uid);
        setStickerMap(u?.stickers || {});
      } else {
        const snap = await getDoc(doc(db, 'users', user.uid));
        setStickerMap(snap.data()?.stickers || {});
      }
    }
    load();
  }, [user.uid, isDemo]);

  const openModal = () => { setModal(true); setAddQ(''); setTimeout(() => inputRef.current?.focus(), 80); };
  const closeModal = () => { setModal(false); setAddQ(''); };

  const addResults = addQ.length > 0
    ? ALL_STICKERS.filter(st => {
        const qLow = addQ.toLowerCase();
        return st.name.toLowerCase().includes(qLow) || st.number.toLowerCase().includes(qLow);
      }).slice(0, 20)
    : [];

  const q = search.toLowerCase();

  const sections = SECTIONS.map(section => ({
    section,
    stickers: section.stickers
      .filter(st => {
        const qty = getQty(stickerMap[st.id]);
        if (qty === 0) return false;
        if (q === '') return true;
        return (
          st.name.toLowerCase().includes(q) ||
          st.number.toLowerCase().includes(q) ||
          section.name.toLowerCase().includes(q)
        );
      })
      .map(st => ({ sticker: st, qty: getQty(stickerMap[st.id]) })),
  })).filter(s => s.stickers.length > 0);

  const totalSpares = sections.reduce((acc, s) => acc + s.stickers.reduce((a, st) => a + st.qty, 0), 0);
  const totalTypes  = sections.reduce((acc, s) => acc + s.stickers.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 sm:p-5 text-white mb-4 shadow-[0_4px_20px_rgba(99,102,241,0.25)]">
        <div className="flex items-center gap-3">
          <Repeat2 className="w-8 h-8 opacity-80" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              {lang === 'en' ? 'My Spares' : 'Mis Repetidas'}
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-0.5">
              {totalTypes} {lang === 'en' ? 'different stickers' : 'figuritas distintas'} · {totalSpares} {lang === 'en' ? 'total copies' : 'copias en total'}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 placeholder:text-slate-400"
        />
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Repeat2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {q ? t.noResults : (lang === 'en' ? 'No spares yet. Add them from My Collection.' : 'No tenés repetidas aún. Marcalas en Mi Colección.')}
          </p>
        </div>
      ) : (
        sections.map(({ section, stickers }) => (
          <div key={section.id} className="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden mb-2.5">
            {/* Section header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-50">
              {section.id === 'FWC'
                ? <span className="text-xl">🏆</span>
                : <img
                    src={`https://flagcdn.com/w40/${FLAG_CODE[section.id] ?? section.id.toLowerCase()}.png`}
                    alt={section.name}
                    className="w-8 h-6 rounded object-cover border border-slate-100"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
              }
              <span className="font-semibold text-slate-700 text-sm">
                {teamNames[section.id] ?? section.name}
              </span>
              {section.group && section.group !== 'Intro' && (
                <span className="text-[10px] bg-indigo-50 text-indigo-500 font-semibold px-1.5 py-0.5 rounded">
                  {t.groupLabel} {section.group}
                </span>
              )}
              <span className="ml-auto text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                {stickers.reduce((a, s) => a + s.qty, 0)} total
              </span>
            </div>

            {/* Stickers list */}
            <div className="divide-y divide-slate-50">
              {stickers.map(({ sticker, qty }) => (
                <div key={sticker.id} className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-semibold text-slate-400 shrink-0 w-14">{sticker.number}</span>
                    <span className="text-sm text-slate-600 truncate">{sticker.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-indigo-400 font-medium">
                      {lang === 'en' ? 'spare' : 'repet.'}
                    </span>
                    <span className="bg-indigo-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleIncrement(sticker.id)}
                      className="w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-500 flex items-center justify-center transition-colors touch-manipulation"
                      title={lang === 'en' ? 'Add one back' : 'Agregar una'}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDecrement(sticker.id)}
                      className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center transition-colors touch-manipulation"
                      title={lang === 'en' ? 'Traded one' : 'Intercambié una'}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      {/* ── Floating add button ── */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-5 w-13 h-13 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-[0_4px_16px_rgba(99,102,241,0.45)] flex items-center justify-center transition-all active:scale-95 z-40"
        style={{ width: 52, height: 52 }}
        title={lang === 'en' ? 'Add spare' : 'Agregar repetida'}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ── Quick-add modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

          {/* Panel */}
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-4 pb-6 sm:p-5 z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-700 text-base">
                {lang === 'en' ? 'Add spare' : 'Agregar repetida'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={lang === 'en' ? 'Search by name or number...' : 'Buscar por nombre o número...'}
                value={addQ}
                onChange={e => setAddQ(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 rounded-xl border border-slate-100">
              {addQ.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">
                  {lang === 'en' ? 'Type to search stickers' : 'Escribí para buscar figuritas'}
                </p>
              ) : addResults.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-8">{t.noResults}</p>
              ) : (
                addResults.map(st => {
                  const qty = getQty(stickerMap[st.id]);
                  return (
                    <button
                      key={st.id}
                      onClick={() => { handleAddSpare(st.id); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-indigo-50 transition-colors text-left"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-400 mr-2">{st.number}</span>
                        <span className="text-sm text-slate-700">{st.name}</span>
                        <span className="text-xs text-slate-400 ml-1">· {teamNames[st.sectionId] ?? st.sectionName}</span>
                      </div>
                      <span className={`shrink-0 ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                        qty > 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {qty > 0 ? `+${qty}` : '+0'}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              {lang === 'en' ? 'Tap a sticker to add +1 spare' : 'Tocá una figurita para sumar +1 repetida'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
