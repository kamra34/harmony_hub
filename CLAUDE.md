# HarmonyHub — Project Guide for Claude Code

## Overview

HarmonyHub is a multi-instrument AI-powered music learning web app. Currently supports **Drums** (fully built) and **Piano** (curriculum in progress). Users sign up, choose an instrument, and get a structured curriculum with interactive lessons, practice modes, an AI tutor chatbot, and a pattern studio.

**GitHub**: kamra34/harmony_hub
**Live frontend**: Vercel (deploys from `main` branch) — drums-tutor.vercel.app
**Live backend**: Railway (deploys from `main` branch) — drums-tutor-production.up.railway.app
**Database**: PostgreSQL on Railway (shared by local dev and production)

## Architecture

```
harmony_hub/
├── src/                    # Frontend (React + Vite + TypeScript + Tailwind)
│   ├── shared/             # Shared across instruments (layout, auth, stores, services)
│   ├── drums/              # Drum tutor (complete)
│   └── piano/              # Piano tutor (curriculum in progress)
├── server/                 # Backend (Express + Prisma + PostgreSQL)
│   ├── src/
│   │   ├── index.ts        # Express app entry point
│   │   └── routes/         # API routes (auth, exercises, sessions, progress, chats)
│   ├── prisma/
│   │   └── schema.prisma   # Database schema — READ THIS before any DB changes
│   ├── Dockerfile          # ⚠️ Railway uses this, NOT package.json scripts
│   └── package.json
├── public/
│   ├── audio/piano/        # Real piano samples (Salamander Grand Piano, CC BY 3.0)
│   └── favicon.svg
├── package.json            # Frontend package.json
├── vite.config.ts
└── tsconfig.app.json
```

## Critical Deployment Details

### Frontend (Vercel)
- Deploys from `main` branch automatically
- Free tier: can only deploy from `main` (not `dev`)
- Build command: `npm run build` → `tsc -b && vite build`
- Vercel uses stricter TypeScript than local — always test with `npx tsc --noEmit` before pushing

### Backend (Railway)
- **⚠️ Uses `server/Dockerfile`** — NOT `server/package.json` scripts
- The Dockerfile defines build steps AND the CMD (start command)
- Any changes to build/start process MUST be made in `server/Dockerfile`
- Current CMD: `npx prisma db push --skip-generate && node dist/index.js`
- `prisma db push` runs at container start to sync schema with DB
- Environment variables (DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY, FRONTEND_URL) are set in Railway dashboard

### Database
- PostgreSQL hosted on Railway
- **Same database for local dev and production** — be careful with destructive operations
- Schema defined in `server/prisma/schema.prisma`
- After schema changes: Dockerfile CMD auto-runs `prisma db push` on deploy
- For local: run `cd server && npx prisma db push` manually

## Frontend Structure

### Path Aliases (configured in tsconfig.app.json + vite.config.ts)
- `@shared/*` → `src/shared/*`
- `@drums/*` → `src/drums/*`
- `@piano/*` → `src/piano/*`

### Routing (src/App.tsx)
All instrument pages are nested under their prefix:
- `/` — Landing page (instrument selector)
- `/drums/*` — All drum tutor pages
- `/piano/*` — All piano tutor pages
- `/settings`, `/admin` — Shared pages

**⚠️ IMPORTANT**: All `Link to=` and `navigate()` calls inside drum pages MUST use `/drums/` prefix (e.g., `/drums/curriculum`, `/drums/lesson/...`). Same for piano with `/piano/`. This was a major bug source during the restructure.

### InstrumentLayout
Wraps each instrument's pages. Sets:
- Browser tab title and favicon per instrument
- CSS custom properties for theming (--accent, --accent-bg, etc.)
- InstrumentContext (React context providing current instrument)

### Theming
- Drums: amber/orange (#f59e0b)
- Piano: soft lavender/violet (#a78bfa)
- Defined in `src/shared/styles/themes.ts` and `src/shared/config/instrumentConfig.ts`

### State Management
- **Zustand** with `persist` middleware (localStorage)
- `useAuthStore` — authentication (shared)
- `useUserStore` — drum progress (key: "drum-tutor-user")
- `usePianoProgressStore` — piano progress (key: "piano-tutor-user")
- `useAiStore` — AI chat state
- `useMidiStore` — MIDI device connection (drums)

## Backend Structure

### API Routes (all prefixed with /api/)
- `POST /api/auth/register`, `POST /api/auth/login` — JWT auth
- `GET/POST/PUT/DELETE /api/exercises` — User-created patterns/exercises
- `POST /api/sessions` — Record practice session results
- `GET/POST /api/progress` — Sync lesson completion
- `GET/POST /api/chats` — AI tutor conversations (uses Anthropic API)

### Prisma Models
- `User` — email, password hash, role
- `Exercise` — patterns/exercises (has `instrument` field: "drums" | "piano")
- `PracticeSession` — practice attempt scores (has `instrument` field)
- `ChatConversation` / `ChatMessage` — AI tutor chats (has `instrument` field)
- `LessonCompletion` — tracks completed lessons

### CORS
Configured in `server/src/index.ts`. Allows origins from FRONTEND_URL env var and localhost ports.

## Piano Curriculum System

Based on **Alfred's Basic Adult Piano Course**. Current state: Modules 0-1 (19 lessons, 10 exercises).

### Data Flow
```
CURRICULUM (src/piano/data/curriculum.ts)
  → CurriculumPage (module list with expand/collapse)
  → LessonPage (single lesson viewer)
  → LessonBlockRenderer (renders text/image/quiz blocks)
  → LESSON_VISUALS mapping (src/piano/data/lessonVisuals.ts)
  → Visual components (KeyboardDiagram, StaffGuide, etc.)
```

### Visual Components (src/piano/components/visuals/)
- `KeyboardDiagram` — Interactive SVG keyboard, click-to-play with real samples
- `StaffGuide` — Grand staff with treble/bass clef, note hover info
- `HandPositionGuide` — Finger numbering with posture tips
- `NoteValuesChart` — Note durations with animated playback
- `MelodyPlayer` — Animated keyboard + note sequence for melody demos

### Piano Audio (src/piano/services/pianoSounds.ts)
- Real piano samples in `public/audio/piano/` (C3-C6, 37 MP3 files)
- Loaded and cached via Web Audio API
- Falls back to synthesis if sample unavailable
- `playPianoNote(note, velocity?, duration?)` — main playback function

### Lesson Visual Props
The visual system supports passing props from `lessonVisuals.ts`:
```ts
{ component: 'melody-player', afterBlock: 0, props: { title: '...', melody: [...] } }
```

## Drum Tutor (Complete)

### Features
- Full curriculum (3 modules, 24 lessons, 22 exercises)
- Real-time MIDI input from electronic drum kits
- Practice modes: Notation Reading, Beats, Rudiments, Fills, Daily, Free Play
- Studio: Create/edit/save patterns, AI pattern generation, scan notation from photos
- AI Tutor: Chat with "Max" (Anthropic Claude) for drumming advice
- Global metronome with BPM control

### Key Drum Files
- `src/drums/data/curriculum.ts` — All lesson content (~2500 lines)
- `src/drums/services/midiService.ts` — Web MIDI API connection
- `src/drums/services/scoringEngine.ts` — Real-time hit detection + scoring
- `src/drums/services/drumSounds.ts` — Drum sample playback

## Git Workflow
- `dev` branch for development
- `main` branch for production (Vercel + Railway deploy from here)
- Merge dev → main, push both when ready to deploy
- Always return to `dev` after pushing

## Common Gotchas
1. **Routes**: Always use `/drums/` or `/piano/` prefix in instrument pages
2. **Dockerfile**: Railway uses Dockerfile, not package.json scripts
3. **Shared DB**: Local and prod share the same PostgreSQL — careful with seeds/migrations
4. **Strict TS on Vercel**: `useRef()` needs explicit `undefined` arg, type casts may need `unknown` intermediate
5. **CRLF warnings**: Windows dev environment, git handles conversion
6. **Auth page favicon**: Must reset title/favicon in AuthPage and LandingPage on mount
