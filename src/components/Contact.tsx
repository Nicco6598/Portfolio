import { CURRENT_YEAR, CV_OPTIONS, EMAIL, NAV_ITEMS, SITE_NAME, SOCIAL_LINKS } from '../config/site';
import { useCanHover } from '../hooks/useCanHover';

const CONTACT_NOTES = [
  'Freelance projects and product collaborations',
  'Corporate websites, custom admin panels, and full-stack web apps',
  'Frontend polish, backend structure, and maintainable delivery',
];

const CONTACT_META = [
  { label: 'Base', value: 'Pioltello (MI), Italy' },
  { label: 'Availability', value: 'Open to freelance projects and opportunities' },
  { label: 'Focus', value: 'React, Next.js, Node.js, TypeScript' },
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

export default function Contact() {
  const canHover = useCanHover();

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-12"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="max-w-7xl mx-auto">
        <span
          className="font-mono text-[11px] uppercase tracking-widest block mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          Contact
        </span>
        <h2
          className="font-serif-display text-[clamp(48px,8vw,96px)] mb-4"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Let's work together.
        </h2>
        <p
          className="text-base mb-8 max-w-xl"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Pioltello (MI), Italy — Available for freelance projects and opportunities.
        </p>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div>
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

            <div className="mt-10 flex flex-col gap-4">
              <a
                href={`mailto:${EMAIL}`}
                className="link-underline font-mono text-[14px] uppercase tracking-widest"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {EMAIL}
              </a>

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
          </div>

          <div
            className="rounded-[32px] border p-6 md:p-8"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-bg)',
            }}
          >
            <div className="space-y-8">
              <span
                className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-accent)' }}
              >
                Quick details
              </span>

              <div className="space-y-5">
                {CONTACT_META.map((item) => (
                  <div key={item.label}>
                    <span
                      className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em]"
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

              <div
                className="border-t pt-8"
                style={{ borderColor: 'var(--color-border)' }}
              >
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
                      className={`font-mono text-[11px] uppercase tracking-[0.18em] rounded-full border px-4 py-2 transition-all duration-200 ${canHover ? 'hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]' : ''}`.trim()}
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

      <footer
        className="mt-24 pt-8 border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
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
            Pioltello (MI), Italy
          </span>
        </div>
      </footer>
    </section>
  );
}
