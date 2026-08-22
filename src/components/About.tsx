import { motion } from 'framer-motion';
import { SEMANTICS_URL } from '../config/site';

const HISTORY = [
  ['2026—', 'Founder & CEO', 'Semantics'],
  ['2024—26', 'Independent developer', 'Product and client work'],
  ['Previously', 'Software engineer', 'Capgemini Engineering'],
];

export default function About() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <motion.div
        className="about-copy"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 id="about-title">Close to the work.<br /><em>Close to the code.</em></h2>
        <div>
          <p>
            I started at Capgemini Engineering, moved into independent product work and founded <a href={SEMANTICS_URL} target="_blank" rel="noopener noreferrer">Semantics</a> in 2026. I still design and build the products I lead.
          </p>
        </div>
      </motion.div>

      <div className="about-history">
        {HISTORY.map(([year, role, company]) => (
          <div key={role}>
            <time>{year}</time>
            <h3>{role}</h3>
            <span>{company}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
