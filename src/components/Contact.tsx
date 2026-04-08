import type { CSSProperties } from 'react';
import {
  AVAILABILITY_LABEL,
  CORE_FOCUS_LABEL,
  CURRENT_YEAR,
  CV_OPTIONS,
  EMAIL,
  LOCATION_LABEL,
  NAV_ITEMS,
  SITE_NAME,
  SOCIAL_LINKS,
} from '../config/site';
import { useCanHover } from '../hooks/useCanHover';
import { useRadialHover } from '../hooks/useRadialHover';

const CONTACT_NOTES = [
  'Freelance projects and product collaborations',
  'Corporate websites, custom admin panels, and full-stack web apps',
  'Frontend polish, backend structure, and maintainable delivery',
];

const CONTACT_META = [
  { label: 'Base', value: LOCATION_LABEL },
  { label: 'Availability', value: AVAILABILITY_LABEL },
  { label: 'Focus', value: CORE_FOCUS_LABEL },
];

const CONTACT_STEPS = [
  'A quick message to align on scope, timeline, and constraints.',
  'A focused conversation around goals, priorities, and delivery approach.',
  'A clear next step: proposal, estimate, or implementation plan.',
];

function SocialArrow({ canHover }: { canHover: boolean }) {
  return (
    <span className={`overflow-hidden transition-transform duration-200 ${canHover ? 'group-hover:translate-x-1' : ''}`.trim()}>
      <svg className={`h-4 w-4 transition-colors duration-200 ${canHover ? 'group-hover:text-[var(--color-accent)]' : ''}`.trim()} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </span>
  );
}

function ContactActionLink({
  href,
  label,
  canHover,
  variant = 'secondary',
}: {
  href: string;
  label: string;
  canHover: boolean;
  variant?: 'primary' | 'secondary';
}) {
  const linkRef = useRadialHover<HTMLAnchorElement>(canHover);
  const isPrimary = variant === 'primary';

  return (
    <a
      ref={linkRef}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className={`radial-hover-surface group inline-flex items-center justify-between gap-4 rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-transform duration-200 ${canHover ? 'hover:-translate-y-0.5' : ''}`.trim()}
      style={{
        ['--radial-fill' as string]: 'var(--color-accent)',
        ['--radial-text' as string]: 'var(--color-text-primary)',
        borderColor: isPrimary ? 'var(--color-accent)' : 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        color: isPrimary ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
      } as CSSProperties}
    >
      <span data-radial-fill className="radial-hover-fill" />
      <span className="radial-hover-content flex items-center gap-4">
        <span>{label}</span>
        <span
          aria-hidden="true"
          style={{ color: isPrimary ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
        >
          {'->'}
        </span>
      </span>
    </a>
  );
}

export default function Contact() {
  const canHover = useCanHover();

  return (
    <section
      id="contact"
      className="px-6 py-24 md:px-12"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="mx-auto max-w-7xl">
        <span
          className="mb-4 block font-mono text-[11px] uppercase tracking-widest"
          style={{ color: 'var(--color-accent)' }}
        >
          Contact
        </span>
        <h2
          className="font-serif-display text-[clamp(48px,8vw,96px)]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Let&apos;s build something sharp.
        </h2>
        <p
          className="mt-4 max-w-2xl text-base leading-7 md:text-[17px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {LOCATION_LABEL} — {AVAILABILITY_LABEL}. If the project needs clarity, visual quality, and strong execution, I&apos;m happy to talk.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.98fr)]">
          <div className="space-y-8">
            <div
              className="border-y py-6 md:py-7"
              style={{
                borderColor: 'var(--color-border)',
              }}
            >
              <span
                className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-accent)' }}
              >
                Best fit
              </span>

              <div className="grid gap-4">
                {CONTACT_NOTES.map((item, index) => (
                  <div
                    key={item}
                    className="grid gap-2 border-b pb-4 last:border-b-0 last:pb-0 md:grid-cols-[52px_minmax(0,1fr)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      0{index + 1}
                    </span>
                    <p
                      className="text-sm leading-6 md:text-[15px]"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span
                className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-accent)' }}
              >
                What usually happens next
              </span>

              <div className="space-y-4">
                {CONTACT_STEPS.map((item, index) => (
                  <div
                    key={item}
                    className="grid gap-2 md:grid-cols-[44px_minmax(0,1fr)]"
                  >
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      0{index + 1}
                    </span>
                    <p
                      className="text-sm leading-6 md:text-[15px]"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="rounded-[32px] border p-6 md:p-8"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'color-mix(in srgb, var(--color-surface) 70%, transparent)',
            }}
          >
            <div className="space-y-8">
              <div>
                <span
                  className="mb-3 block font-mono text-[11px] uppercase tracking-[0.24em]"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Start a conversation
                </span>
                <p
                  className="max-w-xl text-[18px] leading-8 md:text-[22px] md:leading-9"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  The fastest way to reach me is by email. A short message with context is enough to get started.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ContactActionLink
                  href={`mailto:${EMAIL}`}
                  label="Send me an email"
                  canHover={canHover}
                  variant="primary"
                />
                <ContactActionLink
                  href={SOCIAL_LINKS[1]?.href ?? SOCIAL_LINKS[0]?.href}
                  label="Connect on LinkedIn"
                  canHover={canHover}
                />
              </div>

              <div
                className="border-y py-6"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {CONTACT_META.map((item) => (
                    <div key={item.label}>
                      <span
                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: 'var(--color-accent)' }}
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
              </div>

              <div
                className="space-y-6"
              >
                <div>
                  <span
                    className="mb-4 block font-mono text-[11px] uppercase tracking-[0.24em]"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Elsewhere
                  </span>

                  <div className="flex flex-wrap gap-6">
                    {SOCIAL_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <span className={`transition-colors duration-200 ${canHover ? 'group-hover:text-[var(--color-accent)]' : ''}`.trim()}>{link.label}</span>
                        <SocialArrow canHover={canHover} />
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <span
                    className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    CV
                  </span>

                  <div className="flex flex-wrap gap-3">
                    {CV_OPTIONS.map((option) => (
                      <a
                        key={option.shortLabel}
                        href={option.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${canHover ? 'hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]' : ''}`.trim()}
                        style={{
                          borderColor: option.tone === 'accent' ? 'var(--color-accent)' : 'var(--color-border)',
                          color: option.tone === 'accent' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                          backgroundColor: 'var(--color-surface)',
                        }}
                      >
                        {option.shortLabel}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer
        className="mt-24 border-t pt-8"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
          <div>
            <span
              className="block font-mono text-[11px] uppercase tracking-widest"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              © {CURRENT_YEAR} Marco Niccolini
            </span>
            <span
              className="mt-2 block font-mono text-[11px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {SITE_NAME} / Built with React + Tailwind
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${canHover ? 'hover:-translate-y-0.5 hover:text-[var(--color-accent)]' : ''}`.trim()}
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {`{${item.label.toLowerCase()}}`}
              </a>
            ))}
          </div>

          <span
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {LOCATION_LABEL}
          </span>
        </div>
      </footer>
    </section>
  );
}
