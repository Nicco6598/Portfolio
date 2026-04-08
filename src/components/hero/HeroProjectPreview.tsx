import { memo, type RefObject } from 'react';
import type { Project } from '../../data/projects';
import ProjectVisual from '../projects/ProjectVisual';

interface HeroProjectPreviewProps {
  project: Project | null;
  previewRef: RefObject<HTMLDivElement | null>;
}

function HeroProjectPreviewComponent({ project, previewRef }: HeroProjectPreviewProps) {
  if (!project) {
    return null;
  }

  return (
    <div
      ref={previewRef}
      className="fixed pointer-events-none z-40 transition-opacity duration-200"
      style={{
        left: 0,
        top: 0,
        width: '200px',
        height: '140px',
        willChange: 'transform',
      }}
    >
      <div
        className="w-full h-full overflow-hidden"
        style={{
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid var(--color-border)',
        }}
      >
        <ProjectVisual
          project={project}
          variant="preview"
          className="w-full h-full"
          imageClassName="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

const HeroProjectPreview = memo(HeroProjectPreviewComponent);

export default HeroProjectPreview;
