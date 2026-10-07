import { useState } from 'react';
import { Mail, Github, Linkedin, Copy, Check, ArrowUpRight } from 'lucide-react';
import { personal } from '@/data/portfolio';
import { Reveal, SectionLabel } from './Primitives';

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback - select text
    }
  };

  return (
    <section id="contact" className="py-24 md:py-40 border-t border-neutral-200/60 dark:border-neutral-800/60">
      <div className="mx-auto max-w-content w-full px-6 md:px-10">
        <SectionLabel number="06" title="Contact" />

        <div className="max-w-reading">
          <Reveal>
            <h2 className="text-section font-medium text-neutral-900 dark:text-neutral-50 mb-6 text-balance">
              Get in Touch
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-12 text-balance">
              Have a project, idea, or opportunity? Let's talk.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mb-12">
              <button
                onClick={copyEmail}
                className="group inline-flex items-center gap-3 text-2xl md:text-4xl font-light text-neutral-900 dark:text-neutral-100 hover:text-accent transition-colors duration-200"
              >
                <Mail size={22} className="text-accent" strokeWidth={1.5} />
                <span className="text-left break-all">{personal.email}</span>
                <span className="ml-2 inline-flex">
                  {copied ? (
                    <Check size={18} className="text-accent" />
                  ) : (
                    <Copy size={18} className="text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 transition-colors" />
                  )}
                </span>
              </button>
              {copied && (
                <p className="mt-3 text-xs font-mono text-accent ml-9">Copied to clipboard</p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex gap-3">
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
              >
                <Github size={15} />
                GitHub
                <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all"
              >
                <Linkedin size={15} />
                LinkedIn
                <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
