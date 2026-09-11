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
      'At Mantu I look after a Django app used by 10,000 people. In the evenings I tinker with a Kubernetes cluster in my living room. In between, I climb.',
    cta: 'See my work',
  },
  work: {
    eyebrow: 'WORK',
    title: 'Things I’ve\nworked on.',
    intro:
      'Two companies, two side projects. Same approach every time: understand the business before writing code, then stick around for what runs.',
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
          'A Chrome extension grabs the job posting in one click, a kanban tracks the status. A Celery worker reads my inbox, spots the replies and moves the cards for me.',
        bullets: [
          'TypeScript front end: drag and drop, a dashboard, an interview calendar synced with Google Calendar.',
          'Every push runs lint and pytest on GitHub, builds the images and deploys to my k3s cluster.',
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
        stack: ['k3s', 'Traefik', 'Loki', 'Grafana', 'Tailscale'],
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
      { label: 'Exploring', text: 'Coding with AI agents without letting go of the architecture.' },
      { label: 'Education', text: 'IMT Atlantique and Grenoble École de Management, dual engineering and management degree.' },
      { label: 'Off screen', text: 'Bouldering and routes. Running when it’s too hot to climb.' },
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
