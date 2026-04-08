import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { usePointerPreviewPosition } from '../hooks/usePointerPreviewPosition';
import HeroProjectList from './hero/HeroProjectList';
import HeroProjectPreview from './hero/HeroProjectPreview';
import Ticker from './Ticker';

const DEVELOPER_NAME = "Marco Niccolini";
const TAGLINE = "Full-Stack Software Developer crafting modern web experiences with React, Next.js, and Node.js. Building scalable solutions with clean code and strong type safety.";
const PREVIEW_OFFSET_X = 24;
const PREVIEW_OFFSET_Y = -80;

interface HeroProps {
  onProjectSelect: (project: Project) => void;
  isReady: boolean;
}

export default function Hero({ onProjectSelect, isReady }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
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
    if (!isReady) {
      return;
    }

    const ctx = gsap.context(() => {
      const projectItems = projectListRef.current
        ? Array.from(projectListRef.current.children)
        : [];

      const tl = gsap.timeline({ delay: 0.12 });

      tl.fromTo(
        headingRef.current,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        },
      )
        .fromTo(
          taglineRef.current,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.62,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          '-=0.54',
        )
        .fromTo(
          projectItems,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.58,
            ease: 'power3.out',
            stagger: 0.06,
            clearProps: 'transform,opacity',
          },
          '-=0.44',
        )
        .fromTo(
          tickerRef.current,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.54,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          },
          '-=0.36',
        );
    }, heroRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section
      ref={heroRef}
      id="works"
      className="relative flex h-[100dvh] flex-col overflow-hidden"
    >
      <HeroProjectPreview project={hoveredProject} previewRef={previewRef} />

      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 px-6 pt-24 md:px-12 md:pt-28 lg:pt-32">
        <div className="grid h-full min-h-0 gap-10 md:grid-cols-[60%_40%] md:gap-12">
          <div className="flex min-h-0 flex-col justify-center">
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

          <div
            ref={projectListRef}
            className="flex min-h-0 flex-col justify-center md:pt-4"
          >
            <span
              className="font-mono text-[11px] uppercase tracking-widest block mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Selected Projects
            </span>
            <HeroProjectList
              displayProject={displayProject}
              onProjectSelect={handleProjectSelect}
              onProjectHover={handleProjectHover}
              onProjectLeave={handleProjectLeave}
            />
          </div>
        </div>
      </div>

      <div ref={tickerRef}>
        <Ticker />
      </div>
    </section>
  );
}
