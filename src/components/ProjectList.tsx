import { memo } from 'react';
import { projectCountLabel, projects } from '../data/projects';
import type { Project } from '../data/projects';
import { useCanHover } from '../hooks/useCanHover';
import ProjectVisual from './projects/ProjectVisual';

interface ProjectListProps {
  onProjectSelect: (project: Project) => void;
}

interface ProjectCardProps {
  canHover: boolean;
  project: Project;
  onProjectSelect: (project: Project) => void;
}

function ProjectCard({ canHover, project, onProjectSelect }: ProjectCardProps) {
  return (
    <button
      type="button"
      aria-label={`Open project ${project.name}`}
      onClick={() => onProjectSelect(project)}
      className={`group flex h-full flex-col rounded-[28px] border p-4 text-left transition-all duration-300 ${canHover ? 'hover:-translate-y-1.5 hover:border-[var(--color-accent)]' : ''}`.trim()}
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        boxShadow: canHover ? '0 14px 34px rgba(10,10,10,0.04)' : 'none',
      }}
    >
      <div className="flex h-full flex-col">
        <div
          className="mb-4 w-full overflow-hidden rounded-[18px]"
          style={{ boxShadow: canHover ? '0 12px 28px rgba(10,10,10,0.06)' : 'none' }}
        >
          <ProjectVisual
            project={project}
            variant="card"
            className={`h-44 w-full transition-transform duration-300 ${canHover ? 'group-hover:scale-[1.035]' : ''}`.trim()}
            imageClassName="w-full h-full object-cover"
          />
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {project.index} / {projectCountLabel}
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: 'var(--color-accent)' }}
          >
            {project.role}
          </span>
        </div>

        <div className="mb-4 border-b pb-4" style={{ borderColor: 'color-mix(in srgb, var(--color-border) 92%, transparent)' }}>
          <h3
            className={`font-serif-display text-[26px] leading-[0.98] transition-colors duration-200 ${canHover ? 'group-hover:text-[var(--color-accent)]' : ''}`.trim()}
            style={{ color: 'var(--color-text-primary)' }}
          >
            {project.name}
          </h3>
          <p
            className="mt-2 text-sm leading-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {project.tagline}
          </p>
        </div>

        <div className="mb-5 flex-1">
          <span
            className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Outcome
          </span>
          <p
            className="text-sm leading-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {project.impact}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t pt-4" style={{ borderColor: 'color-mix(in srgb, var(--color-border) 92%, transparent)' }}>
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]"
                style={{
                  borderColor: 'color-mix(in srgb, var(--color-border) 94%, transparent)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <span
            className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200 ${canHover ? 'group-hover:text-[var(--color-accent)]' : ''}`.trim()}
            style={{ color: 'var(--color-accent)' }}
          >
            Open
          </span>
        </div>
      </div>
    </button>
  );
}

function ProjectListComponent({ onProjectSelect }: ProjectListProps) {
  const canHover = useCanHover();

  return (
    <section className="py-24 px-6 md:px-12" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <span
          className="font-mono text-[11px] uppercase tracking-widest block mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          Projects
        </span>
        <h2
          className="font-serif-display text-[clamp(32px,5vw,56px)] mb-12"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Selected Works
        </h2>
        <p
          className="mb-12 max-w-2xl text-base leading-7 md:text-[17px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          A focused selection of product, frontend, and full-stack work shaped around clarity, performance, and implementation quality.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              canHover={canHover}
              project={project}
              onProjectSelect={onProjectSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const ProjectList = memo(ProjectListComponent);
export default ProjectList;
