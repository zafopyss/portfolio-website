import CursorSpotlight from '@components/design/CursorSpotlight';
import GradientText from '@components/design/GradientText/GradientText';
import { projects } from '@data/projects';
import { techs } from '@data/techs';
import { useMemo, useState } from 'react';

const normalizeTechName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, '');

export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = useMemo(
    () => projects[Math.min(Math.max(activeIndex, 0), projects.length - 1)],
    [activeIndex]
  );
  const activeHasImage = Boolean(activeProject?.image);
  const techTags = useMemo(
    () => Array.from(new Set(activeProject?.techs ?? [])),
    [activeProject?.techs]
  );
  const techIconRepository = useMemo(() => {
    const map = new Map<string, string>();
    techs.forEach((tech) => map.set(normalizeTechName(tech.name), tech.icon));
    return map;
  }, []);
  const findTechIcon = (label: string) => {
    const normalized = normalizeTechName(label);
    if (techIconRepository.has(normalized)) {
      return techIconRepository.get(normalized);
    }
    for (const [key, icon] of techIconRepository.entries()) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return icon;
      }
    }
    return undefined;
  };
  return (
    <section
      id="projects"
      className="scroll-mt-24 px-6 py-12 lg:px-20"
      aria-label="Projets"
    >
      <div className="text-center">
        <GradientText
          as="h2"
          text="Mes Projets"
          gradientStart="var(--color-silver)"
          gradientEnd="var(--color-blue-python)"
          sizeClass="text-4xl sm:text-5xl font-bold"
          className="pb-6"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr] items-stretch">
        <div className="flex flex-col gap-4">
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            const hasImage = Boolean(project.image);

            return (
              <CursorSpotlight key={project.title} borderRadius="rounded-2xl">
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={
                    'group rounded-2xl border bg-white/5 p-3 text-left transition ' +
                    (isActive
                      ? 'border-blue-python/60 bg-white/10 border-1'
                      : 'border-white/10 hover:border-python/60 hover:bg-white/10 scale-98')
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      {hasImage && (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-base font-semibold text-white">
                        {project.title}
                      </div>
                      <div className="mt-1 line-clamp-2 text-sm text-white/60">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </button>
              </CursorSpotlight>
            );
          })}
        </div>
        
        <article
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
          aria-live="polite"
        >
          <div className="flex flex-col gap-6 h-full">
            <div className={'flex gap-6 ' + (activeHasImage ? 'md:flex-row' : 'flex-col h-full')}>
              {activeHasImage && (
                <div className="md:w-[320px]">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <img
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{activeProject.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-white/70">
                    {activeProject.description}
                  </p>

                  <ul className="mt-5 px-1 space-y-2">
                    {activeProject.highlights.map((item) => (
                      <li
                        key={item}
                        className="text-base font-normal text-white/80 leading-relaxed"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 flex flex-col gap-4 rounded-2xl">
              <div className="flex flex-wrap gap-2">
                {techTags.map((tech) => {
                  const icon = findTechIcon(tech);

                  return (
                    <span
                      key={tech}
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
                    >
                      {icon && (
                        <img
                          src={icon}
                          alt={`${tech} logo`}
                          className="h-4 w-4 object-contain"
                          loading="lazy"
                        />
                      )}
                      {tech}
                    </span>
                  );
                })}
              </div>

              {(activeProject.github || activeProject.live) && (
                <div className="border-t border-white/10 pt-3 text-xs uppercase tracking-[0.3em] text-blue-python flex flex-wrap items-center gap-3">
                  {activeProject.github && (
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative inline-block text-md font-medium focus-visible:outline-none transition text-white/70 hover:text-blue-python"
                    >
                      GitHub
                      <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-python transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                    </a>
                  )}
                  {activeProject.live && (
                    <a
                      href={activeProject.live}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative inline-block text-md font-medium focus-visible:outline-none transition text-white/70 hover:text-blue-python"
                    >
                      Lien
                      <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-blue-python transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </article>
      </div>
    </section>
  );
}
