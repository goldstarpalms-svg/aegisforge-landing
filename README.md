# AegisForge

**Your first AI software company.**

AegisForge is an AI operating system that builds, secures, and deploys applications from a single conversation. Built with Next.js 15, React 19, TypeScript, TailwindCSS 4, and Framer Motion 13.

## Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + TypeScript + TailwindCSS 4
- **Motion:** Framer Motion 13
- **Icons:** Lucide React
- **Theming:** next-themes (dark/light)
- **Backend:** [aegisforge-backend](https://github.com/goldstarpalms-svg/aegisforge-backend) (FastAPI on Render)

## Pages

| Page       | Route         |
| ---------- | ------------- |
| Home       | `/`           |
| Vision     | `/vision`     |
| Roadmap    | `/roadmap`    |
| Technology | `/technology` |
| Blog       | `/blog`       |
| FAQ        | `/faq`        |
| Contact    | `/contact`    |
| Waitlist   | `/waitlist`   |
| Privacy    | `/privacy`    |
| Terms      | `/terms`      |

## API Routes

| Route           | Method | Description                              |
| --------------- | ------ | ---------------------------------------- |
| `/api/health`   | GET    | Health check                             |
| `/api/waitlist` | POST   | Waitlist submission → proxied to backend |

## Backend Integration

The waitlist connects to the AegisForge backend at `https://aegisforge-backend.onrender.com`:

- `POST /waitlist` — Email + name + company → Supabase + Resend confirmation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | Description               |
| ------------------- | ------------------------- |
| `npm run dev`       | Start dev server          |
| `npm run build`     | Production build          |
| `npm run start`     | Start production server   |
| `npm run lint`      | ESLint                    |
| `npm run typecheck` | TypeScript check          |
| `npm run validate`  | Lint + typecheck + format |

## License

MIT
