export type Locale = 'fr' | 'en';

export type WorkItem = {
  kind: string;
  title: string;
  org?: string;
  period?: string;
  summary: string;
  bullets: string[];
  stack: string[];
  href?: string;
};

export type NowEntry = {
  label: string;
  text: string;
};

export type SiteContent = {
  meta: { title: string; description: string };
  header: { contact: string; switchTo: string };
  hero: { eyebrow: string; title: string; description: string; cta: string };
  work: { eyebrow: string; title: string; intro: string; items: WorkItem[] };
  now: { eyebrow: string; title: string; entries: NowEntry[] };
  footer: {
    prompt: string;
    cta: string;
    resume: string;
    source: string;
    backToTop: string;
    views: (count: string) => string;
  };
};

export const links = {
  email: 'eliot.walter12@gmail.com',
  github: 'https://github.com/zafopyss',
  linkedin: 'https://fr.linkedin.com/in/eliot-walter-2b9305273',
  source: 'https://github.com/zafopyss/portfolio-website',
  resume: {
    fr: '/resume/CV_Eliot_WALTER_2026.pdf',
    en: '/resume/Resume_Eliot_WALTER_2026.pdf',
  },
} as const;
