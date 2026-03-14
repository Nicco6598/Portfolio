import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import Ticker from './Ticker';

const DEVELOPER_NAME = "Marco Niccolini";
const TAGLINE = "I craft intuitive digital experiences with a focus on clean design and seamless functionality. Specializing in iOS development and full-stack solutions.";

interface HeroProps {
  onProjectSelect: (project: Project) => void;
}

export default function Hero({ onProjectSelect }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
      .from(taglineRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.6')
      .from(projectListRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
      }, '-=0.6');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="works" className="pt-32 pb-0">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-[60%_40%] gap-12">
          <div>
            <h1
              ref={headingRef}
              className="font-serif-display text-[clamp(72px,10vw,140px)] leading-[0.9] mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {DEVELOPER_NAME}
            </h1>
            <p
              ref={taglineRef}
              className="text-base max-w-[480px]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {TAGLINE}
            </p>
          </div>

          <div ref={projectListRef} className="md:pt-4">
            <span
              className="font-mono text-[11px] uppercase tracking-widest block mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Selected Projects
            </span>
            <div className="flex flex-col">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setActiveProject(project);
                    onProjectSelect(project);
                  }}
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
          </div>
        </div>
      </div>

      <div
        className="mt-16 border-t"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <span
              className="font-mono text-[13px] uppercase tracking-widest"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {activeProject.index} / {projects.length.toString().padStart(2, '0')}
            </span>
            <span
              className="font-serif-display text-[24px] md:text-[32px]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {activeProject.name}
            </span>
          </div>
          <div className="flex gap-2">
            {activeProject.tags.map((tag) => (
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
      </div>

      <Ticker />
    </section>
  );
}
