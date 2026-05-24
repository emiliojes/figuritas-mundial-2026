import { createContext, useContext, useState } from 'react';

const T = {
  es: {
    appName: 'Figuritas 2026',
    appSub: 'Intercambiá figuritas del Mundial',
    navCollection: 'Mi Colección',
    navGroups: 'Grupos',
    demoWarning: 'Modo demo — los datos se guardan solo en este navegador. Configurá Firebase para uso real.',
    albumTitle: 'Mi Álbum',
    albumOf: 'de',
    albumStickers: 'figuritas',
    progress: 'Progreso',
    searchPlaceholder: 'Buscar jugador o equipo...',
    filterAll: 'Todas',
    groupAll: 'Todos',
    groupLabel: 'Grupo',
    groupIntro: 'Intro',
    markAll: 'Marcar todas:',
    have: 'Tengo',
    spare: 'Sobran',
    needed: 'Faltan',
    clear: 'Limpiar',
    haveIcon: 'Tengo ✓',
    spareIcon: 'Sobran ↔',
    neededIcon: 'Faltan ✗',
    clearIcon: 'Limpiar ○',
    statusHave: 'Tengo',
    statusSpare: 'Me sobra',
    statusNeeded: 'Me falta',
    statusNone: 'Sin marcar',
    saving: 'Guardando…',
    noResults: 'No hay figuritas con esos filtros.',
    clearFilters: 'Limpiar filtros',
    loginTitle: 'Iniciar sesión',
    registerTitle: 'Registrarse',
    namePlaceholder: 'Tu nombre',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Contraseña',
    enterBtn: 'Entrar',
    createBtn: 'Crear cuenta',
    loadingBtn: 'Cargando...',
    googleBtn: 'Continuar con Google',
    orSep: 'o',
    nameRequired: 'Ingresá tu nombre.',
    googleError: 'No se pudo iniciar sesión con Google. Intentá de nuevo.',
    errUserNotFound: 'No existe una cuenta con ese email.',
    errWrongPass: 'Contraseña incorrecta.',
    errEmailInUse: 'Ese email ya está registrado.',
    errWeakPass: 'La contraseña debe tener al menos 6 caracteres.',
    errInvalidEmail: 'El email no es válido.',
    errInvalidCred: 'Email o contraseña incorrectos.',
    errGeneric: 'Ocurrió un error. Intentá de nuevo.',
    groupsTitle: 'Grupos del Mundial 2026',
    groupsTeams: 'equipos',
    groupsView: 'Ver grupo',
  },
  en: {
    appName: 'Stickers 2026',
    appSub: 'Trade your World Cup stickers',
    navCollection: 'My Collection',
    navGroups: 'Groups',
    demoWarning: 'Demo mode — data is saved only in this browser. Set up Firebase for real use.',
    albumTitle: 'My Album',
    albumOf: 'of',
    albumStickers: 'stickers',
    progress: 'Progress',
    searchPlaceholder: 'Search player or team...',
    filterAll: 'All',
    groupAll: 'All',
    groupLabel: 'Group',
    groupIntro: 'Intro',
    markAll: 'Mark all:',
    have: 'Have',
    spare: 'Spare',
    needed: 'Need',
    clear: 'Clear',
    haveIcon: 'Have ✓',
    spareIcon: 'Spare ↔',
    neededIcon: 'Need ✗',
    clearIcon: 'Clear ○',
    statusHave: 'Have',
    statusSpare: 'Spare',
    statusNeeded: 'Need',
    statusNone: 'Unmarked',
    saving: 'Saving…',
    noResults: 'No stickers match those filters.',
    clearFilters: 'Clear filters',
    loginTitle: 'Sign in',
    registerTitle: 'Sign up',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    enterBtn: 'Sign in',
    createBtn: 'Create account',
    loadingBtn: 'Loading...',
    googleBtn: 'Continue with Google',
    orSep: 'or',
    nameRequired: 'Please enter your name.',
    googleError: 'Could not sign in with Google. Please try again.',
    errUserNotFound: 'No account found with that email.',
    errWrongPass: 'Wrong password.',
    errEmailInUse: 'That email is already registered.',
    errWeakPass: 'Password must be at least 6 characters.',
    errInvalidEmail: 'Invalid email address.',
    errInvalidCred: 'Incorrect email or password.',
    errGeneric: 'An error occurred. Please try again.',
    groupsTitle: 'World Cup 2026 Groups',
    groupsTeams: 'teams',
    groupsView: 'View group',
  },
};

export const TEAM_NAMES = {
  es: {
    FWC: 'FIFA World Cup 2026',
    MEX: 'México',        RSA: 'Sudáfrica',      KOR: 'Corea del Sur',  CZE: 'Chequia',
    CAN: 'Canadá',        BIH: 'Bosnia-Herz.',   QAT: 'Qatar',          SUI: 'Suiza',
    USA: 'Estados Unidos',PAR: 'Paraguay',        AUS: 'Australia',      TUR: 'Türkiye',
    NED: 'Países Bajos',  JPN: 'Japón',           SWE: 'Suecia',         TUN: 'Túnez',
    GER: 'Alemania',      CUW: 'Curazao',         CIV: 'Costa de Marfil',ECU: 'Ecuador',
    BEL: 'Bélgica',       EGY: 'Egipto',          IRN: 'IR Irán',        NZL: 'Nueva Zelanda',
    ESP: 'España',        CPV: 'Cabo Verde',       KSA: 'Arabia Saudita', URU: 'Uruguay',
    POR: 'Portugal',      COD: 'Congo DR',         UZB: 'Uzbekistán',     COL: 'Colombia',
    FRA: 'Francia',       SEN: 'Senegal',          IRQ: 'Iraq',           NOR: 'Noruega',
    ARG: 'Argentina',     ALG: 'Argelia',          AUT: 'Austria',        JOR: 'Jordania',
    ENG: 'Inglaterra',    CRO: 'Croacia',          GHA: 'Ghana',          PAN: 'Panamá',
    SCO: 'Escocia',       BRA: 'Brasil',           HAI: 'Haití',          MAR: 'Marruecos',
  },
  en: {
    FWC: 'FIFA World Cup 2026',
    MEX: 'Mexico',        RSA: 'South Africa',   KOR: 'South Korea',    CZE: 'Czechia',
    CAN: 'Canada',        BIH: 'Bosnia-Herz.',   QAT: 'Qatar',          SUI: 'Switzerland',
    USA: 'United States', PAR: 'Paraguay',        AUS: 'Australia',      TUR: 'Türkiye',
    NED: 'Netherlands',   JPN: 'Japan',           SWE: 'Sweden',         TUN: 'Tunisia',
    GER: 'Germany',       CUW: 'Curaçao',         CIV: 'Ivory Coast',    ECU: 'Ecuador',
    BEL: 'Belgium',       EGY: 'Egypt',           IRN: 'IR Iran',        NZL: 'New Zealand',
    ESP: 'Spain',         CPV: 'Cape Verde',       KSA: 'Saudi Arabia',   URU: 'Uruguay',
    POR: 'Portugal',      COD: 'DR Congo',         UZB: 'Uzbekistan',     COL: 'Colombia',
    FRA: 'France',        SEN: 'Senegal',          IRQ: 'Iraq',           NOR: 'Norway',
    ARG: 'Argentina',     ALG: 'Algeria',          AUT: 'Austria',        JOR: 'Jordan',
    ENG: 'England',       CRO: 'Croatia',          GHA: 'Ghana',          PAN: 'Panama',
    SCO: 'Scotland',      BRA: 'Brazil',           HAI: 'Haiti',          MAR: 'Morocco',
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'es');

  function toggle() {
    const next = lang === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', next);
    setLang(next);
  }

  return (
    <LangContext.Provider value={{ t: T[lang], lang, toggle, teamNames: TEAM_NAMES[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
