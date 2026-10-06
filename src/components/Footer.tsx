import { Github, Linkedin, Mail } from 'lucide-react';
import { personal } from '@/data/portfolio';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/60 dark:border-neutral-800/60">
      <div className="mx-auto max-w-content w-full px-6 md:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              &copy; 2026 {personal.name} — {personal.nickname}
            </p>
            <p className="mt-1 font-mono text-xs text-neutral-400 dark:text-neutral-600">
              {personal.location}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <Github size={17} />
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <Linkedin size={17} />
            </a>
            <a
              href={`mailto:${personal.email}`}
              aria-label="Email"
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <Mail size={17} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
