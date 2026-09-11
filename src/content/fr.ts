import type { SiteContent } from './types';

export const fr: SiteContent = {
  meta: {
    title: 'Eliot Walter',
    description:
      'Eliot Walter, développeur full-stack Python à Strasbourg. Django, FastAPI, TypeScript, Kubernetes.',
  },
  header: { contact: 'Me contacter', switchTo: 'EN' },
  hero: {
    eyebrow: 'Développeur full-stack Python · Strasbourg',
    title: 'Du code qui part en prod, et qui y reste.',
    description:
      'Chez Mantu, je m’occupe d’une appli Django utilisée par 10 000 personnes. Le soir, je bricole un cluster Kubernetes dans mon salon. Entre les deux, je grimpe.',
    cta: 'Voir mon travail',
  },
  work: {
    eyebrow: 'TRAVAIL',
    title: 'Ce sur quoi\nj’ai bossé.',
    intro:
      'Deux boîtes, deux projets perso. À chaque fois la même approche : comprendre le métier avant de coder, puis rester sur ce qui tourne.',
    items: [
      {
        kind: 'CDI · SECTEUR NAVAL',
        title: 'Mantu',
        org: 'Développeur full-stack Python',
        period: 'depuis mai 2025',
        summary:
          'Une appli Django qui gère les permis de travail de plus de 10 000 personnes. J’ai modélisé le domaine, branché le SSO Keycloak et le stockage MinIO, puis suivi la mise en prod et le run.',
        bullets: [
          'J’ai mené la V2 du cadrage avec les PM/PO jusqu’à la livraison. En refondant les templates, ajouter un type de permis prend trois jours au lieu de deux semaines.',
          'J’ai refait l’environnement de dev et la CI/CD : uv à la place de pip, conteneurs avec volumes montés, NGINX devant l’appli, tests bloquants. Les déploiements ont gagné 40 %.',
          'J’accompagne deux développeurs juniors : revues, pair programming, un point par semaine, et les règles implicites du projet enfin écrites quelque part.',
        ],
        stack: ['Django', 'PostgreSQL', 'Keycloak', 'MinIO', 'Docker', 'Azure DevOps'],
      },
      {
        kind: 'PROJET PERSO',
        title: 'Suivi de candidatures',
        summary:
          'Une extension Chrome capture l’offre en un clic, un kanban suit les statuts. Un worker Celery lit ma boîte mail, reconnaît les réponses et déplace les cartes à ma place.',
        bullets: [
          'Front en TypeScript : drag & drop, tableau de bord, calendrier d’entretiens synchronisé avec Google Calendar.',
          'À chaque push, GitHub lance lint et pytest, construit les images et déploie sur mon cluster k3s.',
        ],
        stack: ['FastAPI', 'Next.js', 'Celery', 'Redis', 'PostgreSQL', 'k3s'],
        href: 'https://github.com/zafopyss',
      },
      {
        kind: 'HOMELAB',
        title: 'Un cluster Kubernetes dans le salon',
        summary:
          'Trois machines, k3s, Traefik en entrée, Tailscale pour y accéder de dehors, les logs dans Grafana et des sauvegardes la nuit. C’est là que tournent mes projets.',
        bullets: [],
        stack: ['k3s', 'Traefik', 'Loki', 'Grafana', 'Tailscale'],
      },
      {
        kind: 'STAGE · ASSOCIATION',
        title: 'GEM Store',
        org: 'Junior software engineer',
        period: 'oct. 2023 – mars 2024',
        summary:
          'Un outil de planification en Python pour une association de 50 personnes. J’ai recueilli les règles auprès de ceux qui planifiaient à la main, puis mis l’outil en service. Ils y passent 60 % de temps en moins.',
        bullets: [],
        stack: ['Python', 'PostgreSQL'],
      },
    ],
  },
  now: {
    eyebrow: 'EN CE MOMENT',
    title: 'Ce que\nj’explore.',
    entries: [
      { label: 'J’apprends', text: 'Kubernetes pour de vrai, en cassant et réparant mon propre cluster.' },
      { label: 'J’explore', text: 'Coder avec des agents IA sans lâcher l’architecture.' },
      { label: 'Formation', text: 'IMT Atlantique et Grenoble École de Management, double diplôme ingénieur et manager.' },
      { label: 'Hors écran', text: 'Bloc et voie. Course à pied quand il fait trop chaud pour grimper.' },
    ],
  },
  footer: {
    prompt: 'Un projet, une question, ou juste envie de discuter ?',
    cta: 'Écrivez-moi.',
    resume: 'CV',
    source: 'Code source',
    backToTop: 'Haut de page',
    views: (count) => `${count} visites`,
  },
};
