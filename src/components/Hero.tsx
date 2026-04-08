import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { CV_OPTIONS, EMAIL, LOCATION_LABEL, PERSON_NAME } from '../config/site';
import { useCanHover } from '../hooks/useCanHover';
import { usePointerPreviewPosition } from '../hooks/usePointerPreviewPosition';
import { useRadialHover } from '../hooks/useRadialHover';
import HeroProjectList from './hero/HeroProjectList';
import HeroProjectPreview from './hero/HeroProjectPreview';
import HeroProjectSummary from './hero/HeroProjectSummary';
import Ticker from './Ticker';

const TAGLINE = "Full-Stack Software Developer crafting modern web experiences with React, Next.js, and Node.js. Building scalable solutions with clean code and strong type safety.";
const PREVIEW_OFFSET_X = 24;
const PREVIEW_OFFSET_Y = -80;
const PRIMARY_CV_OPTION = CV_OPTIONS[0];
const HERO_PROOF_POINTS = [
  'Freelance and product collaborations',
  `${projects.length}+ shipped projects across web, full-stack, and blockchain`,
  `${LOCATION_LABEL} / Remote-friendly`,
];

interface HeroActionLinkProps {
  href: string;
  label: string;
  canHover: boolean;
  tone?: 'accent' | 'muted';
  external?: boolean;
}

function HeroActionLink({
  href,
  label,
  canHover,
  tone = 'muted',
  external = false,
}: HeroActionLinkProps) {
  const linkRef = useRadialHover<HTMLAnchorElement>(canHover);
  const isAccent = tone === 'accent';

  return (
    <a
      ref={linkRef}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`radial-hover-surface group inline-flex items-center justify-between gap-4 rounded-full border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] ${canHover ? 'hover:-translate-y-0.5' : ''}`.trim()}
      style={{
        ['--radial-fill' as string]: 'var(--color-accent)',
        ['--radial-text' as string]: 'var(--color-text-primary)',
        borderColor: isAccent ? 'var(--color-accent)' : 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
      } as CSSProperties}
    >
      <span data-radial-fill className="radial-hover-fill" />
      <span className="radial-hover-content flex items-center gap-4">
        <span>{label}</span>
        <span
          aria-hidden="true"
          style={{ color: isAccent ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
        >
          {'->'}
        </span>
      </span>
    </a>
  );
}

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
  const canHover = useCanHover();
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const previewProject = canHover ? hoveredProject : null;
  const { previewRef, setPointerPosition } = usePointerPreviewPosition(
    Boolean(previewProject),
    PREVIEW_OFFSET_X,
    PREVIEW_OFFSET_Y,
  );

  const displayProject = previewProject || activeProject;

  const handleProjectSelect = useCallback((project: Project) => {
    setActiveProject(project);
    onProjectSelect(project);
  }, [onProjectSelect]);

  const handleProjectFocus = useCallback((project: Project) => {
    setActiveProject(project);
  }, []);

  const handleProjectHover = useCallback((project: Project, clientX: number, clientY: number) => {
    if (!canHover) {
      return;
    }

    setPointerPosition(clientX, clientY);
    setHoveredProject(project);
  }, [canHover, setPointerPosition]);

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
      className="relative flex min-h-[100dvh] flex-col overflow-clip md:h-[100dvh]"
    >
      <HeroProjectPreview
        project={previewProject}
        previewRef={previewRef}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 px-6 pb-8 pt-24 md:min-h-0 md:px-12 md:pb-0 md:pt-28 lg:pt-32">
        <div className="grid w-full content-start gap-12 md:h-full md:min-h-0 md:grid-cols-[60%_40%] md:content-stretch md:gap-12">
          <div className="flex min-h-0 flex-col justify-start pt-4 md:justify-center md:pt-0">
            <h1
              ref={headingRef}
              className="mb-6 font-serif-display text-[clamp(56px,16vw,140px)] leading-[0.9]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {PERSON_NAME}
            </h1>
            <p
              ref={taglineRef}
              className="max-w-[540px] text-base leading-7"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {TAGLINE}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <HeroActionLink
                href={`mailto:${EMAIL}`}
                label="Email me"
                canHover={canHover}
                tone="accent"
              />
              <HeroActionLink
                href={PRIMARY_CV_OPTION.href}
                label="Download CV"
                canHover={canHover}
                external
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {HERO_PROOF_POINTS.map((item) => (
                <span
                  key={item}
                  className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'color-mix(in srgb, var(--color-surface) 72%, transparent)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            ref={projectListRef}
            className="flex min-h-0 flex-col justify-start md:justify-center md:pt-4"
          >
            <span
              className="font-mono text-[11px] uppercase tracking-widest block mb-6"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Selected Projects
            </span>
            <HeroProjectList
              canHover={canHover}
              displayProject={displayProject}
              onProjectFocus={handleProjectFocus}
              onProjectSelect={handleProjectSelect}
              onProjectHover={handleProjectHover}
              onProjectLeave={handleProjectLeave}
            />

            {!canHover ? (
              <div className="mt-6 md:hidden">
                <HeroProjectSummary project={activeProject} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div ref={tickerRef}>
        <Ticker />
      </div>
    </section>
  );
}
