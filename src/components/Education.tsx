import { GraduationCap, MapPin } from 'lucide-react';
import { education } from '@/data/portfolio';
import { Reveal, SectionLabel } from './Primitives';

export function Education() {
  return (
    <section id="education" className="py-24 md:py-40 border-t border-neutral-200/60 dark:border-neutral-800/60">
      <div className="mx-auto max-w-content w-full px-6 md:px-10">
        <SectionLabel number="04" title="Education" />

        <Reveal>
          <div className="max-w-reading">
            <div className="flex items-start gap-5 py-2">
              <div className="mt-1">
                <GraduationCap size={22} className="text-accent" strokeWidth={1.5} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-neutral-400 dark:text-neutral-600">
                    {education.period}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono text-accent border border-accent/30 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    {education.status}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  {education.institution}
                </h3>

                <p className="text-lg text-neutral-500 dark:text-neutral-400 font-light mb-3">
                  {education.program}
                </p>

                <div className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-600">
                  <MapPin size={14} />
                  {education.location}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
