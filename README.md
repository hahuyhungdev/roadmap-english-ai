# Roadmap English AI

AI-powered English practice app focused on speaking, shadowing, and sentence-by-sentence training.

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Mantine UI + Tailwind CSS + react-rnd (Floating Notes)
- Drizzle ORM + PostgreSQL
- Soniox (speech-to-text) integration via client hook
- Google TTS + AI feedback endpoints

## Main Features

- Script shadowing practice (paste text, split into sentences, practice step by step)
- YouTube shadowing flow with transcript/translation support
- Voice recording per sentence with instant replay
- AI coaching endpoints for speaking feedback
- Caching for TTS, transcripts, and parsed script sessions
- Floating Note Panel (resizable, draggable, auto-saving workspace for taking notes anywhere)

## Quick Start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Environment Variables

Create `.env.local`:

```bash
DATABASE_URL=postgresql://...

DEEPSEEK_API_KEY=...
DEEPSEEK_MODEL=deepseek-chat

GOOGLE_TTS_API_KEY=...
SUPADATA_API_KEY=...
```

## Database

```bash
pnpm db:generate
pnpm db:push
```

Optional migration runner:

```bash
pnpm db:migrate
```

## Script Shadowing Controls

Current keyboard controls in script mode:

- `A` or `ArrowLeft`: previous sentence
- `D` or `ArrowRight`: next sentence
- `S` or `Space`: listen current sentence
- `ArrowDown`: listen current sentence
- `R` or `ArrowUp`: toggle recording

Recording behavior:

- Press once: start recording
- Press again: stop + submit transcript/audio turn
- After each completed recording, your voice auto replays after 1 second (1 time)

Sentence editing behavior:

- Edit the active sentence directly from the sentence card (pencil icon)
- `Ctrl/Cmd + Enter`: save edit
- `Esc`: cancel edit

## Useful Scripts

- `pnpm dev`: start development server
- `pnpm build`: production build
- `pnpm start`: run production build
- `pnpm lint`: run lint checks
- `pnpm clean:transcript`: clean transcript text via script
- `pnpm db:generate`: generate Drizzle files
- `pnpm db:push`: push schema to DB
- `pnpm db:migrate`: run custom migration script

## API Routes (High Level)

- `/api/tts`: TTS generation/caching
- `/api/coach`: speaking coach flow
- `/api/voice`: speaking/voice assistant endpoint
- `/api/ai`: general AI helper endpoint
- `/api/shadowing/script`: script sentence cache endpoint
- `/api/shadowing/youtube/*`: YouTube transcript/translate/usage endpoints

## Project Structure (High Level)

- `app/`: routes, pages, API handlers
- `src/features/learning`: lesson and speaking coach UI
- `src/features/shadowing`: script/youtube shadowing flows
- `src/lib`: DB, cache, schema, server utilities
- `content/`: session markdown content
