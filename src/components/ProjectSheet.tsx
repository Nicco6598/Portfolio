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
            style={{ backgroundColor: 'var(--color-sheet-bg)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
          >
            <div className="min-h-screen">
              {project.imageUrl && (
                <div 
                  className="w-full h-[40vh] md:h-[50vh] relative"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: 'linear-gradient(to bottom, transparent 50%, var(--color-sheet-bg) 100%)' 
                    }}
                  />
                </div>
              )}

              <div className="px-6 md:px-12 pb-12 -mt-20 relative">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 font-mono text-[14px] px-4 py-2 rounded-full border transition-opacity hover:opacity-60"
                  style={{ 
                    backgroundColor: 'var(--color-sheet-bg)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)' 
                  }}
                  aria-label="Close project"
                >
                  ✕ Close
                </button>

                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <span 
                      className="font-mono text-[11px] uppercase tracking-widest block mb-2"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {project.index} / {project.date}
                    </span>
                    <h2
                      id="project-title"
                      className="font-serif-display text-[clamp(40px,8vw,80px)] leading-[1] mb-3"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {project.name}
                    </h2>
                    <p 
                      className="text-lg md:text-xl max-w-2xl"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {project.tagline}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-[1fr_320px] gap-12">
                    <div>
                      <div className="mb-10">
                        <h3 
                          className="font-mono text-[11px] uppercase tracking-widest mb-4"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          Overview
                        </h3>
                        <p 
                          className="text-base leading-relaxed"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {project.description}
                        </p>
                      </div>

                      {project.features && project.features.length > 0 && (
                        <div className="mb-10">
                          <h3 
                            className="font-mono text-[11px] uppercase tracking-widest mb-4"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            Key Features
                          </h3>
                          <ul className="space-y-3">
                            {project.features.map((feature, index) => (
                              <li 
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <span 
                                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: 'var(--color-accent)' }}
                                />
                                <span 
                                  className="text-sm"
                                  style={{ color: 'var(--color-text-secondary)' }}
                                >
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <div 
                        className="p-6 rounded-2xl mb-6"
                        style={{ backgroundColor: 'var(--color-surface)' }}
                      >
                        <h3 
                          className="font-mono text-[11px] uppercase tracking-widest mb-4"
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border"
                              style={{
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div 
                          className="flex justify-between py-3 border-b"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          <span 
                            className="font-mono text-[11px] uppercase tracking-widest"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            Role
                          </span>
                          <span 
                            className="font-mono text-[11px]"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {project.role}
                          </span>
                        </div>
                        <div 
                          className="flex justify-between py-3 border-b"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          <span 
                            className="font-mono text-[11px] uppercase tracking-widest"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            Year
                          </span>
                          <span 
                            className="font-mono text-[11px]"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {project.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 mt-6">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[12px] uppercase tracking-widest px-4 py-3 rounded-xl text-center transition-colors duration-200 hover:opacity-80"
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
                            className="font-mono text-[12px] uppercase tracking-widest px-4 py-3 rounded-xl border text-center transition-colors duration-200 hover:opacity-60"
                            style={{
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            View Code →
                          </a>
                        )}
                      </div>
                    </div>
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
