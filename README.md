# ResumeForge — AI Resume Builder

An AI-powered resume builder with 3 templates and JD tailoring via Claude.

## Setup

```bash
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Connect to Vercel (vercel.com → Import Project)
3. Add `ANTHROPIC_API_KEY` in Vercel → Settings → Environment Variables
4. Deploy!

## Features

- 3 resume templates: Classic, Modern, Minimal
- AI-powered JD tailoring (filters skills, rewrites summary)
- PDF download
- Fully responsive
