# Solus OS — Project Context

## Project Identity
**Solus** is a solo "Personal OS" — a unified central workspace to manage professional identity, track tasks, and automate content pipelines. It's designed for a single user (the founder) and deployed on Vercel + MongoDB Atlas.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS 4, Zustand 5, Lucide React icons |
| **Backend** | Express 4 (ES Modules), Mongoose 7, JWT (cookie-based auth) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **LLM** | Multi-provider fallback chain: Groq → OpenRouter → Gemini |
| **Image Storage** | Cloudinary via multer-storage-cloudinary |
| **Auth** | JWT stored in httpOnly cookie (single admin user) |
| **Hosting** | Vercel (client + serverless Express) |

---

## Project Structure

```
solus/
├── client/                          # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js            # Root layout (Outfit font, ToastContainer)
│   │   │   ├── globals.css          # Tailwind + custom theme vars
│   │   │   ├── page.js              # Root → redirects to /login
│   │   │   ├── login/page.jsx       # Login form
│   │   │   └── (dashboard)/         # Authenticated route group
│   │   │       ├── layout.jsx       # Sidebar + Header wrapper
│   │   │       ├── dashboard/page.jsx
│   │   │       ├── settings/page.jsx
│   │   │       ├── learning-hub/
│   │   │       │   ├── page.jsx
│   │   │       │   ├── new/page.jsx
│   │   │       │   └── [id]/edit/page.jsx
│   │   │       └── resource-vault/
│   │   │           ├── page.jsx
│   │   │           ├── new/page.jsx
│   │   │           └── [id]/edit/page.jsx
│   │   ├── components/
│   │   │   ├── layout/              # Sidebar, Header
│   │   │   ├── dashboard/           # Dashboard widgets (placeholder data)
│   │   │   ├── Learning/            # NoteCard
│   │   │   ├── ResourceVault/       # ResourceCard, TagInput
│   │   │   ├── settings/            # Identity, Socials, About, Voice, Services, Resume
│   │   │   └── ui/                  # Card, Badge, ToastContainer
│   │   ├── lib/
│   │   │   ├── axios.js             # Axios instance (cookie-based auth)
│   │   │   └── resourceConstants.js
│   │   ├── services/                # API service modules (auth, notes, resources, settings)
│   │   └── store/                   # Zustand stores (auth, settings, toast)
│   ├── next.config.mjs
│   ├── package.json
│   └── postcss.config.mjs
│
├── server/                          # Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js            # Cloudinary client config
│   ├── src/
│   │   ├── app.js                   # Express app setup
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT cookie verification
│   │   │   ├── error.middleware.js   # Error handler + multer error handling
│   │   │   └── upload.middleware.js  # Multer + Cloudinary upload middleware
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── notes.controller.js
│   │   │   ├── resources.controller.js
│   │   │   └── settings.controller.js
│   │   ├── models/
│   │   │   ├── note.model.js
│   │   │   ├── resource.model.js
│   │   │   ├── settings.model.js
│   │   │   ├── contentStrategy.model.js
│   │   │   ├── postIdea.model.js
│   │   │   └── post.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── note.routes.js
│   │   │   ├── resource.routes.js
│   │   │   └── settings.routes.js
│   │   ├── services/
│   │   │   ├── llm/
│   │   │   │   ├── index.js         # Fallback chain: Groq → OpenRouter → Gemini
│   │   │   │   ├── groq.js
│   │   │   │   ├── openrouter.js
│   │   │   │   └── gemini.js
│   │   │   └── scraper.js           # URL metadata scraper (cheerio)
│   │   ├── prompts/
│   │   │   ├── index.js             # buildUserContext() for LLM prompts
│   │   │   └── notes.js             # Note processing prompt
│   │   └── utils/
│   │       └── asyncHandler.js
│   ├── server.js                    # Entry point
│   └── package.json
│
├── CONTEXT.md                       # This file
├── color_pallete.md
└── solus-os-requirements.md         # Full 12-phase roadmap
```

---

## Coding Conventions

### Server (Express + Mongoose)
- **ES Modules** (`"type": "module"` in package.json)
- **File naming**: `kebab-case` for files (`note.model.js`, `auth.controller.js`)
- **Routes** → **Controllers** → **Models** pattern
- `asyncHandler` wrapper for all async controllers (catches errors, passes to error middleware)
- Auth: httpOnly cookie (`auth_token`) with JWT, verified in `protect` middleware
- Models: Mongoose schema with `timestamps: true`, no comments, clean field definitions
- LLM: `callLLM(prompt)` abstracts multi-provider fallback chain

### Client (Next.js + React)
- **App Router** with route groups (`(dashboard)` for authenticated routes)
- **File naming**: `pascalCase` for components, `camelCase` for services/stores
- **Client Components**: `"use client"` directive at top of interactive components
- **Data fetching**: `useEffect` + `useState` (no React Query/SWR yet), with cleanup flags (`mounted`)
- **State**: Zustand stores for auth, settings, toasts
- **API calls**: Service modules in `src/services/`, using shared `api` axios instance
- **Styling**: Tailwind CSS 4 with `@theme inline` tokens (`--color-glow`, `--color-highlight`, etc.)
- **Icons**: Lucide React

### Theme Colors (from `color_pallete.md` and `globals.css`)
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | `#FFFFFF` | Page background |
| `--color-foreground` | `#1C1C1E` | Primary text |
| `--color-secondary` | `#2C2C2E` | Secondary text |
| `--color-accent` | `#3A3A3C` | UI accents |
| `--color-highlight` | `#8E8E93` | Subtle/placeholder/hints |
| `--color-glow` | `#5E5CE6` | Primary action/active states |

---

## Current Progress (Phase 1–3 Complete)

### ✅ Phase 1 — Foundation
- Next.js + Express setup, MongoDB Atlas connection
- JWT cookie auth (single admin via `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars)
- Sidebar navigation with 7 module links
- Dashboard home (placeholder widgets)
- Settings page: identity, socials, about, goals, voice/tone, services, resume
- Dark/light theme CSS variables

### ✅ Phase 2 — Learning Hub
- Full CRUD for notes
- AI summarization, classification, tagging via LLM fallback chain
- Filter by type, search by title/tag/summary
- Note schema: title, content, source, summary, type (enum), tags, takeaways, embedding

### ✅ Phase 3 — Resource Vault
- Full CRUD for resources
- URL metadata scraping (cheerio) with favicon + title + description extraction
- 10 predefined categories, tag filtering
- Search by title/description
- Resource schema: url (unique), title, siteName, favicon, metaDescription, description, category, tags, embedding

### 🔧 Phase 4 (In Progress) — Content Automation
- **Models created**: `contentStrategy.model.js`, `postIdea.model.js`, `post.model.js`
- **Cloudinary/Multer setup**: Upload middleware configured (`upload.middleware.js`)
- Next steps: CRUD routes/controllers for strategies, ideas, posts; AI content planner; approval workflow; image generation integration

---

## Key Environment Variables

### `server/.env`
```
PORT=4000
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
JWT_SECRET=...
MONGO_URI=...
GEMINI_API_KEY=...
GROQ_API_KEY=...
OPENROUTER_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### `client/.env`
```
NEXT_PUBLIC_API_URL=...
```

---

## Auth Flow
1. Login: `POST /api/auth/login` → server validates credentials, sets `auth_token` httpOnly cookie (path: `/`, 7-day expiry)
2. Protected routes: `protect` middleware reads cookie, verifies JWT, attaches `req.user`
3. Auth check on page load: `GET /api/auth/me` (protected) → dashboard calls this to verify session
4. Client: `useAuthStore` persists `isAuthenticated` flag only; dashboard layout calls `checkAuth()` on mount
5. Logout: `POST /api/auth/logout` → clears cookie + client state
6. 401 interceptor: Axios response interceptor auto-clears auth state and redirects to `/login`

---

## Upload Middleware Usage
```js
import { uploadImage } from '../middleware/upload.middleware.js';

router.post('/upload-image', protect, uploadImage, controller);
// req.file.path → Cloudinary URL
// req.file.filename → Cloudinary public ID
```

---

## Build Roadmap (Remaining)
| Phase | Module | Status |
|-------|--------|--------|
| 4 | Content Automation | 🔧 In progress |
| 5 | Personal Brand Intelligence | 📋 Planned |
| 6 | Freelance & Income Tracker | 📋 Planned |
| 7 | Achievement & Portfolio Engine | 📋 Planned |
| 8 | Career Application Assistant | 📋 Planned |
| 9 | AI Sales & Conversation Assistant | 📋 Planned |
| 10 | Opportunity CRM | 📋 Planned |
| 11 | Personal AI Brain (RAG) | 📋 Planned |
| 12 | Polish & Launch | 📋 Planned |
