# DayFlow AI — Frontend (React + TypeScript)

Production-ready React + TypeScript single-page app for **DayFlow AI**, deployed on **AWS Amplify** and powered by the FastAPI backend running on AWS Lambda + API Gateway.

## Tech stack

- **Vite 6** + **React 18** + **TypeScript 5**
- **Tailwind CSS 3** (custom warm earth palette)
- **React Query** for server state, optimistic updates, caching
- **React Router v7** for navigation
- **Zustand** for auth session
- **Framer Motion** for micro-animations
- **Sonner** for toast notifications
- **lucide-react** icons

## Setup

```bash
cd frontend-react
npm install
cp .env.example .env   # optionally point at a deployed API
npm run dev            # http://localhost:5173
```

In dev mode, Vite proxies `/auth`, `/events`, `/briefing`, `/users`, `/health` to `http://127.0.0.1:8000` (your FastAPI backend). Set `VITE_API_BASE_URL` in `.env` to override.

## Scripts

| Command            | What it does                  |
| ------------------ | ----------------------------- |
| `npm run dev`      | Local Vite dev server         |
| `npm run build`    | Type-check + production build |
| `npm run preview`  | Serve the built bundle        |
| `npm run typecheck`| TypeScript only               |

## Project layout

```
src/
├── api/         # Typed API client (axios + interceptors)
├── components/
│   ├── auth/    # Login/Register card
│   ├── dashboard/ # FocusCard, QuickActions, EventList, Weather, Traffic, ...
│   ├── layout/  # AppShell, TopNav, BottomNav (mobile), Sidebar (desktop)
│   └── ui/      # Design-system primitives (Button, Card, Input, Select, Skeleton, Logo, ProgressRing)
├── hooks/       # useEvents, useBriefing, useProfile, useTheme
├── lib/         # cn, format, weather icons
├── pages/       # Login, Dashboard, Plan, Tasks, Profile, NotFound
└── store/       # Zustand auth store
```

## Design

The visual language mirrors the existing HTML mock: warm cream/brown surface (`cream-*` tokens), earthy dark mode (`ink-*` tokens), and signature DayFlow orange (`flame-500 = #c87941`) as the action color. The full palette and shadow tokens live in `tailwind.config.ts`.

Layout is **mobile-first** with a bottom nav + floating `+` action button on small screens, and graduates to a **sidebar layout** on `md+`. Dark mode is class-based and persisted to `localStorage`.

## Deployment — AWS Amplify

The repo root contains `frontend-react/amplify.yml`. In the Amplify console:

1. Connect this Git repository.
2. Select the `main` branch.
3. When prompted for build settings, choose **Use existing `amplify.yml`** and point at `frontend-react/amplify.yml`.
4. Add an environment variable: `VITE_API_BASE_URL = https://<your-api-gateway-domain>`.
5. Deploy.

The `public/_redirects` file ensures SPA routes fall back to `index.html`.

## Connecting to AWS

- **Cognito**: Backend handles auth — frontend just stores the ID token returned from `/auth/login`.
- **API Gateway → Lambda → FastAPI**: Set `VITE_API_BASE_URL` to your API Gateway invoke URL.
- **CloudWatch RUM** (optional): Inject the snippet in `index.html` for client-side observability.
