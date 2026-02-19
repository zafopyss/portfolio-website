export type ProjectCard = {
  title: string;
  description?: string;
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
    "Portfolio personnel développé en React pour présenter mes projets, compétences et expériences.",
    highlights: [
      'Design system modulaire avec composants réutilisables pour tous les types de widgets.',
      'Architecture front-end React/TS ultra-performante avec Vite et Tailwind CSS.',
      'Interface responsive adaptée à tous les écrans.',
    ],
    techs: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    image: mountainImage,
    github: 'https://github.com/zafopyss/portfolio-website',
    live: 'https://eliotwalter.dev/',
  },
  // {
  // title: 'Auth Platform (Multi-language)',
  // description:
  //   "Plateforme d’authentification inspirée de Keycloak, conçue pour explorer une architecture multi-langage et les bases DevOps d’un projet distribué.",
  // highlights: [
  //   'Backend principal en FastAPI avec services complémentaires en Go ou Rust.',
  //   'Architecture orientée microservices pour comparer performances et responsabilités par langage.',
  //   'Mise en place d’une chaîne DevOps complète : Docker, CI/CD, gestion des environnements.',
  //   'Gestion de l’authentification et des autorisations (users, roles, tokens).',
  // ],
  //   techs: ['Rust', 'Go', 'FastAPI', 'Docker', 'AWS'],
  //   github: 'https://github.com/zafopyss/portfolio',
  //   live: '',
  // },
  
];
