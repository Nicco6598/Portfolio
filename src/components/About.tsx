const ABOUT_TEXT = `Full-Stack Software Developer with hands-on experience building modern, performant web applications using React, Vite, Next.js, and Node.js. Capable of delivering end-to-end solutions — from custom admin panels and relational databases (PostgreSQL) to backend systems with AI integration and Web3 architectures. Strong focus on clean code, type safety, and scalable development.

Currently working as a Freelance Full-Stack Developer, handling complete rebuilds of corporate websites with React + Vite, achieving Lighthouse scores of 95+. Building custom admin panels with full CRUD functionality for content management, job postings, and team profiles. Architecting full-stack apps with Next.js App Router and Server Actions, using PostgreSQL via Drizzle ORM with type-safe queries, data validation with Zod, and React Hook Form.

Previously at Capgemini Engineering as Associate Product Software Engineer, where I built responsive interfaces for a blockchain mobility dApp using React, TypeScript, and Tailwind CSS, optimizing Core Web Vitals and integrating OpenSea APIs to reduce load times by 20%.`;

const SKILLS = [
  'React', 'Next.js', 'Vite', 'TypeScript', 'JavaScript',
  'Tailwind CSS', 'Zustand', 'Shadcn/ui', 'Node.js', 'Express',
  'PostgreSQL', 'Drizzle ORM', 'REST APIs', 'Python', 'Zod',
  'Solidity', 'Hardhat', 'Ethers.js', 'Web3.js', 'Git'
];

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-6 md:px-12"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="max-w-7xl mx-auto">
        <span
          className="font-mono text-[11px] uppercase tracking-widest block mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          About
        </span>
        <h2
          className="font-serif-display text-[clamp(32px,5vw,56px)] mb-8"
          style={{ color: 'var(--color-text-primary)' }}
        >
          A bit about me
        </h2>
        <div className="space-y-6 mb-10">
          {ABOUT_TEXT.split('\n\n').map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
