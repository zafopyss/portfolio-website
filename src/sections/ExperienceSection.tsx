import GradientText from '@components/design/GradientText';
import TechCard from '@components/design/TechCard/TechCard';
import TechTagList from '@components/functional/TechTagList';
import { techs } from '@data/techs';
import { useEffect, useRef, useState } from 'react';

type Tech = (typeof techs)[number];

type Experience = {
  company: string;
  role: string;
  date: string;
  location: string;
  description: Array<string> | string;
  highlights?: string[];
  image?: string;
  techStack: Tech[];
};

const techMap = techs.reduce<Record<string, Tech>>((acc, tech) => {
  acc[tech.name] = tech;
  return acc;
}, {} as Record<string, Tech>);

const experiences: Experience[] = [
  {
    company: 'Mantu',
    role: 'Développeur Full-stack python',
    date: '2025 — Présent',
    location: 'Strasbourg, France',
    description: [
      "Développement d’une application Django modulaire en clean architecture, avec utilisation de DTO, Pydantic et serializers pour assurer robustesse et maintenabilité.",
      "Contribution active aux décisions d’architecture et évolution progressive des responsabilités au sein de l’équipe.",
      "Travail en méthodologie agile (sprints de 2 semaines) et intégration front-end avec HTML, CSS, Tailwind et JavaScript."
    ],
    techStack: [techMap.Python, techMap.Django, techMap.Tailwind, techMap.PostgreSQL, techMap.Docker, techMap.MinIO],
  },
  {
    company: 'GEM STORE',
    role: 'Apprenti développeur logiciel python',
    date: '2023 — 2024',
    location: 'Grenoble, France',
    description: [
      "Refonte du système de gestion des emplois du temps via une application web Python, améliorant la planification et la lisibilité des tâches.",
      "Déploiement sécurisé de l'application sur un serveur interne, garantissant fiabilité et accessibilité pour l’équipe."
    ],
    techStack: [techMap.Python, techMap.PostgreSQL],
  },
];

const LINE_MARGIN_TOP = -20;
const LINE_LEFT_PX = 32;
const DOT_SIZE = 32;
const TEXT_OFFSET = LINE_LEFT_PX + DOT_SIZE + 12;
const DATE_OFFSET = 8; // ajustement vertical pour descendre légèrement les dates

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const roleRefs = useRef<(HTMLElement | null)[]>([]);
  const articlesColumnRef = useRef<HTMLDivElement | null>(null);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0);
  const [entryMetrics, setEntryMetrics] = useState<{ offset: number; height: number }[]>([]);
  const [roleMetrics, setRoleMetrics] = useState<{ offset: number; height: number }[]>([]);
  const estimatedSpacing = 150;

  const timelineContainerHeight = entryMetrics.length
    ? Math.max(...entryMetrics.map((metric) => metric.offset + metric.height)) + 40
    : experiences.length * estimatedSpacing;

  useEffect(() => {
    const measureEntries = () => {
      if (!articlesColumnRef.current) return;
      const columnTop = articlesColumnRef.current.getBoundingClientRect().top + window.scrollY;
      const metrics = articleRefs.current.map((article, i) => {
        if (!article) return { offset: 0, height: estimatedSpacing };
        const rect = article.getBoundingClientRect();
        const articleTop = rect.top + window.scrollY;
        return {
          offset: articleTop - columnTop,
          height: rect.height,
        };
      });
      const roles = roleRefs.current.map((roleEl, i) => {
        if (!roleEl || !articleRefs.current[i]) return { offset: 0, height: 0 };
        const roleRect = roleEl.getBoundingClientRect();
        const articleRect = articleRefs.current[i]!.getBoundingClientRect();
        const roleTop = roleRect.top + window.scrollY;
        const articleTop = articleRect.top + window.scrollY;
        return {
          offset: roleTop - articleTop,
          height: roleRect.height,
        };
      });
      setEntryMetrics(metrics);
      setRoleMetrics(roles);
    };

    const frame = requestAnimationFrame(() => {
      measureEntries();
      requestAnimationFrame(measureEntries);
    });

    window.addEventListener('resize', measureEntries);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measureEntries);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!sectionRef.current || !articlesColumnRef.current || !lineRef.current) return;

      const columnTop = articlesColumnRef.current.getBoundingClientRect().top + window.scrollY;
      const viewportCenter = window.scrollY + window.innerHeight * 0.5;
      const timelinePoint = viewportCenter + 60;
      const timelineHeight = Math.max(0, timelinePoint - columnTop - LINE_MARGIN_TOP);
      const maxTimelineHeight = timelineContainerHeight;
      const fillPercentage = Math.min(100, (timelineHeight / maxTimelineHeight) * 100);
      
      lineRef.current.style.background = `linear-gradient(to bottom, #3B82F6 ${fillPercentage}%, rgba(55, 65, 81, 0.3) ${fillPercentage}%)`;
      
      const nextActiveIndex = experiences.findIndex((_, index) => {
        const start = columnTop + (entryMetrics[index]?.offset ?? index * estimatedSpacing);
        const height = entryMetrics[index]?.height ?? estimatedSpacing;
        return viewportCenter >= start && viewportCenter <= start + height;
      });
      
      if (nextActiveIndex !== -1) {
        setActiveExperienceIndex(nextActiveIndex);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [entryMetrics]);


  return (
    <section id="experiences" ref={sectionRef} className="scroll -mt-24 px-3 sm:py-12 lg:px-15 lg:py-10" aria-label="Expériences professionnelles">
      <div className="max-w-6xl mx-auto sm:px-4 sm:px-6">
        <div className="text-center">
          <GradientText
            as="h2"
            text="Mes Expériences"
            gradientStart="var(--color-silver)"
            gradientEnd="var(--color-blue-python)"
            sizeClass="text-4xl sm:text-5xl font-bold"
            className="mt-2 pb-3"
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)] items-start">
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* timeline */}
              <div
                ref={lineRef}
                className="absolute w-[2px] rounded-full transition-all duration-300"
                style={{
                  height: `${timelineContainerHeight}px`,
                  left: `30px`,
                  top: `${LINE_MARGIN_TOP}px`,
                  background: 'linear-gradient(to bottom, #3B82F6 0%, rgba(55, 65, 81, 0.3) 0%)',
                }}
              />
              <div
                className="relative"
                style={{ minHeight: `${timelineContainerHeight}px` }}
                aria-hidden="true"
              >
                {/* date and location */}
                {experiences.map((experience, index) => {
                  const startOffset = entryMetrics[index]?.offset ?? index * estimatedSpacing;
                  const roleMetric = roleMetrics[index] ?? { offset: 0, height: 0 };
                  const isActive = index === activeExperienceIndex;
                  const topPosition = startOffset + roleMetric.offset + roleMetric.height / 2 - DOT_SIZE / 2 + DATE_OFFSET;
                  return (
                    <div
                      key={`${experience.company}-${index}`}
                      className="absolute left-0 w-full"
                      style={{ top: `${topPosition}px`}}
                    >
                      <div
                        className="flex flex-col text-sm whitespace-nowrap uppercase"
                        style={{ marginLeft: `${TEXT_OFFSET}px` }}
                      >
                        <span className={isActive ? 'text-white font-semibold' : 'text-white/70'}>
                          {experience.date}
                        </span>
                        <span className="text-[0.55rem] tracking-[0.20em] text-white/40">
                          {experience.location}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-5" ref={articlesColumnRef}>
            {experiences.map((experience, index) => (
              <article
                key={`${experience.company}-${index}`}
                ref={(node) => (articleRefs.current[index] = node)}
                className={`rounded-3xl border transition-all duration-300 p-3 sm:p-6 relative ${
                  index === activeExperienceIndex
                    ? 'border-blue-python/50 bg-black/40 shadow-lg shadow-blue-python/10'
                    : 'border-white/10 bg-black/30'
                }`}
              >
                {/* Sticky dot container */}
                {/* TODO: enlever -205 en dur et faire un calcul taille écran */}
                <div 
                  className="absolute left-0 top-5 bottom-5 hidden lg:block"
                  style={{ 
                    marginLeft: `calc(-205px + ${LINE_LEFT_PX - DOT_SIZE}px)`,
                  }}
                >
                  <div 
                    className="sticky hidden lg:flex items-center justify-center"
                    style={{ 
                      top: '50vh',
                      height: `${DOT_SIZE}px`,
                    }}
                  >
                    <span className="relative h-8 w-8 rounded-full bg-white shadow-lg">
                      <span 
                        className={`absolute inset-0 m-auto h-4 w-4 rounded-full transition-colors duration-300 ${
                          index === 0
                            ? 'bg-green-active'
                            : index === activeExperienceIndex
                            ? 'bg-blue-python'
                            : index < activeExperienceIndex
                            ? 'bg-blue-python'
                            : 'bg-gray-600'
                        }`} 
                      />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col text-white/70">
                  <span
                    ref={(el) => (roleRefs.current[index] = el)}
                    className="text-xl uppercase tracking-[0.35em] text-white flex items-center justify-center lg:justify-start text-center pb-2 border-b border-white/10 lg:border-0"
                  >
                    {experience.role}
                  </span>
                  <h3 className="text-xl font-semibold text-blue-python mt-2">{experience.company}</h3>
                </div>
                <div className="mt-2 flex flex-col gap-1 text-xs uppercase tracking-[0.35em] text-white/70 lg:hidden">
                  <span className="text-white/80 text-sm font-semibold tracking-[0.4em]">{experience.date}</span>
                  <span className="text-white/60 tracking-[0.2em] text-[0.65rem]">{experience.location}</span>
                </div>
                {/* TODO : add bold part of text */}
                <div className="mt-3 text-white/80 space-y-1" aria-label={`Description pour ${experience.company}`}>
                  {Array.isArray(experience.description) ? (
                  experience.description.map((sentence) => (
                    <p key={sentence}>{sentence}</p>
                  ))
                  ) : (
                    <p>{experience.description}</p>
                  )}
                </div>

                <div className="mt-6 rounded-2xl" aria-label={`Technologies utilisées chez ${experience.company}`}>
                  <div className="hidden lg:flex gap-4 w-full">
                    {experience.techStack.map((tech) => (
                      <TechCard
                        key={`${experience.company}-${tech.name}`}
                        name={tech.name}
                        icon={tech.icon}
                      />
                    ))}
                  </div>
                  </div>
                  <div className='flex gap-4 rounded-2xl lg:hidden'>
                  <TechTagList
                    className="flex flex-wrap gap-2 "
                    tags={experience.techStack.map((tech) => tech.name)}
                  />
                  </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
