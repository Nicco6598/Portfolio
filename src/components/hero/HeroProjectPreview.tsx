import { memo, type RefObject } from 'react';
import { projectCountLabel, type Project } from '../../data/projects';
import { useTheme } from '../../hooks/useTheme';
import ProjectVisual from '../projects/ProjectVisual';

interface HeroProjectPreviewProps {
  project: Project | null;
  previewRef: RefObject<HTMLDivElement | null>;
}

function HeroProjectPreviewComponent({ project, previewRef }: HeroProjectPreviewProps) {
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';

  if (!project) {
    return null;
  }

  return (
    <div
      ref={previewRef}
      className="fixed pointer-events-none z-40 transition-opacity duration-200"
      style={{
        left: 0,
        top: 0,
        width: '320px',
        height: '240px',
        willChange: 'transform',
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          borderRadius: '20px',
          boxShadow: isLightTheme ? '0 18px 40px rgba(10,10,10,0.12)' : '0 18px 44px rgba(0,0,0,0.18)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <ProjectVisual
          project={project}
          variant="preview"
          className="h-full w-full"
          imageClassName="h-full w-full object-cover"
        />

        <div
          className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4"
          style={{
            background: isLightTheme
              ? 'linear-gradient(180deg, rgba(245,245,240,0.92) 0%, rgba(245,245,240,0.12) 100%)'
              : 'linear-gradient(180deg, rgba(10,10,10,0.48) 0%, rgba(10,10,10,0) 100%)',
          }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{ color: isLightTheme ? 'rgba(10,10,10,0.74)' : 'rgba(255,255,255,0.88)' }}
          >
            {project.index} / {projectCountLabel}
          </span>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.24em]"
            style={{ color: isLightTheme ? 'rgba(10,10,10,0.74)' : 'rgba(255,255,255,0.88)' }}
          >
            {project.date}
          </span>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-10"
          style={{
            background: isLightTheme
              ? 'linear-gradient(180deg, rgba(245,245,240,0) 0%, rgba(245,245,240,0.76) 58%, rgba(245,245,240,0.94) 100%)'
              : 'linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.88) 58%, rgba(10,10,10,0.96) 100%)',
          }}
        >
          <h3
            className="font-serif-display text-[28px] leading-none"
            style={{ color: isLightTheme ? 'var(--color-text-primary)' : '#FFFFFF' }}
          >
            {project.name}
          </h3>
          <p
            className="mt-2 max-w-[16rem] text-[12px] leading-5"
            style={{ color: isLightTheme ? 'rgba(10,10,10,0.7)' : 'rgba(255,255,255,0.8)' }}
          >
            {project.tagline}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em]"
                style={{
                  color: isLightTheme ? 'rgba(10,10,10,0.72)' : 'rgba(255,255,255,0.82)',
                  borderColor: isLightTheme ? 'rgba(10,10,10,0.12)' : 'rgba(255,255,255,0.22)',
                  backgroundColor: isLightTheme ? 'rgba(255,255,255,0.48)' : 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const HeroProjectPreview = memo(HeroProjectPreviewComponent);

export default HeroProjectPreview;
