import { memo } from 'react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';

interface HeroProjectListProps {
  canHover: boolean;
  displayProject: Project;
  onProjectFocus: (project: Project) => void;
  onProjectSelect: (project: Project) => void;
  onProjectHover: (project: Project, clientX: number, clientY: number) => void;
  onProjectLeave: () => void;
}

function HeroProjectListComponent({
  canHover,
  displayProject,
  onProjectFocus,
  onProjectSelect,
  onProjectHover,
  onProjectLeave,
}: HeroProjectListProps) {
  return (
    <div className="flex flex-col">
      {projects.map((project) => {
        const isActive = displayProject.id === project.id;

        return (
          <button
            key={project.id}
            type="button"
            aria-pressed={isActive}
            aria-label={`Open project ${project.name}`}
            onClick={() => onProjectSelect(project)}
            onFocus={() => onProjectFocus(project)}
            onMouseEnter={canHover ? (event) => onProjectHover(project, event.clientX, event.clientY) : undefined}
            onMouseLeave={canHover ? onProjectLeave : undefined}
            className={`group w-full border-b py-4 text-left transition-all duration-200 ${canHover ? 'hover:translate-x-1.5' : ''}`.trim()}
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            <span
              className="mr-4 font-mono text-[11px] uppercase tracking-widest"
              style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
            >
              {project.index}
            </span>
            <span
              className="font-serif-display text-[20px] transition-colors duration-200"
              style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
            >
              {project.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const HeroProjectList = memo(HeroProjectListComponent);

export default HeroProjectList;
