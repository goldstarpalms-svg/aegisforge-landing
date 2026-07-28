# AegisForge AI Landing Page

Frontend landing page for AegisForge AI — an autonomous AI platform that builds, secures, and deploys applications.

## Features

- Free website security scanner UI with downloadable text reports
- Waitlist signup form
- Supabase-backed waitlist position display through the backend
- Resend-powered welcome email through the backend
- Legal pages: Terms and Privacy
- Responsive landing page sections for product preview, modules, pricing, trust, story, FAQ, contact, and waitlist
- SEO/social sharing metadata and branded favicon
- Premium product preview, pricing preview, trust section, and scanner report downloads

## Important files

- `index.html` — main landing page
- `style.css` — styling for all public pages
- `script.js` — waitlist, scanner, report download, FAQ, countdown, and UI interactions
- `privacy.html` — privacy policy
- `terms.html` — terms of service
- `favicon.svg` — branded browser/social icon

## Backend dependency

The frontend calls the deployed backend API:

```js
const BACKEND_API_URL = 'https://aegisforge-backend.onrender.com';
```

Current frontend flows:

- `POST /waitlist` — stores user in Supabase and sends welcome email using Resend
- `POST /scan` — runs the website security scanner

## Deployment

This repo is intended to deploy as a static frontend on Vercel or any static host.

After pushing to GitHub, Vercel should auto-deploy from the `main` branch if connected.

## Notes

Do not put backend secrets, Supabase service-role keys, or Resend API keys in this frontend repo. Secrets belong only in the backend deployment environment.
