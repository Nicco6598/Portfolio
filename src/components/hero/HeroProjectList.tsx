import { memo } from 'react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';

interface HeroProjectListProps {
  displayProject: Project;
  onProjectSelect: (project: Project) => void;
  onProjectHover: (project: Project, clientX: number, clientY: number) => void;
  onProjectLeave: () => void;
}

function HeroProjectListComponent({
  displayProject,
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
          className="group w-full border-b py-4 text-left transition-all duration-200 hover:translate-x-1.5"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        >
          <span
            className="mr-4 font-mono text-[11px] uppercase tracking-widest"
            style={{ color: displayProject.id === project.id ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
          >
            {project.index}
          </span>
          <span
            className="font-serif-display text-[20px] transition-colors duration-200"
            style={{ color: displayProject.id === project.id ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
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
