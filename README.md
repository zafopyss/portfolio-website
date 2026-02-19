# Portfolio Website

Personal portfolio website built with Vite, React, and TypeScript.
This project showcases background, skills, projects, and resume with a modern interface and custom visual components.

## Requirements

- Node.js 20+ recommended
- npm

## Installation

```bash
npm install
```

## Available Scripts

- `npm run dev`: starts the development server (HMR)
- `npm run build`: creates the production build
- `npm run preview`: previews the production build locally
- `npm run lint`: runs ESLint

## Resume PDF

The **View my resume** button (in the *About* section) opens:

`/resume/your_cv.pdf`

To make it work:

1. Put your PDF file in `public/resume/your_cv.pdf`.
2. Links inside the PDF (LinkedIn, GitHub, email, etc.) remain clickable in the browser.
3. Useful reference: [public/resume/README.md](public/resume/README.md#L1-L8).

## Main Structure

- `src/components`: UI, design, interface, and functional components
- `src/sections`: main page sections (About, Projects, Tech, Contact…)
- `src/data`: static data (contacts, projects, tech stack, navigation)
- `src/hooks`: shared logic (e.g., section navigation)
- `public/resume`: public assets related to the resume

## Run Locally

```bash
npm run dev
```

Then open the URL shown by Vite (usually `http://localhost:5173`).