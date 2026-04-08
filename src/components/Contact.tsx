import { CURRENT_YEAR, EMAIL, SOCIAL_LINKS } from '../config/site';

function SocialArrow() {
  return (
    <span className="overflow-hidden transition-transform duration-200 group-hover:translate-x-1">
      <svg className="w-4 h-4 transition-colors duration-200 group-hover:text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </span>
  );
}

export default function Contact() {
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

        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <a
            href={`mailto:${EMAIL}`}
            className="link-underline font-mono text-[14px] uppercase tracking-widest"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {EMAIL}
          </a>

          <div className="flex gap-8">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <span className="transition-colors duration-200 group-hover:text-[var(--color-accent)]">{link.label}</span>
                <SocialArrow />
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer
        className="mt-24 pt-8 border-t"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            © {CURRENT_YEAR} Marco Niccolini
          </span>
          <span
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Built with React + Tailwind
          </span>
        </div>
      </footer>
    </section>
  );
}
