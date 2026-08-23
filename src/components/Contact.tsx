import { CURRENT_YEAR, CV_OPTIONS, EMAIL, LOCATION_LABEL, PERSON_NAME, SOCIAL_LINKS } from '../config/site';
import { MotionIcon } from './MotionIcon';
import { SemanticsLink } from './SemanticsLink';

interface ContactProps {
  onNavigate?: (section: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="contact-main">
        <h2 id="contact-title">Bring me a<br /><em>real problem.</em></h2>
        <p>Tell me what is slowing the work down. I&apos;ll tell you honestly whether software is the answer.</p>
      </div>

      <a href={`mailto:${EMAIL}`} className="contact-cta motion-link">
        <span>Start a conversation</span><MotionIcon />
      </a>

      <footer className="site-footer">
        <p className="site-footer__signature">{PERSON_NAME}.</p>

        <div className="site-footer__rail">
          <span>© {CURRENT_YEAR} · {LOCATION_LABEL}</span>

          <nav className="site-footer__socials" aria-label="Social links">
            {SOCIAL_LINKS.map((link) => (
              link.label === 'Semantics' ? (
                <SemanticsLink key={link.label} />
              ) : (
                <a className="motion-link" key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                  <span>{link.label}</span><MotionIcon />
                </a>
              )
            ))}
          </nav>

          <nav className="site-footer__cv" aria-label="CV downloads">
            {CV_OPTIONS.map((option) => (
              <a key={option.label} href={option.href} target="_blank" rel="noopener noreferrer">
                {option.shortLabel}
              </a>
            ))}
          </nav>

          <a
            className="motion-link site-footer__top"
            href="#works"
            onClick={(event) => {
              if (!onNavigate) return;
              event.preventDefault();
              onNavigate('works');
            }}
          >
            <span>Back to top</span><MotionIcon direction="up" />
          </a>
        </div>
      </footer>
    </section>
  );
}
