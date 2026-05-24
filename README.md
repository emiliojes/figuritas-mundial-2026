# 🏆 Figuritas Mundial 2026

Aplicación web para gestionar tu álbum de figuritas del **FIFA World Cup 2026** (Panini). Registrá qué figuritas tenés, cuáles te faltan y cuántas repetidas tenés para intercambiar.

🌐 **Demo en vivo:** https://enchanting-muffin-0b5838.netlify.app

---

## ✨ Funcionalidades

- **Mi Colección** — Visualizá las 979 figuritas oficiales del álbum Panini 2026, organizadas por los 48 equipos y la sección introductoria FWC.
- **Estado por figurita** — Cada tarjeta tiene controles independientes:
  - `✓ Pegada` — marcá si ya la pegaste en el álbum
  - `+N repetidas` — contador de copias extra para intercambiar
  - `✗ Falta` — marcá si la necesitás
- **Mis Repetidas** — Vista dedicada con todas las figuritas que tenés de más, agrupadas por equipo. Permite decrementar/incrementar directamente al intercambiar.
- **Marcar todas** — Botones por sección para marcar en bloque (pegada, repetidas, falta, limpiar).
- **Filtros** — Filtrá por grupo (A–L), estado y búsqueda por nombre o número.
- **Grupos del Mundial** — Vista de los 12 grupos con los 4 equipos de cada uno.
- **Idioma ES/EN** — Toggle en el navbar para cambiar entre español e inglés (persiste en localStorage).
- **Banderas reales** — Imágenes de banderas via [flagcdn.com](https://flagcdn.com).

---

## 🔐 Autenticación

- **Email y contraseña**
- **Google Sign-In** (popup)
- **Modo demo** — Si no configurás Firebase, los datos se guardan en localStorage del navegador.

---

## 🛠 Stack técnico

| Tecnología | Uso |
|---|---|
| [React 18](https://react.dev) + [Vite](https://vitejs.dev) | Frontend |
| [TailwindCSS](https://tailwindcss.com) | Estilos |
| [Firebase Auth](https://firebase.google.com/products/auth) | Autenticación |
| [Firestore](https://firebase.google.com/products/firestore) | Base de datos |
| [Lucide React](https://lucide.dev) | Iconos |
| [Netlify](https://netlify.com) | Deploy |

---

## 🚀 Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/emiliojes/figuritas-mundial-2026.git
cd figuritas-mundial-2026

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🔧 Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Activar **Authentication** → Email/Password y Google
3. Crear base de datos **Firestore** en modo test
4. Copiar la configuración del proyecto en `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> ⚠️ El archivo `.env` está en `.gitignore` — nunca se sube al repositorio.

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx          # Barra de navegación con toggle de idioma
│   └── ProtectedRoute.jsx  # Rutas protegidas por autenticación
├── context/
│   ├── AuthContext.jsx     # Autenticación Firebase + demo mode
│   └── LangContext.jsx     # Internacionalización ES/EN
├── data/
│   └── stickers.js         # Catálogo completo de 979 figuritas
├── lib/
│   └── demoStore.js        # Almacenamiento local para modo demo
└── pages/
    ├── Collection.jsx      # Mi Colección (página principal)
    ├── Spares.jsx          # Mis Repetidas
    ├── Groups.jsx          # Grupos del Mundial
    ├── GroupDetail.jsx     # Detalle de un grupo
    └── Login.jsx           # Login / Registro
```

---

## 📦 Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Vista previa del build
```

---

## 🌍 Deploy

El proyecto está configurado para Netlify con `netlify.toml`. Para redesplegar:

```bash
netlify deploy --prod --dir=dist
```

---

## 📄 Licencia

MIT — libre para uso personal.
