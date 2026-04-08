import { memo } from 'react';
import { projectCountLabel, type Project } from '../../data/projects';

interface HeroProjectSummaryProps {
  project: Project;
}

function HeroProjectSummaryComponent({ project }: HeroProjectSummaryProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-6">
        <span
          className="font-mono text-[13px] uppercase tracking-widest"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {project.index} / {projectCountLabel}
        </span>
        <span
          className="font-serif-display text-[24px] md:text-[32px]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {project.name}
        </span>
      </div>
      <div className="flex gap-2">
        {project.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border"
            style={{
              borderColor: 'var(--color-text-secondary)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

const HeroProjectSummary = memo(HeroProjectSummaryComponent);

export default HeroProjectSummary;
