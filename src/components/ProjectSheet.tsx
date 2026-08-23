import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { EMAIL } from '../config/site';
import type { Project } from '../data/projects';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { CloseIcon, MotionIcon } from './MotionIcon';
import ProjectVisual from './projects/ProjectVisual';
import { renderSemanticsLinks } from '../utils/render-semantics-links';

interface ProjectSheetProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

const EASE = [0.76, 0, 0.24, 1] as const;

export default function ProjectSheet({ project, isOpen, onClose, returnFocusRef }: ProjectSheetProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const reduceMotion = useReducedMotion();

  const requestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(onClose, reduceMotion ? 0 : 520);
  }, [isClosing, onClose, reduceMotion]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEscapeKey(isOpen, requestClose);
  useDialogFocus({ containerRef: dialogRef, isOpen, returnFocusRef });

  return (
    <AnimatePresence>
      {isOpen && project ? (
        <motion.div
          ref={dialogRef}
          className="project-detail"
          initial={reduceMotion ? false : { clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: isClosing ? 'inset(0 0 100% 0)' : 'inset(0% 0 0 0)' }}
          transition={{ duration: reduceMotion ? 0 : isClosing ? 0.52 : 0.78, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-title"
          tabIndex={-1}
        >
          <header className="project-detail__nav">
            <span>{project.name}</span>
            <button type="button" onClick={requestClose} aria-label="Close project">
              <span className="project-detail__close-label">Close</span>
              <span className="project-detail__close-icon" aria-hidden="true"><CloseIcon /></span>
            </button>
          </header>

          <main>
            <section className="project-detail__hero">
              <ProjectVisual project={project} variant="sheet" className="project-detail__media" />
              <div className="project-detail__title">
                <h1 id="project-title">{project.name}</h1>
                <p>{project.tagline}</p>
              </div>
            </section>

            <section className="project-detail__intro">
              <div className="project-detail__meta">
                <span>{project.role}</span>
                <span>{project.date}</span>
                <span>{renderSemanticsLinks(project.tags[0])}</span>
              </div>
              <p>{renderSemanticsLinks(project.description)}</p>
            </section>

            <section className="project-detail__outcomes">
              <h3>What changed.</h3>
              <ol>
                {(project.outcomes?.length ? project.outcomes : [project.impact]).map((outcome, index) => (
                  <li key={outcome}><span>{String(index + 1).padStart(2, '0')}</span>{renderSemanticsLinks(outcome)}</li>
                ))}
              </ol>
            </section>

            <section className="project-detail__build">
              <div>
                <h3>The build.</h3>
                <ul>
                  {(project.features ?? []).map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
              </div>
              <aside>
                <h3>Stack.</h3>
                <ul>{project.tags.map((tag) => <li key={tag}>{renderSemanticsLinks(tag)}</li>)}</ul>
              </aside>
            </section>

            <footer className="project-detail__footer">
              <h3>See the work.</h3>
              <div>
                {project.liveUrl ? <a className="motion-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer"><span>Live site</span><MotionIcon /></a> : null}
                {project.githubUrl ? <a className="motion-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer"><span>Source</span><MotionIcon /></a> : null}
                <a className="motion-link" href={`mailto:${EMAIL}`}><span>Contact</span><MotionIcon /></a>
              </div>
            </footer>
          </main>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
