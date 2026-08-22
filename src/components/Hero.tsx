import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { CV_OPTIONS, EMAIL, PERSON_NAME, SEMANTICS_URL } from '../config/site';
import { MotionIcon } from './MotionIcon';
import { getProjectPath } from '../utils/project-display';
import { shouldUseClientNavigation } from '../utils/client-navigation';

interface HeroProps {
  onProjectSelect: (project: Project) => void;
  isReady: boolean;
}

const primaryProject = projects[0];

export default function Hero({ onProjectSelect, isReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isReady) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('[data-hero-title], [data-hero-copy], [data-hero-image]', { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.timeline()
        .fromTo('[data-hero-title]', { yPercent: 105 }, { yPercent: 0, duration: 1.05, ease: 'power4.out' })
        .fromTo('[data-hero-copy]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, 0.25)
        .fromTo('[data-hero-image]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'expo.inOut' }, 0.12);
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={sectionRef} id="works" className="hero-shell">
      <div className="hero-layout">
        <div className="hero-copy">
          <span data-hero-copy className="hero-eyebrow">{PERSON_NAME} · Milano</span>

          <h1 className="hero-title">
            <span><span data-hero-title>Software for</span></span>
            <span><span data-hero-title>the real world.</span></span>
          </h1>

          <div data-hero-copy className="hero-intro">
            <p>
              Full-stack developer and founder of <a href={SEMANTICS_URL} target="_blank" rel="noopener noreferrer">Semantics</a>, a Milan studio building products for infrastructure and field operations.
            </p>
          </div>

          <div data-hero-copy className="hero-actions">
            <a className="motion-link" href={`mailto:${EMAIL}`}><span>Contact</span><MotionIcon /></a>
            <a className="motion-link" href={CV_OPTIONS[0].href} target="_blank" rel="noopener noreferrer"><span>CV</span><MotionIcon direction="down" /></a>
          </div>
        </div>

        <a
          data-hero-image
          className="hero-project motion-link"
          href={getProjectPath(primaryProject.name)}
          onClick={(event) => {
            if (!shouldUseClientNavigation(event)) return;
            event.preventDefault();
            onProjectSelect(primaryProject);
          }}
          aria-label={`Open ${primaryProject.name}`}
        >
          <img
            src={primaryProject.imageUrl}
            alt={primaryProject.imageAlt ?? `Visual for ${primaryProject.name}`}
            width="1448"
            height="1086"
            fetchPriority="high"
            decoding="async"
          />
          <span><strong>{primaryProject.name}</strong><MotionIcon /></span>
        </a>
      </div>
    </section>
  );
}
