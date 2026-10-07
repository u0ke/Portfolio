import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { personal } from '@/data/portfolio';

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-24 pb-20">
      <div className="mx-auto max-w-content w-full px-6 md:px-10">
        <div className="max-w-reading">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="font-mono text-xs text-neutral-400 dark:text-neutral-600 tracking-wider mb-6">
              {personal.heroIntro}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="text-hero font-medium text-neutral-900 dark:text-neutral-50"
          >
            {personal.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="mt-8 text-lg md:text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed text-balance"
          >
            {personal.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-neutral-400 dark:text-neutral-600"
          >
            {personal.heroMeta.map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                {i === 0 && <MapPin size={12} />}
                {item}
                {i < personal.heroMeta.length - 1 && (
                  <span className="ml-4 text-neutral-300 dark:text-neutral-800">/</span>
                )}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: [0.4, 0, 0.2, 1] }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 text-sm font-medium rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors duration-200"
            >
              View my work
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm font-medium rounded-md hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-200"
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
