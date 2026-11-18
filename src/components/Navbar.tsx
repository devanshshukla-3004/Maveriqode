import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PRIMARY_NAV_ITEMS, NavSectionId } from '../data/maveriqodeData';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (id: NavSectionId) => void;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (id: NavSectionId) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-[var(--mq-border)] transition-[background-color,box-shadow,border-color] duration-200 ${
        isScrolled
          ? 'bg-[var(--mq-bg)]/94 shadow-[0_10px_30px_rgba(0,0,0,0.45)]'
          : 'bg-[var(--mq-bg)]/84'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-[68px] flex items-center justify-between gap-8">
        {/* Official Brand Lockup */}
        <motion.a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleSelect('home');
          }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 text-[var(--mq-text)] font-display font-extrabold tracking-[0.16em] text-sm sm:text-[15px] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff] rounded py-1"
        >
          <img
            src="/assets/aistudio/MAVERIQODE_symbol_only_transparent_149367a9.png"
            alt="MAVERIQODE symbol"
            referrerPolicy="no-referrer"
            className="h-5 sm:h-6 w-auto object-contain shrink-0 select-none"
          />
          <span>MAVERIQODE</span>
        </motion.a>

        {/* Primary Desktop Navigation: Exact 6 labels in exact order */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7 lg:gap-9">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.id === 'solutions' ? '/services' : item.id === 'work' ? '/work' : `#${item.id}`}
                onClick={(e) => {
                  if (item.id === 'solutions' || item.id === 'work') { setMobileOpen(false); return; }
                  e.preventDefault();
                  handleSelect(item.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff] rounded ${
                  isActive
                    ? 'text-[var(--mq-text)]'
                    : 'text-[var(--mq-muted)] hover:text-[var(--mq-text)]'
                }`}
              >
                <span>{item.label}</span>

                {!isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-[var(--mq-text)]/25 scale-x-0 origin-left transition-transform duration-200 ease-out group-hover:scale-x-100"
                  />
                )}

                {isActive && (
                  <motion.span
                    layoutId={shouldReduceMotion ? undefined : 'navbar-active-underline'}
                    aria-hidden="true"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 420, damping: 34 }
                    }
                    className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-[#a100ff] to-[#2a00c8]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-primary-nav"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[var(--mq-border)] bg-[var(--mq-surface)]/80 text-[var(--mq-text)] hover:border-[#a100ff]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Consistent Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-primary-nav"
            aria-label="Mobile Navigation"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
            }
            className="md:hidden border-t border-[var(--mq-border)] bg-[var(--mq-bg-elevated)]/98 backdrop-blur-2xl px-5 py-4"
          >
            <div className="flex flex-col gap-1">
              {PRIMARY_NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.a
                    key={item.id}
                    href={item.id === 'solutions' ? '/services' : `#${item.id}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: 0.2, delay: idx * 0.035, ease: [0.16, 1, 0.3, 1] }
                    }
                    onClick={(e) => {
                      if (item.id === 'solutions') { setMobileOpen(false); return; }
                      e.preventDefault();
                      handleSelect(item.id);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`min-h-[44px] px-3 rounded-lg flex items-center justify-between text-base font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff] ${
                      isActive
                        ? 'bg-[var(--mq-surface)] text-[var(--mq-text)]'
                        : 'text-[var(--mq-muted)] hover:text-[var(--mq-text)] hover:bg-[var(--mq-surface)]/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId={shouldReduceMotion ? undefined : 'navbar-mobile-indicator'}
                        aria-hidden="true"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 420, damping: 34 }
                        }
                        className="w-6 h-[2px] rounded-full bg-gradient-to-r from-[#a100ff] to-[#2a00c8]"
                      />
                    )}
                  </motion.a>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
