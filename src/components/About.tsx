const ABOUT_TEXT = `I'm a passionate developer with over 5 years of experience creating digital products that make a difference. My journey began with a fascination for how technology can simplify complex problems, and it has evolved into a career dedicated to crafting beautiful, functional applications.

I specialize in iOS development using Swift and SwiftUI, but I'm also comfortable working with React, TypeScript, and Node.js on full-stack projects. I believe in writing clean, maintainable code and creating user experiences that feel intuitive.

When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or enjoying the vibrant tech scene in Milan.`;

const SKILLS = [
  'Swift', 'SwiftUI', 'iOS', 'React', 'TypeScript', 
  'Node.js', 'PostgreSQL', 'Firebase', 'Figma', 'Git'
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
