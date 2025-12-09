import GradientText from '@components/design/GradientText';
import TechCard from '@components/design/TechCard/TechCard';
import { techs } from '@data/techs';
import { useEffect, useRef, useState } from 'react';

type Tech = (typeof techs)[number];

type Experience = {
  company: string;
  role: string;
  date: string;
  location: string;
  description: string;
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
    company: 'Studio Nova',
    role: 'Lead Front-end Engineer',
    date: '2025 — Présent',
    location: 'Strasbourg, France',
    description:
      "Pilotage de refontes React+TS pour des interfaces B2B critiques, mise en place de design systems et automatisation des livraisons front via CI.",
    techStack: [techMap.React, techMap.TypeScript, techMap.Django],
  },
  {
    company: 'Freelance',
    role: 'Lead Front-end Designer',
    date: '2020 — 2023',
    location: 'Remote — Europe',
    description:
      "Accompagnement de PME et startups sur la création d’expériences web premium : prototypes, animations scrollytelling et intégration React.",
    techStack: [techMap.Tailwind, techMap.React, techMap['JavaScript']],
  },
  {
    company: 'Studio Nova',
    role: 'Lead Front-end Engineer',
    date: '2025 — Présent',
    location: 'Strasbourg, France',
    description:
      "Pilotage de refontes React+TS pour des interfaces B2B critiques, mise en place de design systems et automatisation des livraisons front via CI.",
    techStack: [techMap.React, techMap.PostgreSQL, techMap.AWS],
  },
  {
    company: 'Freelance',
    role: 'Lead Front-end Designer',
    date: '2020 — 2023',
    location: 'Remote — Europe',
    description:
      "Accompagnement de PME et startups sur la création d’expériences web premium : prototypes, animations scrollytelling et intégration React.",
    techStack: [techMap.Tailwind, techMap.Django, techMap.Python],
  },
];

const LINE_MARGIN_TOP = -20;
const LINE_EXTENSION = 140;
const LINE_LEFT_PX = 32;
const DOT_SIZE = 32;
const TEXT_OFFSET = LINE_LEFT_PX + DOT_SIZE + 12;

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [lineHeight, setLineHeight] = useState(LINE_EXTENSION);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const articlesColumnRef = useRef<HTMLDivElement | null>(null);
  const [activeExperienceIndex, setActiveExperienceIndex] = useState(0);
  const [entryMetrics, setEntryMetrics] = useState<{ offset: number; height: number }[]>([]);
  const estimatedSpacing = 150;
  const roleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [rolePositions, setRolePositions] = useState<number[]>([]);
  const timelineContainerHeight = entryMetrics.reduce((total, metric) => {
    return total + metric.height;
  }, DOT_SIZE + 40);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (!sectionRef.current || !articlesColumnRef.current) return;
      const viewportHeight = window.innerHeight;
      const columnRect = articlesColumnRef.current.getBoundingClientRect();
      const columnHeight = columnRect.height;
      const columnTop = columnRect.top;

      let currentIndex = 0;
      articleRefs.current.forEach((article, index) => {
        if (!article) return;
        const rect = article.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.6) {
          currentIndex = index;
        }
      });

      const clampedProgress = Math.min(1, Math.max(0, (viewportHeight - columnTop) / (viewportHeight + columnHeight)));
      const extension = columnHeight * clampedProgress;
      const computedMaxLineHeight = LINE_EXTENSION + columnHeight + DOT_SIZE;
      const targetHeight = LINE_EXTENSION + extension + DOT_SIZE;

      setActiveExperienceIndex(currentIndex);
      setLineHeight(Math.min(computedMaxLineHeight, Math.max(LINE_EXTENSION, targetHeight)));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

useEffect(() => {
  const updateOffsets = () => {
    if (!articlesColumnRef.current) return;
    const columnTop = articlesColumnRef.current.getBoundingClientRect().top;
    const metrics = articleRefs.current.map((article) => {
      if (!article) return { offset: 0, height: estimatedSpacing };
      const rect = article.getBoundingClientRect();
      return {
        offset: rect.top - columnTop,
        height: rect.height,
      };
    });
    setEntryMetrics(metrics);
  };

  const frame = requestAnimationFrame(() => {
    updateOffsets();
    requestAnimationFrame(updateOffsets);
  });

  window.addEventListener('resize', updateOffsets);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', updateOffsets);
  };
}, []);
useEffect(() => {
  const updateRolePositions = () => {
    const positions = roleRefs.current.map((ref) =>
      ref ? ref.getBoundingClientRect().top : 0
    );
    const columnTop = articlesColumnRef.current?.getBoundingClientRect().top || 0;
    setRolePositions(positions.map(pos => pos - columnTop));
  };

  const frame = requestAnimationFrame(() => {
    updateRolePositions();
    requestAnimationFrame(updateRolePositions);
  });

  window.addEventListener('resize', updateRolePositions);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', updateRolePositions);
  };
}, []);


  return (
    <section id="experiences" ref={sectionRef} className="scroll-mt-28" aria-label="Expériences professionnelles">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
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
          <div className="relative">
            <div className="relative">
              <div
                className="absolute w-[2px] rounded-full bg-gradient-to-b from-blue-400 via-blue-500/60 to-transparent"
                style={{
                  height: `${lineHeight}px`,
                  left: `30px`,
                  top: `${LINE_MARGIN_TOP}px`,
                  transition: 'height 0.25s ease-out',
                }}
              />
              <div
                className="relative"
                style={{ minHeight: `${timelineContainerHeight}px` }}
                aria-hidden="true"
              >
                {experiences.map((experience, index) => {
                  const isActive = index === activeExperienceIndex;
                  const isPrimary = index === 0;
                  const dotTop = rolePositions[index]
                    ? rolePositions[index] - DOT_SIZE / 2
                    : index * estimatedSpacing;

                  return (
                    <div
                      key={`${experience.company}-${index}`}
                      className="absolute left-0 w-full"
                      style={{ top: `${dotTop}px` }}
                    >
                      <div
                        className="absolute flex items-center justify-center"
                        style={{ left: `15px`, top: '50%' }}
                      >
                        <span className="relative h-8 w-8 rounded-full bg-white">
                          <span
                            className={`absolute inset-0 m-auto h-4 w-4 rounded-full transition-all duration-700 ${
                              isPrimary
                                ? 'bg-green-active'
                                : isActive
                                ? 'bg-blue-400'
                                : 'bg-black/20'
                            }`}
                          />
                        </span>
                      </div>
                      <div
                        className="flex flex-col text-sm whitespace-nowrap uppercase"
                        style={{ marginLeft: `${TEXT_OFFSET}px` }}
                      >
                        <span className={isActive ? 'text-white' : 'text-white/70'}>{experience.date}</span>
                        <span
                          className="text-[0.55rem] tracking-[0.20em] text-white/40"
                        >
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
                className="rounded-3xl border border-white/10 bg-black/30 p-6"
              >
                <div className="flex flex-col text-white/70">
                <span
                  ref={(node) => (roleRefs.current[index] = node)}
                  className="text-sm uppercase tracking-[0.4em] text-blue-400"
                >
                  {experience.role}
                </span>
                  <h3 className="text-2xl font-semibold text-white">{experience.company}</h3>
                </div>
                <p className="mt-3 text-white/80" style={{ height: "200px" }} aria-label={`Description pour ${experience.company}`}>
                  {experience.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  {experience.techStack.map((tech) => (
                    <TechCard
                      key={`${experience.company}-${tech.name}`}
                      name={tech.name}
                      icon={tech.icon}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
