---
name: portfolio-work-rules
description: Use this skill when working in this portfolio workspace, editing project files, summarizing work, or changing frontend/backend scripts. Follow the user's direct orders, speak in caveman-style short direct wording, record every change in this Skill.md, restart frontend/backend after frontend/backend script changes, and fix problems instead of apologizing.
---

# Portfolio Work Rules

## Core Rules

- Do only what user order.
- Talk like caveman.
- Say direct thing. Example: say "this bad" instead of "I think this is bad".
- Do not say sorry for anything. Fix it.
- Write every change here in Skill.md.
- Restart frontend and backend when make changes on front/backend script.

## Change Log

- 2026-06-27: Created `skill.md` with user work rules.
- 2026-06-27: Created `Readme.md` as portfolio workspace summary.
- 2026-06-27: Created `Project.md` as project and achievement summary.
- 2026-06-27: Updated `skill.md` Change Log to record completed file creation.
- 2026-06-27: Updated `portfolio-web` with Supabase dependency for auth, database, and storage.
- 2026-06-27: Added `portfolio-web/.env.example` for production and local Supabase settings.
- 2026-06-27: Added `portfolio-web/supabase/schema.sql` for admin users, profiles, projects, media, about me, reviews, RLS policies, and storage buckets.
- 2026-06-27: Added Supabase client helpers in `portfolio-web/src/lib/supabase.ts`.
- 2026-06-27: Added portfolio shared types and category metadata in `portfolio-web/src/lib/portfolio.ts`.
- 2026-06-27: Added language provider in `portfolio-web/src/app/providers.tsx`.
- 2026-06-27: Wrapped `portfolio-web/src/app/layout.tsx` with app providers.
- 2026-06-27: Rebuilt `portfolio-web/src/app/page.tsx` to use `PortfolioClient`.
- 2026-06-27: Added `PortfolioClient`, `AboutSection`, and `ReviewsSection` for database-backed portfolio content, about me, and approved reviews.
- 2026-06-27: Updated `Navbar` with Thai/English toggle, About, Reviews, and Admin link.
- 2026-06-27: Rebuilt `HeroSection`, `BuiltSection`, and `ProjectSection` with clean text, smoother bilingual UI, database project support, image display, GitHub/demo indicators, and Next image optimization.
- 2026-06-27: Added `/auth/callback` page for Supabase OAuth callback.
- 2026-06-27: Added `/admin` page for admin login, project CRUD, image/certificate upload, About Me editing, and review approve/delete controls.
- 2026-06-27: Rebuilt project detail route to support both old local projects and new Supabase UUID projects.
- 2026-06-27: Added admin CSS helpers in `portfolio-web/src/app/globals.css`.
- 2026-06-27: Fixed build errors from wrong callback import path, missing Lucide GitHub icon export, and project detail TypeScript union typing.
- 2026-06-27: Fixed lint error in `ReviewsSection` and cleaned image warnings with `next/image`.
- 2026-06-27: Synced `portfolio-web` into Git repo `WEBPORTFOLIO` root for server pull deployment.
- 2026-06-27: Removed Google font runtime fetch from repo layout and CSS so production build does not fail when Google Fonts is unreachable.
- 2026-06-27: Updated repo `.gitignore` to exclude local `.npm-cache`.
- 2026-06-27: Added `npm start` production run instructions to `README.md`.
- 2026-06-27: Copied local environment settings from old `portfolio-web/.env` to repo `WEBPORTFOLIO/.env.local` without recording secret values.
- 2026-06-27: Corrected local `NEXT_PUBLIC_SUPABASE_URL` from dashboard URL to project API URL without recording secret values.
- 2026-06-27: Added `scripts/check-supabase.mjs` and `npm run check:supabase` to detect missing Supabase schema tables.
- 2026-06-27: Updated `README.md` with Supabase setup steps and warning not to use dashboard URLs.
- 2026-06-27: Updated `npm start` to bind Next.js to `0.0.0.0` for Linux server access.
- 2026-06-27: Added `Procfile` and `server-start.sh` start fallbacks for deployment systems.
- 2026-06-27: Updated `README.md` with server root directory checks for `No npm start script found`.
- 2026-06-28: Added optional `NEXT_PUBLIC_BASE_PATH` support so the app can run under `/built/portfolio-web`.
- 2026-06-28: Updated auth callback redirect to respect base path.
- 2026-06-28: Updated `.env.example` and `README.md` with `questcity.cloud/built/portfolio-web` setup notes.
- 2026-06-28: Added `deploy/questcity.env.example` for production environment variables.
- 2026-06-28: Added `deploy/nginx-questcity.conf` to proxy `/built/portfolio-web` to port `3200`.
- 2026-06-28: Added `deploy/deploy-questcity.sh` for server pull, install, build, and start.
- 2026-06-28: Added `deploy/QUESTCITY_SETUP.md` with DNS, environment, Nginx, HTTPS, and Supabase redirect steps.
- 2026-06-28: Fixed Admin navigation to respect `/built/portfolio-web` base path.
- 2026-06-28: Updated Google login callback to return users to Admin or Reviews based on where login started.
- 2026-06-28: Updated admin and auth callback back links to respect base path.
- 2026-06-28: Improved OAuth callback to save Supabase sessions from auth code or URL hash before redirect.
- 2026-06-28: Added callback wait and error message when Google login returns but Supabase session is not saved.
- 2026-06-28: Removed public Admin buttons from desktop and mobile navbar so admin is accessed by direct URL only.
- 2026-06-28: Changed Supabase OAuth to implicit flow to avoid expired PKCE code exchange on deployed callback path.
- 2026-06-28: Updated auth callback to save URL hash tokens before trying auth code exchange and show a retry message for expired codes.
- 2026-06-28: Added `publicUrl` and `sessionFromUrl` helpers so auth redirects respect base path and pages can save login tokens directly.
- 2026-06-28: Changed Admin Google login to return directly to `/admin` instead of the callback page.
- 2026-06-28: Changed Reviews Google login to return directly to `/#reviews` and restore the session there.
- 2026-06-28: Added admin access check from configured admin email, Supabase `is_admin`, and `profiles.role`.
- 2026-06-28: Updated email login/signup to set the session after success and send signup confirmations back to `/admin`.
- 2026-06-28: Changed review Google redirect from `#reviews` to `?review=1` so it does not collide with OAuth hash tokens.
- 2026-06-28: Added clearer review submit messages when user is not logged in or message is empty.
- 2026-06-28: Adjusted admin access reset to satisfy React lint rules.
