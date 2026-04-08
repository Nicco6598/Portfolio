import { AnimatePresence, motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import type { Project } from '../data/projects';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useCanHover } from '../hooks/useCanHover';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useRadialHover } from '../hooks/useRadialHover';
import { getProjectAccent } from '../utils/project-display';
import ProjectVisual from './projects/ProjectVisual';

interface ProjectSheetProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectSheetSectionProps {
  label: string;
  children: ReactNode;
}

interface ProjectSheetLinkProps {
  canHover: boolean;
  href: string;
  label: string;
  accent: string;
  variant: 'primary' | 'secondary';
}

const EMPTY_FEATURES: string[] = [];
const BASE_SCROLLBAR_ACCENT = '#FF4D00';
const SHEET_EASE = [0.22, 1, 0.36, 1] as const;
const OVERLAY_TRANSITION = { duration: 0.28, ease: SHEET_EASE } as const;
const SHEET_TRANSITION = { duration: 0.68, ease: SHEET_EASE } as const;
const CONTENT_TRANSITION = { duration: 0.5, ease: SHEET_EASE, delay: 0.08 } as const;

function ProjectSheetSection({ label, children }: ProjectSheetSectionProps) {
  return (
    <section
      className="grid gap-5 border-t pt-8 md:grid-cols-[128px_minmax(0,1fr)] md:gap-8"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <span
        className="font-mono text-[11px] uppercase tracking-[0.28em]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </span>
      <div>{children}</div>
    </section>
  );
}

function ProjectSheetLink({
  canHover,
  href,
  label,
  accent,
  variant,
}: ProjectSheetLinkProps) {
  const linkRef = useRadialHover<HTMLAnchorElement>(canHover);
  const isPrimary = variant === 'primary';

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`radial-hover-surface group inline-flex items-center justify-between gap-4 rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.28em] ${canHover ? 'hover:-translate-y-0.5' : ''}`.trim()}
      style={{
        ['--radial-fill' as string]: accent,
        ['--radial-text' as string]: 'var(--color-text-primary)',
        borderColor: isPrimary ? accent : 'var(--color-border)',
        backgroundColor: 'transparent',
        color: 'var(--color-text-primary)',
      } as CSSProperties}
    >
      <span data-radial-fill className="radial-hover-fill" />
      <span className="radial-hover-content flex w-full items-center justify-between gap-4">
        <span>{label}</span>
        <span aria-hidden="true">{'->'}</span>
      </span>
    </a>
  );
}

function ProjectSheetMainContent({
  project,
  accent,
}: {
  project: Project;
  accent: string;
}) {
  const features = project.features ?? EMPTY_FEATURES;
  const leadFeature = features[0];
  const detailFeatures = leadFeature ? features.slice(1) : features;

  return (
    <div className="space-y-12 md:space-y-14">
      <header className="relative border-b pb-10 md:pb-12" style={{ borderColor: 'var(--color-border)' }}>
        <div className="absolute right-0 top-0 hidden select-none md:block">
          <span
            className="font-serif-display text-[clamp(88px,15vw,220px)] leading-none"
            style={{ color: 'var(--color-surface)' }}
          >
            {project.index}
          </span>
        </div>

        <div className="relative z-10 max-w-3xl">
          <span
            className="mb-5 block font-mono text-[11px] uppercase tracking-[0.34em]"
            style={{ color: accent }}
          >
            Case Study / {project.date}
          </span>
          <h2
            id="project-title"
            className="max-w-3xl font-serif-display text-[clamp(54px,9vw,112px)] leading-[0.9]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {project.name}
          </h2>
          <p
            className="mt-5 max-w-2xl text-[18px] leading-8 md:text-[22px] md:leading-9"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {project.tagline}
          </p>
        </div>
      </header>

      <ProjectSheetSection label="Overview">
        <p
          className="max-w-3xl text-[21px] leading-[1.55] md:text-[28px] md:leading-[1.45]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {project.description}
        </p>
      </ProjectSheetSection>

      {leadFeature ? (
        <ProjectSheetSection label="Highlight">
          <blockquote
            className="max-w-3xl border-l pl-6 font-serif-display text-[30px] leading-[1.12] md:pl-8 md:text-[46px]"
            style={{
              borderColor: accent,
              color: 'var(--color-text-primary)',
            }}
          >
            {leadFeature}
          </blockquote>
        </ProjectSheetSection>
      ) : null}

      {detailFeatures.length > 0 ? (
        <ProjectSheetSection label="Build Notes">
          <div>
            {detailFeatures.map((feature, index) => (
              <div
                key={feature}
                className="grid gap-3 py-5 md:grid-cols-[72px_minmax(0,1fr)] md:gap-6"
                style={{
                  borderTop: index === 0 ? 'none' : '1px solid var(--color-border)',
                }}
              >
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.28em]"
                  style={{ color: accent }}
                >
                  0{index + 1}
                </span>
                <p
                  className="text-base leading-7 md:text-lg"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </ProjectSheetSection>
      ) : null}

      <ProjectSheetSection label="Toolkit">
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {project.tags.map((tag, index) => (
            <div
              key={tag}
              className="flex items-center justify-between border-b py-3"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                0{index + 1}
              </span>
              <span
                className="pl-4 text-right text-sm uppercase tracking-[0.14em] md:text-[15px]"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {tag}
              </span>
            </div>
          ))}
        </div>
      </ProjectSheetSection>
    </div>
  );
}

function ProjectSheetSidebar({
  canHover,
  project,
  accent,
}: {
  canHover: boolean;
  project: Project;
  accent: string;
}) {
  const projectType = project.tags[0] ?? 'Web Project';
  const availabilityLabel = project.liveUrl ? 'Live and code' : project.githubUrl ? 'Code only' : 'Private build';
  const metaItems = [
    { label: 'Role', value: project.role },
    { label: 'Year', value: project.date },
    { label: 'Type', value: projectType },
    { label: 'Access', value: availabilityLabel },
  ];

  return (
    <aside className="lg:sticky lg:top-10 self-start">
      <div
        className="mb-6 flex items-center justify-between border-b pb-4"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <span
          className="font-mono text-[11px] uppercase tracking-[0.28em]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Project Sheet
        </span>
        <span
          className="font-mono text-[11px] uppercase tracking-[0.28em]"
          style={{ color: accent }}
        >
          {project.index}
        </span>
      </div>

      <div
        className="relative overflow-hidden rounded-[32px] border"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <div className="aspect-[4/5]">
          <ProjectVisual
            project={project}
            variant="sheet"
            className="h-full w-full"
            imageClassName="h-full w-full object-cover"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 border-t px-5 py-4"
          style={{
            borderColor: 'rgba(255,255,255,0.12)',
            background: 'linear-gradient(180deg, rgba(10, 10, 10, 0) 0%, rgba(10, 10, 10, 0.84) 100%)',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="font-serif-display text-[26px] leading-none text-white">
              {project.name}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/80">
              {project.date}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
        {metaItems.map((item) => (
          <div key={item.label}>
            <span
              className="mb-2 block font-mono text-[10px] uppercase tracking-[0.28em]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {item.label}
            </span>
            <p
              className="text-sm leading-6 md:text-[15px]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {project.liveUrl ? (
          <ProjectSheetLink
            canHover={canHover}
            href={project.liveUrl}
            label="View live"
            accent={accent}
            variant="primary"
          />
        ) : null}
        {project.githubUrl ? (
          <ProjectSheetLink
            canHover={canHover}
            href={project.githubUrl}
            label="View code"
            accent={accent}
            variant="secondary"
          />
        ) : null}
      </div>
    </aside>
  );
}

export default function ProjectSheet({
  project,
  isOpen,
  onClose,
}: ProjectSheetProps) {
  useBodyScrollLock(isOpen);
  useEscapeKey(isOpen, onClose);
  const canHover = useCanHover();
  const closeButtonRef = useRadialHover<HTMLButtonElement>(isOpen && canHover);

  const accent = project ? getProjectAccent(project.id) : null;

  return (
    <AnimatePresence>
      {isOpen && project && accent ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_TRANSITION}
            className="fixed inset-0 z-[90]"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.72)' }}
            onClick={onClose}
            role="button"
            aria-label="Close project sheet"
            tabIndex={-1}
          />

          <motion.div
            initial={{ y: '10%', opacity: 0.985, ['--sheet-scrollbar-project-color' as string]: BASE_SCROLLBAR_ACCENT } as never}
            animate={{ y: 0, opacity: 1, ['--sheet-scrollbar-project-color' as string]: accent } as never}
            exit={{ y: '100%', opacity: 1, ['--sheet-scrollbar-project-color' as string]: BASE_SCROLLBAR_ACCENT } as never}
            transition={SHEET_TRANSITION}
            className="project-sheet-scrollbar fixed inset-0 z-[100] overflow-y-auto overscroll-y-contain"
            style={{
              backgroundColor: 'var(--color-sheet-bg)',
              willChange: 'transform',
              scrollbarColor: `${accent} var(--color-surface)`,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
          >
            <div className="relative min-h-screen">
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at top left, ${accent}14 0%, transparent 34%), radial-gradient(circle at bottom right, ${accent}10 0%, transparent 28%)`,
                }}
              />
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }}
              />

              <div className="sticky top-0 z-30 flex justify-end px-6 pt-6 md:px-10 md:pt-8">
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className={`radial-hover-surface group rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] transition-transform duration-200 ${canHover ? 'hover:-translate-y-0.5' : ''}`.trim()}
                  style={{
                    ['--radial-fill' as string]: accent,
                    ['--radial-text' as string]: 'var(--color-text-primary)',
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'color-mix(in srgb, var(--color-sheet-bg) 82%, transparent)',
                    color: 'var(--color-text-primary)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: '0 10px 30px rgba(10,10,10,0.08)',
                  } as CSSProperties}
                  aria-label="Close project"
                >
                  <span data-radial-fill className="radial-hover-fill" />
                  <span className="radial-hover-content">Close</span>
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={CONTENT_TRANSITION}
                className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-12 md:pb-20 md:pt-10"
              >
                <div className="grid gap-12 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                  <ProjectSheetSidebar canHover={canHover} project={project} accent={accent} />
                  <ProjectSheetMainContent project={project} accent={accent} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
