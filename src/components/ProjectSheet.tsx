import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../data/projects';

interface ProjectSheetProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectSheet({ project, isOpen, onClose }: ProjectSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90]"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={onClose}
            role="button"
            aria-label="Close project sheet"
            tabIndex={-1}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed inset-0 z-[100] overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-sheet-bg)',
              boxShadow: '0 0 40px rgba(0,0,0,0.15)',
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
          >
            <div className="p-6 md:p-12">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 font-mono text-[14px] transition-opacity hover:opacity-60"
                style={{ color: 'var(--color-text-secondary)' }}
                aria-label="Close project"
              >
                ✕ Close
              </button>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2
                    id="project-title"
                    className="font-serif-display text-[clamp(32px,5vw,64px)] leading-[1.1] mb-6"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {project.name}
                  </h2>
                  <p
                    className="text-base mb-8"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <span
                      className="font-mono text-[11px] uppercase tracking-widest"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Role: {project.role}
                    </span>
                    <span
                      className="font-mono text-[11px] uppercase tracking-widest"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Year: {project.date}
                    </span>
                  </div>
                </div>

                <div>
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-48 md:h-64 object-cover rounded-xl mb-6"
                      loading="lazy"
                    />
                  )}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
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
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[12px] uppercase tracking-widest px-4 py-2 rounded-full transition-colors duration-200 hover:opacity-80"
                        style={{
                          backgroundColor: 'var(--color-accent)',
                          color: '#FFFFFF',
                        }}
                      >
                        View Live →
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[12px] uppercase tracking-widest px-4 py-2 rounded-full border transition-colors duration-200 hover:opacity-60"
                        style={{
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
