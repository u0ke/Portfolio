import { Github, ArrowUpRight } from 'lucide-react';
import { personal } from '@/data/portfolio';
import { Reveal, SectionLabel } from './Primitives';

export function GitHub() {
  return (
    <section id="github" className="py-24 md:py-40 border-t border-neutral-200/60 dark:border-neutral-800/60">
      <div className="mx-auto max-w-content w-full px-6 md:px-10">
        <SectionLabel number="05" title="GitHub" />

        <Reveal>
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group block max-w-reading"
          >
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 md:p-10 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Github size={22} className="text-neutral-600 dark:text-neutral-400" strokeWidth={1.5} />
                  <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400">
                    @{personal.githubHandle}
                  </span>
                </div>
                <ArrowUpRight
                  size={20}
                  className="text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                />
              </div>

              <p className="text-lg text-neutral-700 dark:text-neutral-300 font-light leading-relaxed mb-6">
                GitHub is a core part of my development journey — where I experiment, build,
                and iterate on projects. Follow along to see what I'm working on.
              </p>

              <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 dark:text-neutral-600">
                <span>View profile</span>
                <span className="h-px w-8 bg-neutral-200 dark:bg-neutral-800" />
                <span>{personal.github}</span>
              </div>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
