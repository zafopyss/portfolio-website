export type ProjectCard = {
  title: string;
  description: string;
  highlights: string[];
  techs: string[];
  image?: string;
  github?: string;
  live?: string;
};

import mountainImage from '../assets/851-jma-montagne.jpeg';

export const projects: ProjectCard[] = [
  {
    title: 'Portfolio',
    description:
      "Dashboard interne pour piloter l'activité produit : KPIs, vues consolidées et widgets modulaires.",
    highlights: [
      'Design system modulaire avec composants réutilisables pour tous les types de widgets.',
      'Architecture front-end React/TS ultra-performante avec Vite et Tailwind CSS.',
      'Interface responsive adaptée à tous les écrans.',
    ],
    techs: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    image: mountainImage,
    github: 'https://github.com/zafopyss/studio-nova-dashboard',
    live: 'https://studio-nova-dashboard.example.com',
  },
  {
    title: 'Portfolio / Experiments',
    description:
      'Vitrine personnelle orientée UX : scroll fluide, sections animées et mise en avant des projets.',
    highlights: [
      'Prototype scrolling animé (Lenis + GSAP) pour raconter les projets récents.',
      'Cartes interactives avec focus sur les résultats business livrés.',
      'Réutilisation de composants Tailwind pour accélérer les itérations.',
    ],
    techs: ['React', 'TypeScript', 'Vite', 'Tailwind CSS','React', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/zafopyss/portfolio',
    live: '',
  },
];
