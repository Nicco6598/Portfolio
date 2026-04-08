import { memo } from 'react';
import { projectCountLabel, type Project } from '../../data/projects';

interface HeroProjectSummaryProps {
  project: Project;
}

function HeroProjectSummaryComponent({ project }: HeroProjectSummaryProps) {
  return (
    <div
      className="flex flex-col gap-5 rounded-[28px] border p-5"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div className="flex flex-wrap items-center gap-4">
        <span
          className="font-mono text-[13px] uppercase tracking-widest"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {project.index} / {projectCountLabel}
        </span>
        <span
          className="font-serif-display text-[26px] leading-none"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {project.name}
        </span>
      </div>

      <p
        className="text-sm leading-6"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {project.tagline}
      </p>

      <div className="flex flex-wrap gap-2">
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
