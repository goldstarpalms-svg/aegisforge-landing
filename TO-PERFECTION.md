# 🔮 AegisForge — The Path to Perfect

A living plan to take AegisForge from *great* to *flawless*. Prioritized by **impact > effort**.
Tick items off as we complete them. **Status: ✅ done · 🔄 in progress · ⬜ planned**

---

## ✅ Round 1 — Launch Polish (DONE)
- [x] Remove all "coming soon" / placeholder copy (Blog, referral, trust)
- [x] Honest roadmap (Nova + Workspace = Live now)
- [x] Confident trust messaging
- [x] Typecheck / lint / production build all green

## ✅ Round 2 — Futuristic Redesign (DONE)
- [x] Aurora nebula animated background (orbit ribbons, grid, scanline, particles)
- [x] Glowing gradient hero headline ("Live Application.")
- [x] HUD navbar with "SYSTEM ONLINE" pulsing status + cyan glow
- [x] Electric-gradient primary CTA buttons (site-wide)
- [x] Premium module cards (aurora sheen, glow-border, hover)
- [x] Aurora gradient headings on all 9 sub-pages
- [x] Route transitions (fade/slide on navigation via template.tsx)
- [x] Animated energy core behind hero visual
- [x] **Nova holographic agent-network orbit + token-typed terminal** (Round 3)
- [x] reusable `SectionTitle` component (pointer-tracked gradient shimmer)

---

## 🔄 PHASE 1 — Make the *product* perfect (what users experience)

### Visual & motion (mostly done — remaining polish)
- [x] Apply glass/glow + gradient headings to **auth pages** (sign-in/sign-up/reset) so they match
- [x] Apply to **dashboard, workspace, scanner, blueprint, nova** (the app pages — the product core)
- [ ] Consistent **page-load** animations across every route
- [ ] Add a **favicon/OG image** that matches the new aurora brand (currently `/favicon.ico` + `/og-image.png`)
- [ ] Add **subtle sound/haptic** on key actions (optional)

### Content & copy
- [ ] Real **blog posts** (2–3 launch notes) so Blog isn't "soon"
- [ ] A **pricing/plans page** ("Free → Pro → Enterprise")
- [ ] **About / Team** page (founder story, mission) for credibility
- [ ] A **Security/Trust** page (given the scanner, this is a natural trust asset)
- [ ] **Changelog** page (shows momentum)

### Product depth (the AI value)
- [ ] Make **Blueprint** write richer output (schema, pricing, monetization already there)
- [ ] Add a **"deploy a template"** quick-start (pre-built app templates) — big demo wow
- [ ] Wire **Nova** to actually call the live backend from the landing (or a hosted demo)
- [ ] Add **project persistence** UX (rename, star, archive)

---

## 🔄 PHASE 2 — Make it *feel* bulletproof (launch readiness)

### Functional correctness
- [ ] Add automated **tests** (unit + a couple E2E with Playwright) — currently zero
- [ ] **Error boundaries** + friendly empty/error states on every page
- [ ] **Loading skeletons** on data-driven pages (dashboard/workspace/scanner)
- [ ] **A11y**: focus states, aria labels, keyboard nav, reduced-motion respected (mostly done via useReducedMotion)
- [ ] **Image optimization** (next/image, WebP, lazy) — some images are unoptimized
- [ ] **Lighthouse**: audit performance, accessibility, best-practices, SEO — get ≥90 across

### Real features working end-to-end
- [ ] **Auth** fully working (sign-up → Supabase → confirm → dashboard). Verify live.
- [ ] **Waitlist** → Supabase + Resend email (needs `RESEND_API_KEY` + `SUPABASE_*` set)
- [ ] **Scanner** live (already fixed) — add shareable report links (backend has `/report/{id}`)
- [ ] **Blueprint** live (offline fallback works) — add real key
- [ ] **Nova** live (offline fallback works) — add real key

---

## 🔄 PHASE 3 — Make it *grow* (distribution)

### SEO & visibility
- [ ] Correct the live `siteConfig.url` (currently `aegisforge.com` placeholder → real domain)
- [ ] Add `sitemap.xml` + `robots.txt` (public dir)
- [ ] Add SEO metadata per page (title/description/OG/JSON-LD) — mostly present
- [ ] Submit to **Google Search Console** + **Bing**
- [ ] Open-graph image matching the new aurora brand

### Launch & community
- [ ] **Custom domain** + deploy env vars (DEPLOY.md has the runbook)
- [ ] **Waitlist live** (email capture working)
- [ ] **AI key** (OpenAI/OpenRouter) so Blueprint/Nova are real
- [ ] **Socials** — X/LinkedIn presence + bios linking to site
- [ ] **Analytics** (Vercel Analytics already wired; add privacy-friendly option)

---

## ✅ Definition of "PERFECT" (our target)
When all three are true:
1. **Looks** — every page (marketing + app) is cohesive, premium, futuristic, and responsive (≥90 Lighthouse).
2. **Works** — auth, scanner, blueprint, Nova, waitlist all function end-to-end on real infra with real AI.
3. **Grows** — indexed on Google/Bing, on a custom domain with an OG image, collecting a waitlist, and shareable.

---

## 🚀 Suggested next batch (highest impact first)
1. **App pages visual polish** (dashboard/workspace/scanner/blueprint/nova + auth) — makes the WHOLE product futuristic, not just the landing.
2. **Real blog posts** + **Changelog** + **pricing** — content credibility.
3. **Tests + Lighthouse** — bulletproof the build.
4. **Set env vars** (AI key, Supabase, Resend) + **custom domain** — make it actually run and ship.
5. **SEO + submit** — get found.

> The site is already impressive. This plan turns it into a product that's truly complete and launch-ready.
