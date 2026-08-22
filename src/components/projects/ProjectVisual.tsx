import { memo } from 'react';
import type { Project } from '../../data/projects';

type ProjectVisualVariant = 'preview' | 'card' | 'sheet';

interface ProjectVisualProps {
  project: Project;
  variant: ProjectVisualVariant;
  className?: string;
  imageClassName?: string;
}

function ProjectVisualComponent({ project, variant, className = '', imageClassName = '' }: ProjectVisualProps) {
  if (project.imageUrl) {
    return (
      <figure className={`${className} project-image project-image--${variant}`.trim()}>
        <img
          src={project.imageUrl}
          alt={project.imageAlt ?? `Visual for ${project.name}`}
          className={imageClassName}
          width="1448"
          height="1086"
          loading={variant === 'card' ? 'lazy' : 'eager'}
          fetchPriority={variant === 'sheet' ? 'high' : 'auto'}
          decoding="async"
        />
      </figure>
    );
  }

  return (
    <div className={`${className} project-image project-image--${variant} project-image--fallback`.trim()} role="img" aria-label={project.name}>
      <span>{project.name}</span>
    </div>
  );
}

export default memo(ProjectVisualComponent);
