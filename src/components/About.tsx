import { Dumbbell, Monitor, Code, Coffee, type LucideIcon } from 'lucide-react';
import { personal, aboutFacts } from '@/data/portfolio';
import { Reveal, SectionLabel } from './Primitives';

const iconMap: Record<string, LucideIcon> = {
  dumbbell: Dumbbell,
  monitor: Monitor,
  code: Code,
  coffee: Coffee,
};

export function About() {
  return (
    <section id="about" className="py-24 md:py-40">
      <div className="mx-auto max-w-content w-full px-6 md:px-10">
        <SectionLabel number="01" title="About" />

        <div className="max-w-reading">
          <Reveal>
            <p className="text-xl md:text-2xl leading-relaxed text-neutral-700 dark:text-neutral-300 font-light text-balance">
              {personal.bio}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-16 md:mt-24 flex flex-wrap gap-6 md:gap-10">
            {aboutFacts.map((fact) => {
              const Icon = iconMap[fact.icon];
              return (
                <div
                  key={fact.label}
                  className="flex items-center gap-2.5 text-sm text-neutral-400 dark:text-neutral-600"
                >
                  <Icon size={16} className="text-accent" strokeWidth={1.5} />
                  <span>{fact.label}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
