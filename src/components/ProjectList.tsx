import { motion, useReducedMotion } from 'framer-motion';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { MotionIcon } from './MotionIcon';
import ProjectVisual from './projects/ProjectVisual';
import { getProjectPath } from '../utils/project-display';
import { shouldUseClientNavigation } from '../utils/client-navigation';

interface ProjectListProps {
  onProjectSelect: (project: Project) => void;
}

const FEATURED_PROJECTS = projects.slice(0, 4);
const ARCHIVE_PROJECTS = projects.slice(4);
const EASE = [0.16, 1, 0.3, 1] as const;

function FeaturedProject({ project, onProjectSelect }: { project: Project; onProjectSelect: (project: Project) => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="project-feature"
      initial={reduceMotion ? false : { opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.85, ease: EASE }}
    >
      <a
        className="motion-link"
        href={getProjectPath(project.name)}
        onClick={(event) => {
          if (!shouldUseClientNavigation(event)) return;
          event.preventDefault();
          onProjectSelect(project);
        }}
        aria-label={`Open ${project.name}`}
      >
        <ProjectVisual project={project} variant="card" className="project-feature__image" />
        <span className="project-feature__copy">
          <span className="project-feature__meta">{project.role} · {project.date}</span>
          <strong>{project.name}</strong>
          <p>{project.tagline}</p>
          <span className="project-feature__link motion-link"><span>View project</span><MotionIcon /></span>
        </span>
      </a>
    </motion.article>
  );
}

export default function ProjectList({ onProjectSelect }: ProjectListProps) {
  return (
    <section className="work-section" aria-labelledby="selected-work-title">
      <header className="work-intro">
        <h2 id="selected-work-title">Selected work.</h2>
        <p>Products and platforms shaped from the system to the interface.</p>
      </header>

      <div className="project-features">
        {FEATURED_PROJECTS.map((project) => (
          <FeaturedProject key={project.id} project={project} onProjectSelect={onProjectSelect} />
        ))}
      </div>

      <div className="archive-section">
        <header>
          <h2>Archive.</h2>
          <p>Earlier experiments, contracts and on-chain work.</p>
        </header>
        <div className="archive-list">
          {ARCHIVE_PROJECTS.map((project) => (
            <a
              key={project.id}
              className="archive-row motion-link"
              href={getProjectPath(project.name)}
              onClick={(event) => {
                if (!shouldUseClientNavigation(event)) return;
                event.preventDefault();
                onProjectSelect(project);
              }}
            >
              <span>{project.name}</span>
              <span>{project.role}</span>
              <span>{project.date}</span>
              <MotionIcon />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
