const ABOUT_TEXT = `Full-Stack Software Developer with hands-on experience building modern, performant web applications using React, Vite, Next.js, and Node.js. Capable of delivering end-to-end solutions — from custom admin panels and relational databases (PostgreSQL) to backend systems with AI integration and Web3 architectures. Strong focus on clean code, type safety, and scalable development.

Currently working as a Freelance Full-Stack Developer, handling complete rebuilds of corporate websites with React + Vite, achieving Lighthouse scores of 95+. Building custom admin panels with full CRUD functionality for content management, job postings, and team profiles. Architecting full-stack apps with Next.js App Router and Server Actions, using PostgreSQL via Drizzle ORM with type-safe queries, data validation with Zod, and React Hook Form.

Previously at Capgemini Engineering as Associate Product Software Engineer, where I built responsive interfaces for a blockchain mobility dApp using React, TypeScript, and Tailwind CSS, optimizing Core Web Vitals and integrating OpenSea APIs to reduce load times by 20%.`;
const ABOUT_PARAGRAPHS = ABOUT_TEXT.split('\n\n');

const ABOUT_HIGHLIGHTS = [
  {
    label: 'Current role',
    value: 'Freelance Full-Stack Developer',
  },
  {
    label: 'Previous role',
    value: 'Associate Product Software Engineer at Capgemini Engineering',
  },
  {
    label: 'Core stack',
    value: 'React, Next.js, Vite, Node.js, TypeScript, PostgreSQL',
  },
];

const FOCUS_AREAS = [
  'Corporate website rebuilds with stronger performance and clearer UX',
  'Custom admin panels with CRUD workflows and structured content management',
  'Full-stack React and Next.js products with relational data and type-safe APIs',
  'Projects that mix frontend polish, backend structure, and long-term maintainability',
];

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

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:gap-14">
          <div>
            <div className="space-y-6 mb-10">
              {ABOUT_PARAGRAPHS.map((paragraph, index) => (
                <p
                  key={index}
                  className="max-w-3xl text-base leading-relaxed md:text-[17px]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:pt-1">
            <div>
              <span
                className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-accent)' }}
              >
                Snapshot
              </span>

              <div className="space-y-5">
                {ABOUT_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.label}
                    className="border-b pb-5 last:border-b-0 last:pb-0"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
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
            </div>

            <div>
              <span
                className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-accent)' }}
              >
                What I usually work on
              </span>

              <div className="space-y-4">
                {FOCUS_AREAS.map((item, index) => (
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
        </div>

        <div className="mt-12">
          <span
            className="mb-4 block font-mono text-[11px] uppercase tracking-[0.24em]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Stack & tools
          </span>
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
      </div>
    </section>
  );
}
