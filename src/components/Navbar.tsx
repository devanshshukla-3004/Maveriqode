import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PRIMARY_NAV_ITEMS, NavSectionId } from '../data/maveriqodeData';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (id: NavSectionId) => void;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--mq-bg)]/85 backdrop-blur-xl border-b border-[var(--mq-border)] transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-[68px] flex items-center justify-between gap-8">
        {/* Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleSelect('home');
          }}
          className="inline-flex items-center gap-3 text-white font-display font-extrabold tracking-[0.14em] text-sm sm:text-[15px] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-md py-1"
        >
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-lg border border-[#8B5CF6]/45 bg-[#7C3AED]/15 flex items-center justify-center shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 7L3 12L8 17M16 7L21 12L16 17M13.5 5L10.5 19"
                stroke="url(#mq-nav-grad)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="mq-nav-grad" x1="3" y1="5" x2="21" y2="19" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A855F7" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span>MAVERIQODE</span>
        </a>

        {/* Primary Desktop Navigation: Exact 6 labels in exact order */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7 lg:gap-9">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded ${
                  isActive
                    ? 'text-[#E9D5FF]'
                    : 'text-[var(--mq-muted)] hover:text-white'
                }`}
              >
                <span>{item.label}</span>

                {/* Subtle hover preview underline for inactive links */}
                {!isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-white/25 scale-x-0 origin-left transition-transform duration-200 ease-out group-hover:scale-x-100"
                  />
                )}

                {/* Shared-element sliding gradient underline for active link */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-underline"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-[#A855F7] to-[#3B82F6] shadow-[0_0_12px_rgba(139,92,246,0.65)]"
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
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-white/10 bg-white/[0.03] text-white hover:border-[#8B5CF6]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-[var(--mq-border)] bg-[var(--mq-bg-elevated)]/98 backdrop-blur-2xl px-5 py-4"
          >
            <div className="flex flex-col gap-1">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(item.id);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`min-h-[44px] px-3 rounded-lg flex items-center justify-between text-base font-medium whitespace-nowrap transition-colors duration-150 ${
                      isActive
                        ? 'bg-white/[0.07] text-[#E9D5FF]'
                        : 'text-[var(--mq-muted)] hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="navbar-mobile-indicator"
                        aria-hidden="true"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="w-6 h-[2px] rounded-full bg-gradient-to-r from-[#A855F7] to-[#3B82F6]"
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
