import { skills } from '@/data/portfolio';
import { Reveal, SectionLabel } from './Primitives';

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-40 border-t border-neutral-200/60 dark:border-neutral-800/60">
      <div className="mx-auto max-w-content w-full px-6 md:px-10">
        <SectionLabel number="02" title="Skills" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <Reveal>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-500 mb-8">
                Core
              </h3>
              <ul className="space-y-3">
                {skills.core.map((skill, i) => (
                  <li
                    key={skill}
                    className="flex items-baseline gap-4 text-lg text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="font-mono text-xs text-neutral-300 dark:text-neutral-700 w-6">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-light">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-500 mb-8">
                Supporting
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {skills.supporting.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block px-3.5 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-md font-light"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
