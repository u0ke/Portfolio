import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface SectionLabelProps {
  number: string;
  title: string;
}

export function SectionLabel({ number, title }: SectionLabelProps) {
  return (
    <div className="flex items-baseline gap-4 mb-12 md:mb-20">
      <span className="font-mono text-xs text-neutral-400 dark:text-neutral-600 tracking-wider">
        {number}
      </span>
      <span className="h-px flex-1 max-w-[40px] bg-neutral-200 dark:bg-neutral-800" />
      <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
        {title}
      </h2>
    </div>
  );
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
