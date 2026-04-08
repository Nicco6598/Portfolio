import { memo, useMemo, useState } from 'react';
import type { Project } from '../../data/projects';
import { getProjectAccent, getProjectInitials } from '../../utils/project-display';

type ProjectVisualVariant = 'preview' | 'card' | 'sheet';

interface ProjectVisualProps {
  project: Project;
  variant: ProjectVisualVariant;
  className?: string;
  imageClassName?: string;
}

const VARIANT_STYLES: Record<ProjectVisualVariant, { initials: string; title: string; meta: string; padding: string }> = {
  preview: {
    initials: 'text-[44px]',
    title: 'text-[13px]',
    meta: 'text-[9px]',
    padding: 'p-3',
  },
  card: {
    initials: 'text-[58px]',
    title: 'text-[18px]',
    meta: 'text-[10px]',
    padding: 'p-4',
  },
  sheet: {
    initials: 'text-[clamp(72px,10vw,140px)]',
    title: 'text-[clamp(18px,2.5vw,28px)]',
    meta: 'text-[11px]',
    padding: 'p-6 md:p-10',
  },
};

function ProjectVisualComponent({
  project,
  variant,
  className = '',
  imageClassName = '',
}: ProjectVisualProps) {
  const [failedImageKey, setFailedImageKey] = useState('');
  const accent = useMemo(() => getProjectAccent(project.id), [project.id]);
  const initials = useMemo(() => getProjectInitials(project.name), [project.name]);
  const variantStyle = VARIANT_STYLES[variant];
  const imageKey = `${project.id}:${project.imageUrl ?? ''}`;
  const shouldRenderImage = Boolean(project.imageUrl) && failedImageKey !== imageKey;

  if (shouldRenderImage) {
    return (
      <img
        src={project.imageUrl}
        alt={project.name}
        className={`${className} ${imageClassName}`.trim()}
        loading="lazy"
        decoding="async"
        onError={() => setFailedImageKey(imageKey)}
      />
    );
  }

  return (
    <div
      className={`${className} relative isolate overflow-hidden ${variantStyle.padding}`.trim()}
      style={{
        background: `radial-gradient(circle at top right, ${accent}33 0%, transparent 34%), linear-gradient(135deg, var(--color-surface) 0%, var(--color-sheet-bg) 100%)`,
      }}
      aria-label={`${project.name} placeholder`}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, transparent, transparent 95%, var(--color-border) 95%), linear-gradient(to bottom, transparent, transparent 95%, var(--color-border) 95%)',
          backgroundSize: variant === 'sheet' ? '120px 120px' : '72px 72px',
        }}
      />
      <div
        className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 rounded-full"
        style={{
          width: variant === 'preview' ? '84px' : variant === 'card' ? '120px' : '240px',
          height: variant === 'preview' ? '84px' : variant === 'card' ? '120px' : '240px',
          backgroundColor: `${accent}22`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between gap-4">
          <span
            className={`font-mono uppercase tracking-[0.28em] ${variantStyle.meta}`}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {project.index}
          </span>
          <span
            className={`font-mono uppercase tracking-[0.22em] ${variantStyle.meta}`}
            style={{ color: accent }}
          >
            {project.tags[0] ?? 'Project'}
          </span>
        </div>

        <div>
          <div
            className={`font-mono leading-none ${variantStyle.initials}`}
            style={{ color: accent }}
          >
            {initials}
          </div>
          <div
            className={`font-serif-display leading-[0.95] ${variantStyle.title}`}
            style={{ color: 'var(--color-text-primary)' }}
          >
            {project.name}
          </div>
        </div>
      </div>
    </div>
  );
}

const ProjectVisual = memo(ProjectVisualComponent);

export default ProjectVisual;
