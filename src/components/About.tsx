import { motion } from 'framer-motion';
import { SemanticsLink } from './SemanticsLink';

const HISTORY = [
  ['2026—', 'Founder, designer & engineer', 'Semantics'],
  ['2024—26', 'Independent developer', 'Product and client work'],
  ['Previously', 'Software engineer', 'Capgemini Engineering'],
];

const FOUNDER_SCOPE = [
  ['Product', 'Direction, research and the decisions that keep the work focused.'],
  ['Design', 'Systems, interaction and the visual language people actually use.'],
  ['Engineering', 'Architecture, code and the discipline required to ship.'],
];

export default function About() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <motion.div
        className="about-statement"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 id="about-title">
          <span>I build</span>
          <span><SemanticsLink>Semantics.</SemanticsLink></span>
          <span className="about-statement__accent">From the problem up.</span>
        </h2>

        <p>
          <SemanticsLink /> is where product direction, interface design and software engineering stay one continuous process. I stay close to every layer so the intent survives the path from a field problem to a shipped system.
        </p>
      </motion.div>

      <motion.div
        className="about-scope"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      >
        {FOUNDER_SCOPE.map(([title, description]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </motion.div>

      <div className="about-history">
        {HISTORY.map(([year, role, company]) => (
          <div key={role}>
            <time>{year}</time>
            <h3>{role}</h3>
            <span>{company === 'Semantics' ? <SemanticsLink /> : company}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
