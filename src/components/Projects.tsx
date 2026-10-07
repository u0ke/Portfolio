import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { projects, type Project } from '@/data/portfolio';
import { Reveal, SectionLabel } from './Primitives';

const filters = ['All', '2025'] as const;
type Filter = (typeof filters)[number];

function ProjectPreview({ project }: { project: Project }) {
  const gradients: Record<string, string> = {
    'quiz-app': 'from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800',
    'task-flow': 'from-neutral-100 to-neutral-300 dark:from-neutral-900 dark:to-neutral-700',
    'ice-portfolio': 'from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800',
  };

  const icons: Record<string, string> = {
    'quiz-app': '?',
    'task-flow': '~',
    'ice-portfolio': 'ice',
  };

  return (
    <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${gradients[project.image]} aspect-[16/10]`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-6xl md:text-7xl font-light text-neutral-300 dark:text-neutral-700 select-none">
          {icons[project.image]}
        </span>
      </div>
      <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 dark:group-hover:bg-neutral-900/20 transition-colors duration-300" />
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className="group"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 border-t border-neutral-200/60 dark:border-neutral-800/60 first:border-t-0">
        {/* Preview */}
        <div className="md:col-span-5">
          <div className="overflow-hidden rounded-lg">
            <div className="group-hover:scale-[1.02] transition-transform duration-500 ease-smooth">
              <ProjectPreview project={project} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs text-neutral-400 dark:text-neutral-600">
                {project.year}
              </span>
              <span className="h-px w-8 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <h3 className="text-2xl md:text-3xl font-medium text-neutral-900 dark:text-neutral-100 mb-4">
              {project.name}
            </h3>

            <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-reading mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2.5 py-1 text-neutral-500 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-900 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-5">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Live demo
              <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Source
              <Github size={14} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.year === filter);

  return (
    <section id="projects" className="py-24 md:py-40 border-t border-neutral-200/60 dark:border-neutral-800/60">
      <div className="mx-auto max-w-content w-full px-6 md:px-10">
        <SectionLabel number="03" title="Selected Work" />

        <Reveal>
          <div className="flex items-center gap-1 mb-8">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                  filter === f
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950'
                    : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <div>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectRow key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
