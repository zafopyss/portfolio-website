import type { SiteContent } from './types';

export const en: SiteContent = {
  meta: {
    title: 'Eliot Walter',
    description:
      'Eliot Walter, full-stack Python developer in Strasbourg. Django, FastAPI, TypeScript, Kubernetes.',
  },
  header: { contact: 'Say hello', switchTo: 'FR' },
  hero: {
    eyebrow: 'Full Stack Software Engineer',
    title: 'Code that ships, and stays up.',
    description:
      'At Mantu I look after a Django app used by 10,000 people. In the evenings I dig into new technology and keep up with where it is going. In between, I climb.',
    cta: 'See my work',
  },
  work: {
    eyebrow: 'WORK',
    title: 'Things I’ve\nworked on.',
    intro:
      'Two companies, two side projects, one philosophy: understand the business need before writing code, and build things that last.',
    items: [
      {
        kind: 'FULL-TIME · NAVAL SECTOR',
        title: 'Mantu',
        org: 'Full-stack Python developer',
        period: 'since May 2025',
        summary:
          'A Django app that manages work permits for more than 10,000 people. I modelled the domain, wired up Keycloak SSO and MinIO storage, then followed it into production and on-call.',
        bullets: [
          'I led V2 from scoping with the PMs and POs through to delivery. After rebuilding the templates, adding a permit type takes three days instead of two weeks.',
          'I rebuilt the dev environment and CI/CD: uv instead of pip, containers with mounted volumes, NGINX in front, blocking tests. Deployments got 40% faster.',
          'I mentor two junior developers: reviews, pair programming, a weekly catch-up, and the project’s unwritten rules finally written down.',
        ],
        stack: ['Django', 'PostgreSQL', 'Keycloak', 'MinIO', 'Docker', 'Azure DevOps'],
      },
      {
        kind: 'SIDE PROJECT',
        title: 'Job application tracker',
        summary:
          'A Chrome extension grabs the job posting in one click and fills in the application forms, a kanban tracks the status. A Celery worker reads my Gmail, spots the replies with some fifty rules — an LLM only gets a second opinion when they hesitate — and moves the cards for me.',
        bullets: [
          'Next.js front end: drag and drop, a dashboard, and interviews pushed to Google Calendar with an ICS feed to subscribe to.',
          'On the security side: rotating refresh tokens that revoke the whole session on replay, Google tokens encrypted at rest, and an SSRF guard on the company sites the app fetches.',
          'Every push runs ruff, 700 pytest tests against a real Postgres and a secret scan on GitHub, builds the images and deploys to the k3s cluster on my VPS. Playwright then checks the live app.',
        ],
        stack: ['FastAPI', 'Next.js', 'Celery', 'Redis', 'PostgreSQL', 'k3s'],
        href: 'https://github.com/zafopyss',
      },
      {
        kind: 'HOMELAB',
        title: 'A Kubernetes cluster in the living room',
        summary:
          'Three machines, k3s, Traefik at the door, Tailscale to reach it from outside, logs in Grafana and backups overnight. That’s where my projects run.',
        bullets: [],
        stack: ['Kubernetes', 'k3s', 'Traefik', 'Loki', 'Grafana', 'Tailscale'],
      },
      {
        kind: 'INTERNSHIP · STUDENT ASSOCIATION',
        title: 'GEM Store',
        org: 'Junior software engineer',
        period: 'Oct 2023 – Mar 2024',
        summary:
          'A scheduling tool in Python for a 50-person association. I collected the rules from the people doing it by hand, then put the tool into service. They spend 60% less time on it.',
        bullets: [],
        stack: ['Python', 'PostgreSQL'],
      },
    ],
  },
  now: {
    eyebrow: 'NOW',
    title: 'What I’m\ninto.',
    entries: [
      { label: 'Learning', text: 'Kubernetes for real, by breaking and fixing my own cluster.' },
      { label: 'Exploring', text: 'What’s new in the agentic world, and software architecture.' },
      { label: 'Education', text: 'IMT Atlantique and Grenoble École de Management, dual engineering and management degree.' },
      { label: 'Off screen', text: 'Bouldering and routes. Running.' },
    ],
  },
  footer: {
    prompt: 'A project, a question, or just fancy a chat?',
    cta: 'Drop me a line.',
    resume: 'Resume',
    source: 'Source code',
    backToTop: 'Back to top',
    views: (count) => `${count} views`,
  },
};
