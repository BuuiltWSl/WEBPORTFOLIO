# Portfolio Workspace Summary

This workspace is for a personal portfolio website for Dev.bu1ltwsl, a student interested in computer engineering, game development, creative technology, AI, IoT, and interactive projects.

## Main Work

The main work is a portfolio web app built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and Lucide React. The app presents personal background, skills, projects, competitions, camps, and achievements in a structured portfolio format.

## Website Structure

- Main: personal introduction, quote, profile image, school, goals, interests, and skills.
- Computer Projects & Rewards: POSN Camp 1, CU TOWN, Heal The Horror, and 3D modeling competition work.
- Sci-Math Projects & Rewards: water rocket competitions, engineering activities, and science/math achievements.
- Camp and Other: camps that shaped interest in computer science and engineering.
- Built: overall identity as a builder who combines coding, game development, design, engineering, and creative problem solving.

## Project Folders

- `port`: Next.js portfolio project.
- `portfolio-web`: another Next.js portfolio project with similar structure and dependencies.
- `MYSTAT.md`: source notes about camps, competitions, and personal experiences.
- `PORTFOLIO.md`: portfolio content draft.
- `WEB.md`: website structure draft.
- `skill.md`: workspace rules for future work.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- React Markdown and Remark GFM in `portfolio-web`

## Run

For development, run:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

For production, build first:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

The production server uses the `start` script in `package.json`:

```bash
next start -H 0.0.0.0
```

If a server says `No npm start script found`, check that the server is running from the repository root. The root must contain `package.json`.

```bash
cd /home/bu1ltwsl/portfolio-web
pwd
ls
cat package.json
git pull origin main
npm install
npm run build
npm start
```

The latest pushed commit should be visible with:

```bash
git rev-parse --short HEAD
```

## Supabase Setup

Create `.env.local` from `.env.example`, then use the real project API URL:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_ADMIN_EMAIL=sangsanwongmoolno.4@gmail.com
```

Do not use a Supabase dashboard URL.

Open Supabase SQL Editor and run:

```text
supabase/schema.sql
```

Then check setup:

```bash
npm run check:supabase
```

## Run Under A Sub Path

For `https://questcity.cloud/built/portfolio-web`, set:

```env
NEXT_PUBLIC_SITE_URL=https://questcity.cloud/built/portfolio-web
NEXT_PUBLIC_BASE_PATH=/built/portfolio-web
```

Then rebuild:

```bash
npm install
npm run build
npm start
```

Ready-to-copy server files live in:

```text
deploy/questcity.env.example
deploy/nginx-questcity.conf
deploy/deploy-questcity.sh
deploy/QUESTCITY_SETUP.md
```

## Work Direction

This portfolio should show a clear story: a student who started from camps and competitions, discovered coding and engineering, built game and metaverse prototypes, learned from real projects, and now aims toward computer engineering and creative technology.
