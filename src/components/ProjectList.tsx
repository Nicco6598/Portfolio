import { memo } from 'react';
import { projectCountLabel, projects } from '../data/projects';
import type { Project } from '../data/projects';
import ProjectVisual from './projects/ProjectVisual';

interface ProjectListProps {
  onProjectSelect: (project: Project) => void;
}

function ProjectListComponent({ onProjectSelect }: ProjectListProps) {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onProjectSelect(project)}
              className="text-left group p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div 
                className="w-full h-40 mb-4 overflow-hidden"
                style={{ borderRadius: '12px' }}
              >
                <ProjectVisual
                  project={project}
                  variant="card"
                  className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                  imageClassName="w-full h-full object-cover"
                />
              </div>
              <span
                className="font-mono text-[11px] uppercase tracking-widest block mb-3"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {project.index} / {projectCountLabel}
              </span>
              <h3
                className="font-serif-display text-[24px] mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-200"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {project.name}
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {project.tagline}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded-full border"
                    style={{
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const ProjectList = memo(ProjectListComponent);
export default ProjectList;
