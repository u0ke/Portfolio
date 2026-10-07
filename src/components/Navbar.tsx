import { useEffect, useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { navLinks, personal } from '@/data/portfolio';
import { useTheme } from '@/hooks/useTheme';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(['about', 'skills', 'projects', 'education', 'contact']);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const linkClasses = (href: string) =>
    `text-sm transition-colors duration-200 ${
      activeId === href.slice(1)
        ? 'text-neutral-900 dark:text-neutral-100'
        : 'text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-200'
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="mx-auto max-w-content px-6 md:px-10">
          <div className="flex h-16 items-center justify-between">
            <a
              href="#top"
              className="font-mono text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:text-accent transition-colors"
            >
              {personal.nickname}
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className={linkClasses(link.href)}>
                  {link.label}
                </a>
              ))}
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="text-neutral-600 dark:text-neutral-400"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden bg-white dark:bg-neutral-950">
          <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800">
            <span className="font-mono text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {personal.nickname}
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="text-neutral-600 dark:text-neutral-400"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col px-6 pt-12 gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-medium text-neutral-900 dark:text-neutral-100"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
