# AegisForge — Deployment Runbook

How to take AegisForge from code to live. There are **two services** (backend + frontend)
plus **two external services** (Supabase for the DB/auth, Resend for email).

> ✅ You can start **without any AI key** — the Blueprint & Nova features now fall back
> to an offline demo (marked `provider: "offline"`). Add a key later to unlock real AI.

---

## 0. What you'll need

| Service                              | Purpose                                      | Account                              |
| ------------------------------------ | -------------------------------------------- | ------------------------------------ |
| **Supabase**                         | Postgres DB + Auth + waitlist/scan storage   | supabase.com (free plan fine)        |
| **Resend**                           | Transactional email (waitlist confirmations) | resend.com (free tier)               |
| **Render**                           | Hosts the FastAPI backend                    | render.com (free)                    |
| **Vercel**                           | Hosts the Next.js frontend                   | vercel.com (free)                    |
| **OpenAI / OpenRouter** _(optional)_ | Real AI for Blueprint + Nova                 | platform.openai.com or openrouter.ai |

---

## 1. Backend (FastAPI) → Render

1. In Render: **New → Web Service → connect the `aegisforge-backend` repo.**
2. Settings:
   - **Runtime:** Python
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - _(The `Procfile` already defines this — Render uses it automatically.)_
3. **Environment variables** (add these in Render → Environment):

```env
# Email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
FROM_EMAIL=AegisForge AI <onboarding@resend.dev>

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
WAITLIST_TABLE=waitlist
PREVIEW_REQUESTS_TABLE=preview_requests
AI_BLUEPRINTS_TABLE=ai_blueprints
REPORTS_TABLE=scan_reports

# Admin
ADMIN_API_KEY=choose_a_long_random_secret

# AI (optional — the app works offline, but adds real AI with a key)
# Provider: openai | openrouter | gemini
AI_PROVIDER=gemini
# Google Gemini — get a free key at aistudio.google.com > Get API key (format: AIza...)
GEMINI_API_KEY=your-gemini-key-here
# Model used for the AI (gemini 3.x is the current line)
AI_MODEL=gemini-3.6-flash

# (alternative providers)
# AI_PROVIDER=openai
# OPENAI_API_KEY=sk-...
# AI_MODEL=gpt-4o-mini
# AI_PROVIDER=openrouter
# OPENROUTER_API_KEY=sk-or-...
# AI_MODEL=openai/gpt-4o-mini

# Rate limits / limits (optional)
RATE_LIMIT_WINDOW_SECONDS=3600
WAITLIST_RATE_LIMIT=5
SCAN_RATE_LIMIT=10
AI_DAILY_FREE_LIMIT=3
```

> ⚠️ Use the Supabase **service_role** key only in the backend — never in frontend code.

4. **Deploy.** The service URL will look like `https://aegisforge-backend.onrender.com`.
   - Health check: `GET https://<your-backend>/health`
   - Swagger docs: `GET https://<your-backend>/docs`

### Supabase setup

Run the SQL files in order against your Supabase project (SQL Editor):

1. `SUPABASE_WAITLIST_SETUP.sql` — waitlist + position
2. `SUPABASE_NOVA_MIGRATION.sql` — Nova tables (auth/users, projects, conversations, decisions, memory)
3. `SPRINT5_MIGRATION.sql` — Sprint 5 persistence tables (`salesforce-style` trailing tables)

---

## 2. Frontend (Next.js) → Vercel

1. In Vercel: **New Project → import `Nova` (or `aegisforge-landing`).**
   - Framework preset: **Next.js** (auto-detected). `vercel.json` handles clean URLs.
2. **Environment variables** (Project → Settings → Environment Variables):

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=https://aegisforge-backend.onrender.com

# Supabase (Auth + DB) — the ANON key, not service_role
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: direct AI calls from the browser
# NEXT_PUBLIC_OPENAI_API_KEY=
```

3. **Deploy.** It builds automatically on every push to `main`.

---

## 3. Smoke test checklist (after deploy)

1. [ ] `GET /health` returns `{"ok": true, "ai_configured": ... }`
2. [ ] Landing page + hero render, dark theme works
3. [ ] Waitlist: submit → row in Supabase → Resend confirmation email arrives
4. [ ] `POST /scan?domain=example.com` → checks render (HTTPS, SSL, headers, cookies, DNS, CDN, tech)
5. [ ] Scan → **Export** (PDF / JSON / CSV) downloads a file
6. [ ] `/blueprint`: enter an idea → blueprint renders (or offline fallback if no key)
7. [ ] `/nova`: prompt → agents respond (or offline fallback)
8. [ ] Sign up / sign in / reset password → Supabase Auth works
9. [ ] `/dashboard` + `/workspace` load after login

---

## 4. Notes

- **AI without a key:** Blueprint & Nova return deterministic offline results (I added this). The UX shows a "connect a key" hint. Add `OPENAI_API_KEY`/`OPENROUTER_API_KEY` to unlock real output.
- **Cold starts:** Render free tier sleeps — the frontend already has a fetch-retry + 30s timeout for cold starts.
- **CORS:** The backend already configures CORS for the frontend origin. If you see CORS errors, confirm the frontend URL is allowed.
- **Rotate secrets:** Re-generate `ADMIN_API_KEY` and any keys that have ever been pasted in a chat/shared.

---

## 5. Local dev

```bash
# backend
cd aegis-backend
cp .env.example .env     # fill in values
pip install -r requirements.txt
uvicorn main:app --reload

# frontend
cd aegis
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_* vars
npm run dev
```
