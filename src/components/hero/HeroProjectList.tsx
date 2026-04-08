import { memo } from 'react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';

interface HeroProjectListProps {
  onProjectSelect: (project: Project) => void;
  onProjectHover: (project: Project, clientX: number, clientY: number) => void;
  onProjectLeave: () => void;
}

function HeroProjectListComponent({
  onProjectSelect,
  onProjectHover,
  onProjectLeave,
}: HeroProjectListProps) {
  return (
    <div className="flex flex-col">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => onProjectSelect(project)}
          onMouseEnter={(event) => onProjectHover(project, event.clientX, event.clientY)}
          onMouseLeave={onProjectLeave}
          className="text-left py-4 border-b transition-all duration-200 hover:translate-x-1.5 group"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          <span
            className="font-mono text-[11px] uppercase tracking-widest mr-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {project.index}
          </span>
          <span
            className="font-serif-display text-[20px] group-hover:text-[var(--color-accent)] transition-colors duration-200"
          >
            {project.name}
          </span>
        </button>
      ))}
    </div>
  );
}

const HeroProjectList = memo(HeroProjectListComponent);

export default HeroProjectList;
