import CursorSpotlight from '@components/design/CursorSpotlight';
import GradientText from '@components/design/GradientText/GradientText';
import TechTagList from '@components/functional/TechTagList';
import { projects } from '@data/projects';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [isCompactView, setIsCompactView] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);
  const mobileListRef = useRef<HTMLDivElement | null>(null);
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 1023px)');
    const handle = () => setIsCompactView(media.matches);
    handle();
    media.addEventListener('change', handle);
    return () => media.removeEventListener('change', handle);
  }, []);

  useEffect(() => {
    if (!isCompactView || typeof window === 'undefined' || !articleRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      const node = articleRef.current;
      if (!node) return;
      const { top } = node.getBoundingClientRect();
      const targetTop = window.scrollY + top;
      const scrollOffset = 20;
      window.scrollTo({ top: Math.max(targetTop - scrollOffset, 0), behavior: 'smooth' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, isCompactView]);

  useEffect(() => {
    if (!isCompactView || !mobileListRef.current) return;
    const container = mobileListRef.current;
    let frame: number;

    const updateVisibleIndex = () => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      let bestIndex = -1;
      let minDist = Infinity;
      Array.from(container.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        const dataIndex = child.dataset.projectIndex;
        if (!dataIndex) return;
        const childRect = child.getBoundingClientRect();
        const childCenter = childRect.left + childRect.width / 2;
        const dist = Math.abs(childCenter - centerX);
        if (dist < minDist) {
          minDist = dist;
          bestIndex = Number(dataIndex);
        }
      });
      if (bestIndex !== -1) {
        setVisibleIndex(bestIndex);
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateVisibleIndex);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isCompactView]);
  return (
    <section
      id="projects"
      className="scroll -mt-24 px-3 sm:py-12 lg:px-15 lg:py-10"
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

      <div className="lg:hidden mb-4">
        <div
          ref={mobileListRef}
          className="flex gap-2 overflow-x-auto px-4 py-3 scroll-smooth"
        >
          <span aria-hidden className="w-[10px] flex-shrink-0" />
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            const hasImage = Boolean(project.image);
            const isVisibleItem = visibleIndex === index && !isActive;
            return (
              <button
                data-project-index={index}
                key={`mobile-${project.title}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                className={`shrink-0 w-36 rounded-2xl border p-3 text-center transform transition duration-300 ${
                  isActive
                    ? 'border-blue-python/60 bg-white/10 scale-105'
                    : isVisibleItem
                    ? 'border-white/60 bg-white/15 scale-98'
                    : 'border-white/10 bg-white/5 scale-95'
                }`}
              >
                <div className="h-16 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {hasImage && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-white">{project.title}</p>
              </button>
            );
          })}
          <span aria-hidden className="w-[10px] flex-shrink-0" />
        </div>
      </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr] items-stretch">
        <div className="hidden lg:flex flex-col gap-1 sm:gap-4">
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
                      : 'border-white/10 hover:border-python/60 hover:bg-white/10 scale-95 sm:scale-98')
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
        
        <article ref={articleRef} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-6 h-full">
            <div className="hidden lg:flex flex-col gap-6 h-full">
              <div className={'flex gap-6 ' + (activeHasImage ? 'md:flex-row' : 'flex-col h-full')}>
                {activeHasImage && (
                  <div className="md:w-[320px]">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <img
                        src={activeProject.image}
                        alt={activeProject.title}
                        className="h-full w-full object-cover"
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
            </div>
              {/* on mobile */}
            <div className="lg:hidden space-y-4 text-center">
              <h3 className="text-3xl font-semibold text-white">{activeProject.title}</h3>
              {activeHasImage && (
                <div className="mx-auto w-full max-w-[360px]">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <img
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
              <p className="text-start text-white">
              {activeProject.description}
              </p>
              <ul className="mt-2 text-start space-y-2 text-base font-normal text-white/80 leading-relaxed">
                {activeProject.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="sm:p-4 flex flex-col gap-4 sm:rounded-2xl">
              <TechTagList tags={techTags} />

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
