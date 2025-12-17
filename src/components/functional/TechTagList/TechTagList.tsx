import { techs } from '@data/techs';
import { useMemo } from 'react';

type TechTagListProps = {
  tags?: string[];
  className?: string;
  tagClassName?: string;
};

const normalizeTechName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, '');

export default function TechTagList({
  tags = [],
  className = 'flex flex-wrap gap-2',
  tagClassName,
}: TechTagListProps) {
  const techIconRepository = useMemo(() => {
    const repository = new Map<string, string>();
    techs.forEach((tech) => repository.set(normalizeTechName(tech.name), tech.icon));
    return repository;
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

  const tagBaseClasses =
    'flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80';
  const tagClasses = tagClassName ? `${tagBaseClasses} ${tagClassName}` : tagBaseClasses;

  return (
    <div className={className}>
      {tags.map((tech) => {
        const icon = findTechIcon(tech);

        return (
          <span key={tech} className={tagClasses}>
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
  );
}
