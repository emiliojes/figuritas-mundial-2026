import { useEffect, useState, useCallback, useRef } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { demoGetUser, demoUpdateStickers } from '../lib/demoStore';
import { SECTIONS, TOTAL_STICKERS } from '../data/stickers';
import { RefreshCw, ChevronDown, ChevronUp, Search, X, QrCode } from 'lucide-react';

function getHave(val) {
  if (!val) return false;
  if (typeof val === 'string') return val === 'have' || val === 'spare';
  return !!val.h;
}
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

function saveEntry(id, have, qty, needed, prev) {
  if (!have && qty === 0 && !needed) return null;
  return { h: have ? 1 : 0, q: qty, n: needed ? 1 : 0 };
}

function StickerCard({ sticker, entry, onUpdate }) {
  const have   = getHave(entry);
  const qty    = getQty(entry);
  const needed = getNeeded(entry);

  const cardCls = have
    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
    : needed
    ? 'bg-rose-50 border-rose-200 text-rose-900'
    : 'bg-white border-slate-200 text-slate-400';

  return (
    <div
      className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl border select-none w-full
        transition-all duration-150 ${cardCls} ${(have || qty > 0 || needed) ? 'shadow-sm' : 'opacity-80'}`}
      style={{ minHeight: 72 }}
    >
      <span className="text-[10px] font-semibold leading-tight text-center break-all w-full">
        {sticker.number}
      </span>
      <span className="text-[9px] leading-tight text-center opacity-50 line-clamp-1 w-full">
        {sticker.name}
      </span>

      {/* Pegada toggle */}
      <button
        onClick={() => onUpdate(sticker.id, !have, qty, have ? needed : false)}
        className={`w-full mt-0.5 rounded-md text-[9px] font-semibold py-0.5 touch-manipulation transition-colors
          ${have ? 'bg-emerald-400/80 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
      >
        {have ? '✓ Pegada' : '+ Pegar'}
      </button>

      {/* Repetidas counter */}
      <div className="flex items-center gap-0.5 mt-0.5">
        <button
          onClick={() => onUpdate(sticker.id, have, Math.max(0, qty - 1), needed)}
          className="w-4 h-4 rounded-md text-[10px] font-bold bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center leading-none touch-manipulation"
        >−</button>
        <span className={`text-[10px] font-bold w-5 text-center ${qty > 0 ? 'text-indigo-500' : 'text-slate-300'}`}>
          {qty > 0 ? `+${qty}` : '0'}
        </span>
        <button
          onClick={() => onUpdate(sticker.id, have, qty + 1, needed)}
          className="w-4 h-4 rounded-md text-[10px] font-bold bg-indigo-100 hover:bg-indigo-200 text-indigo-600 flex items-center justify-center leading-none touch-manipulation"
        >+</button>
      </div>

      {/* Falta toggle */}
      <button
        onClick={() => onUpdate(sticker.id, needed ? have : false, qty, !needed)}
        className={`w-full rounded-md text-[9px] font-semibold py-0.5 touch-manipulation transition-colors
          ${needed ? 'bg-rose-400/80 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
      >
        {needed ? '✗ Falta' : '? Falta'}
      </button>
    </div>
  );
}

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

function SectionBlock({ section, stickers, onUpdate, onBulk, startOpen, t, teamNames }) {
  const [open, setOpen] = useState(startOpen);

  const counts = {
    have:   stickers.filter(s => getHave(s.entry)).length,
    spare:  stickers.filter(s => getQty(s.entry) > 0).length,
    needed: stickers.filter(s => getNeeded(s.entry)).length,
  };
  const total = section.stickers.length;
  const pct   = Math.round((counts.have / total) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_6px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden mb-2.5">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 hover:bg-slate-50/70 transition-colors text-left"
      >
        {section.id === 'FWC'
          ? <span className="text-2xl shrink-0">🏆</span>
          : <img
              src={`https://flagcdn.com/w40/${FLAG_CODE[section.id] ?? section.id.toLowerCase()}.png`}
              alt={section.name}
              className="w-8 h-6 rounded object-cover shrink-0 border border-slate-100"
              onError={e => { e.target.style.display = 'none'; }}
            />
        }
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700 text-sm sm:text-base truncate">{teamNames[section.id] ?? section.name}</span>
            {section.group && section.group !== 'Intro' && (
              <span className="text-[10px] bg-indigo-50 text-indigo-500 font-semibold px-1.5 py-0.5 rounded shrink-0">
                {t.groupLabel} {section.group}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5">
              <div className="bg-emerald-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 shrink-0">{counts.have}/{total}</span>
          </div>
        </div>
        <div className="flex gap-1.5 text-[10px] sm:text-xs shrink-0">
          <span className="bg-emerald-50 text-emerald-600 font-semibold px-1.5 py-0.5 rounded">{counts.have}✓</span>
          <span className="bg-indigo-50 text-indigo-500 font-semibold px-1.5 py-0.5 rounded">{counts.spare}+</span>
          <span className="bg-rose-50 text-rose-500 font-semibold px-1.5 py-0.5 rounded">{counts.needed}!</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>

      {/* Bulk action bar */}
      <div className="px-3 pb-2 sm:px-4 flex items-center gap-1.5 flex-wrap border-t border-slate-50">
        <span className="text-[10px] text-slate-400 mr-1">{t.markAll}</span>
        {[
          { action: 'have',   label: t.haveIcon,   cls: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
          { action: 'spare',  label: t.spareIcon,  cls: 'bg-indigo-500 hover:bg-indigo-600 text-white' },
          { action: 'needed', label: t.neededIcon, cls: 'bg-rose-500 hover:bg-rose-600 text-white' },
        ].map(({ action, label, cls }) => (
          <button
            key={action}
            onClick={e => { e.stopPropagation(); onBulk(section.id, action); }}
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${cls}`}
          >
            {label}
          </button>
        ))}
      </div>

      {open && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4 grid grid-cols-5 xs:grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 gap-1.5 sm:gap-2">
          {stickers.map(({ sticker, entry }) => (
            <StickerCard
              key={sticker.id}
              sticker={sticker}
              entry={entry}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Collection() {
  const { t, teamNames } = useLang();
  const { user, isDemo } = useAuth();
  const [stickerMap, setStickerMap]   = useState({});
  const [saving, setSaving]           = useState(false);
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('needed');
  const [groupFilter, setGroupFilter] = useState('all');
  const [showQrModal, setShowQrModal] = useState(false);
  const groupBarRef = useRef(null);

  useEffect(() => {
    async function load() {
      let raw = {};
      if (isDemo) {
        const u = demoGetUser(user.uid);
        raw = u?.stickers || {};
      } else {
        const snap = await getDoc(doc(db, 'users', user.uid));
        raw = snap.data()?.stickers || {};
      }
      // Migrate: if pegada + falta coexist, pegada wins (clear falta)
      let dirty = false;
      const migrated = {};
      Object.entries(raw).forEach(([k, v]) => {
        if (v && typeof v === 'object' && v.h && v.n) {
          migrated[k] = { ...v, n: 0 };
          dirty = true;
        } else {
          migrated[k] = v;
        }
      });
      setStickerMap(migrated);
      if (dirty) {
        const toSave = {};
        Object.entries(migrated).forEach(([k, v]) => { if (v) toSave[k] = v; });
        if (isDemo) demoUpdateStickers(user.uid, toSave);
        else updateDoc(doc(db, 'users', user.uid), { stickers: toSave }).catch(console.error);
      }
    }
    load();
  }, [user.uid, isDemo]);

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

  const handleUpdate = useCallback(async (id, have, qty, needed) => {
    const newEntry = saveEntry(id, have, qty, needed);
    const updated = { ...stickerMap };
    if (!newEntry) delete updated[id];
    else updated[id] = newEntry;
    setStickerMap(updated);
    await persist(updated);
  }, [stickerMap, persist]);

  const handleBulk = useCallback(async (sectionId, action) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section) return;
    const actionLabels = { have: 'Tengo', spare: 'Sobran', needed: 'Faltan', clear: 'Limpiar' };
    const label = actionLabels[action] || action;
    if (!window.confirm(`¿Marcar todas las figuritas de "${section.name}" como "${label}"?`)) return;
    const updated = { ...stickerMap };
    section.stickers.forEach(st => {
      const prev = updated[st.id];
      if (action === 'clear')   { delete updated[st.id]; }
      else if (action === 'have')   { updated[st.id] = { h: 1, q: getQty(prev), n: 0 }; }
      else if (action === 'needed') { updated[st.id] = { h: getHave(prev) ? 1 : 0, q: getQty(prev), n: 1 }; }
      else if (action === 'spare')  { updated[st.id] = { h: getHave(prev) ? 1 : 0, q: (getQty(prev) || 1), n: 0 }; }
    });
    setStickerMap(updated);
    await persist(updated);
  }, [stickerMap, persist]);

  const have     = Object.values(stickerMap).filter(v => getHave(v)).length;
  const spare    = Object.values(stickerMap).filter(v => getQty(v) > 0).length;
  const needed   = Object.values(stickerMap).filter(v => getNeeded(v)).length;
  const progress = Math.round((have / TOTAL_STICKERS) * 100);

  const groups = ['all', ...Array.from(new Set(SECTIONS.map(s => s.group).filter(Boolean)))];

  const isFiltering = search !== '' || filter !== 'all' || groupFilter !== 'all';

  const filteredSections = SECTIONS.map(section => ({
    section,
    stickers: section.stickers
      .filter(st => {
        const q   = search.toLowerCase();
        const matchSearch = q === '' ||
          st.name.toLowerCase().includes(q) ||
          st.number.toLowerCase().includes(q) ||
          section.name.toLowerCase().includes(q);
        const ent = stickerMap[st.id];
        const matchFilter =
          filter === 'all' ||
          (filter === 'have'   && getHave(ent))      ||
          (filter === 'spare'  && getQty(ent) > 0)   ||
          (filter === 'needed' && getNeeded(ent))     ||
          (filter === 'none'   && !getHave(ent) && getQty(ent) === 0 && !getNeeded(ent));
        const matchGroup = groupFilter === 'all' || section.group === groupFilter;
        return matchSearch && matchFilter && matchGroup;
      })
      .map(st => ({ sticker: st, entry: stickerMap[st.id] || null })),
  })).filter(s => s.stickers.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      {/* ── Stats header ── */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 sm:p-5 text-white mb-4 shadow-[0_4px_20px_rgba(99,102,241,0.25)]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">{t.albumTitle}</h2>
            <p className="text-indigo-200 text-xs sm:text-sm mt-0.5">{have} {t.albumOf} {TOTAL_STICKERS} {t.albumStickers}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/20 text-white hover:bg-white/30 transition-all flex items-center gap-1"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
            <button
              onClick={() => setFilter(filter === 'needed' ? 'all' : 'needed')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === 'needed'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {filter === 'needed' ? 'Ver todas' : 'Ver solo las que faltan'}
            </button>
          </div>
        </div>
        <div className="flex gap-3 sm:gap-5 text-center mb-3">
          {[
            { n: have,   label: t.statusHave,   color: 'text-emerald-300' },
            { n: spare,  label: t.statusSpare,  color: 'text-sky-300' },
            { n: needed, label: t.statusNeeded, color: 'text-rose-300' },
          ].map(({ n, label, color }) => (
            <div key={label}>
              <div className="text-xl sm:text-2xl font-bold">{n}</div>
              <div className={`text-[10px] sm:text-xs ${color}`}>{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-indigo-200 mb-1">
            <span>{t.progress}</span><span>{progress}%</span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div className="bg-white/90 rounded-full h-2 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-14 z-20 bg-[#f0f2f5]/95 backdrop-blur-sm pb-2 pt-2 -mx-3 sm:-mx-4 px-3 sm:px-4 border-b border-slate-200/70 mb-3">

        {/* Group pills */}
        <div ref={groupBarRef} className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setGroupFilter(g)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border whitespace-nowrap ${
                groupFilter === g
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {g === 'all' ? t.groupAll : g === 'Intro' ? `🏆 ${t.groupIntro}` : `Grp ${g}`}
            </button>
          ))}
        </div>

        {/* Search + status filter */}
        <div className="flex gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 placeholder:text-slate-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-2.5">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
          <div className="flex gap-1">
            {[
              { key: 'all',    label: t.filterAll },
              { key: 'have',   label: '✓'         },
              { key: 'spare',  label: '+N'         },
              { key: 'needed', label: '!'          },
              { key: 'none',   label: '○'          },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  filter === key
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Legend (compact) ── */}
      <div className="flex gap-3 text-[11px] text-slate-400 mb-3 flex-wrap">
        <span className="text-emerald-600 font-medium">✓ {t.statusHave}</span>
        <span className="text-indigo-500 font-medium">+N {t.statusSpare}</span>
        <span className="text-rose-500 font-medium">! {t.statusNeeded}</span>
        <span>○ {t.statusNone}</span>
      </div>

      {/* ── Sections ── */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">{t.noResults}</p>
          {isFiltering && (
            <button
              onClick={() => { setSearch(''); setFilter('all'); setGroupFilter('all'); }}
              className="mt-3 text-xs text-orange-500 underline"
            >
              {t.clearFilters}
            </button>
          )}
        </div>
      ) : (
        filteredSections.map(({ section, stickers }) => (
          <SectionBlock
            key={section.id}
            section={section}
            stickers={stickers}
            onUpdate={handleUpdate}
            onBulk={handleBulk}
            startOpen={isFiltering || filteredSections.length === 1}
            t={t}
            teamNames={teamNames}
          />
        ))
      )}

      {/* ── Floating save indicator ── */}
      {saving && (
        <div className="fixed bottom-5 right-4 bg-slate-800/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 z-50">
          <RefreshCw className="w-3 h-3 animate-spin" /> {t.saving}
        </div>
      )}

      {/* ── QR Modal ── */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQrModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Compartir colección</h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/user/' + user.uid)}`}
                alt="QR Code"
                className="w-48 h-48 mb-4"
              />
              <p className="text-sm text-slate-600 text-center mb-4">
                Escanea este código para ver las figuritas que me faltan y las que tengo repetidas.
              </p>
              <a
                href={`${window.location.origin}/user/${user.uid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 text-sm font-semibold hover:underline"
              >
                Abrir enlace directamente
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
