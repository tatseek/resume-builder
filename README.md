# ResumeForge — AI-Powered Resume Builder

A free, modern resume builder that lets you create a professional resume in minutes — and tailor it to any job description using AI.

Built with Next.js, Tailwind CSS, and the Anthropic Claude API. Deployed on Vercel.
Link :[ https://resume-builder-alpha-taupe-77.vercel.app/](https://resume-builder-alpha-taupe-77.vercel.app/)

---

## About the Project

Job applications are tedious. Most resume builders are either paywalled, clunky, or produce generic output that doesn't speak to the specific role you're applying for.

ResumeForge solves this by combining a clean form-based resume builder with an AI tailoring feature — paste a job description, and Claude will rewrite your summary and filter only the relevant skills from your list to match the role.

### Features

- **3 professional templates** — Classic (ATS-safe), Modern (sidebar layout), Minimal (spacious and clean)
- **AI-powered JD tailoring** — paste any job description and Claude filters your skills and rewrites your summary to align with the role
- **Live preview** — see your resume update in real time as you fill in the form
- **PDF export** — download a print-ready PDF via jsPDF and html2canvas
- **Projects section** — showcase your work with name, tech stack, description, and link
- **Hyperlinked LinkedIn and GitHub** — display text + URL so your resume looks clean in both digital and print form
- **Fully free** — no paywalls, no subscriptions, no credit card

### Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| PDF Export | jsPDF + html2canvas |
| Deployment | Vercel (free Hobby plan) |
| Language | TypeScript |

---

## Project Structure

```
resume-builder/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── tailor/
│   │   │       └── route.ts        # API route — calls Claude to tailor resume
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Main resume builder UI (form + preview + steps)
│   ├── components/
│   │   └── templates/
│   │       ├── ClassicTemplate.tsx
│   │       ├── ModernTemplate.tsx
│   │       └── MinimalTemplate.tsx
│   └── types/
│       └── resume.ts               # TypeScript interfaces for all resume data
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- An Anthropic API key — get one free at [console.anthropic.com](https://console.anthropic.com)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/tatseek/resume-builder.git
cd resume-builder
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=//your api key here
```

**4. Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

**1. Push your code to a public GitHub repository**

**2. Go to [vercel.com](https://vercel.com)**
- Click **Add New → Project**
- Import your GitHub repository
- Framework will auto-detect as **Next.js** — leave all settings as default

**3. Add your environment variable**
- In the project settings, go to **Environment Variables**
- Add `ANTHROPIC_API_KEY` with your key as the value

**4. Click Deploy**

Vercel will build and deploy your app. Every future push to `main` will trigger an automatic redeploy.

> **Note:** Never commit your `.env.local` file or expose your API key in the frontend code. The key is only used server-side in the `/api/tailor` route.

---

## How to Use

1. **Fill in your details** — personal info, summary, experience, projects, education, and skills
2. **Click "Continue to Build Resume"**
3. **Choose a mode:**
   - *Generate Resume* — builds your resume as-is
   - *Tailor for a Job Description* — paste a JD and let Claude rewrite your summary and filter relevant skills
4. **Pick a template** — Classic, Modern, or Minimal
5. **Download as PDF**

---

## License

MIT — free to use, modify, and deploy.
