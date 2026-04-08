import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { usePointerPreviewPosition } from '../hooks/usePointerPreviewPosition';
import HeroProjectList from './hero/HeroProjectList';
import HeroProjectPreview from './hero/HeroProjectPreview';
import HeroProjectSummary from './hero/HeroProjectSummary';
import Ticker from './Ticker';

const DEVELOPER_NAME = "Marco Niccolini";
const TAGLINE = "Full-Stack Software Developer crafting modern web experiences with React, Next.js, and Node.js. Building scalable solutions with clean code and strong type safety.";
const PREVIEW_OFFSET_X = 24;
const PREVIEW_OFFSET_Y = -80;

interface HeroProps {
  onProjectSelect: (project: Project) => void;
}

export default function Hero({ onProjectSelect }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const { previewRef, setPointerPosition } = usePointerPreviewPosition(Boolean(hoveredProject), PREVIEW_OFFSET_X, PREVIEW_OFFSET_Y);

  const displayProject = hoveredProject || activeProject;

  const handleProjectSelect = useCallback((project: Project) => {
    setActiveProject(project);
    onProjectSelect(project);
  }, [onProjectSelect]);

  const handleProjectHover = useCallback((project: Project, clientX: number, clientY: number) => {
    setPointerPosition(clientX, clientY);
    setHoveredProject(project);
  }, [setPointerPosition]);

  const handleProjectLeave = useCallback(() => {
    setHoveredProject(null);
  }, []);

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
    <section ref={heroRef} id="works" className="h-screen flex flex-col relative">
      <HeroProjectPreview project={hoveredProject} previewRef={previewRef} />

      <div className="flex-1 max-w-7xl mx-auto px-6 md:px-12 w-full pt-32">
        <div className="grid md:grid-cols-[60%_40%] gap-12 h-full">
          <div className="flex flex-col justify-center">
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

          <div ref={projectListRef} className="md:pt-4 flex flex-col justify-center">
            <span
              className="font-mono text-[11px] uppercase tracking-widest block mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Selected Projects
            </span>
            <HeroProjectList
              onProjectSelect={handleProjectSelect}
              onProjectHover={handleProjectHover}
              onProjectLeave={handleProjectLeave}
            />
          </div>
        </div>
      </div>

      <div
        className="border-t flex-shrink-0"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <HeroProjectSummary project={displayProject} />
      </div>

      <Ticker />
    </section>
  );
}
