# 🏆 FIFA World Cup 2026 Sticker Album Tracker

A web app to manage your **FIFA World Cup 2026** Panini sticker album. Track which stickers you have, which ones you need, and how many spares you have to trade.

🌐 **Live demo:** https://enchanting-muffin-0b5838.netlify.app

---

## ✨ Features

- **My Collection** — Browse all 979 official Panini 2026 stickers, organized by the 48 teams and the FWC intro section.
- **Per-sticker controls** — Each card has three independent actions:
  - `✓ Glued` — mark if you've already pasted it in the album
  - `+N spares` — counter for extra copies available to trade
  - `✗ Needed` — mark if you're looking for it
- **My Spares** — Dedicated page listing all your spare stickers grouped by team. Increment or decrement directly as you trade.
- **Bulk mark** — Buttons per section to mark all stickers at once (glued, spare, needed, clear).
- **Filters** — Filter by group (A–L), status, or search by name/number.
- **World Cup Groups** — View of all 12 groups with their 4 teams each.
- **ES/EN language toggle** — Switch between Spanish and English from the navbar (persisted in localStorage).
- **Real flags** — Country flag images via [flagcdn.com](https://flagcdn.com).

---

## 🔐 Authentication

- **Email & password**
- **Google Sign-In** (popup)
- **Demo mode** — If Firebase is not configured, data is stored in the browser's localStorage.

---

## 🛠 Tech stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) + [Vite](https://vitejs.dev) | Frontend framework |
| [TailwindCSS](https://tailwindcss.com) | Styling |
| [Firebase Auth](https://firebase.google.com/products/auth) | Authentication |
| [Firestore](https://firebase.google.com/products/firestore) | Database |
| [Lucide React](https://lucide.dev) | Icons |
| [Netlify](https://netlify.com) | Deployment |

---

## 🚀 Local setup

```bash
# Clone the repository
git clone https://github.com/emiliojes/figuritas-mundial-2026.git
cd figuritas-mundial-2026

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start the development server
npm run dev
```

---

## 🔧 Firebase configuration

1. Create a project in the [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password and Google
3. Create a **Firestore** database in test mode
4. Copy your project config into `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> ⚠️ The `.env` file is in `.gitignore` — it is never committed to the repository.

---

## 📁 Project structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar with language toggle
│   └── ProtectedRoute.jsx  # Auth-protected routes
├── context/
│   ├── AuthContext.jsx     # Firebase auth + demo mode
│   └── LangContext.jsx     # ES/EN i18n context
├── data/
│   └── stickers.js         # Full catalog of 979 stickers
├── lib/
│   └── demoStore.js        # localStorage store for demo mode
└── pages/
    ├── Collection.jsx      # My Collection (main page)
    ├── Spares.jsx          # My Spares
    ├── Groups.jsx          # World Cup groups overview
    ├── GroupDetail.jsx     # Single group detail
    └── Login.jsx           # Login / Register
```

---

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build locally
```

---

## 🌍 Deployment

The project is configured for Netlify via `netlify.toml`. To redeploy:

```bash
netlify deploy --prod --dir=dist
```

---

## 📄 License

MIT — free for personal use.
