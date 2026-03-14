const EMAIL = 'marco.niccolini@example.com';
const GITHUB_URL = 'https://github.com';
const LINKEDIN_URL = 'https://linkedin.com';

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
          className="font-serif-display text-[clamp(48px,8vw,96px)] mb-8"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Let's work together.
        </h2>

        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <a
            href={`mailto:${EMAIL}`}
            className="link-underline font-mono text-[14px] uppercase tracking-widest"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {EMAIL}
          </a>

          <div className="flex gap-6">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] uppercase tracking-widest transition-colors duration-200 hover:text-[var(--color-accent)]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              GitHub →
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] uppercase tracking-widest transition-colors duration-200 hover:text-[var(--color-accent)]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              LinkedIn →
            </a>
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
            © {new Date().getFullYear()} Marco Niccolini
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
