import { lazy, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroWorkbench } from './components/HeroWorkbench';
import { ContactFooter } from './components/ContactFooter';
import { BackToTopButton } from './components/BackToTopButton';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ToastMessage, ToastNotification } from './components/ToastNotification';
import { SectionDivider } from './components/SectionDivider';
import { ThemeTone } from './components/ThemeToggle';
import { LazySection } from './components/LazySection';
import { ManagedPageSection } from './components/ManagedPageSection';
import {
  NavSectionId,
  PRIMARY_NAV_ITEMS,
  ServiceOption,
} from './data/maveriqodeData';
import { useSectionMeta } from './utils/seoMeta';
import { MQ_EASE, SECTION_VIEWPORT } from './utils/motionVariants';

const CompanySection = lazy(() =>
  import('./components/CompanySection').then((m) => ({ default: m.CompanySection }))
);
const CapabilitiesSection = lazy(() =>
  import('./components/CapabilitiesSection').then((m) => ({ default: m.CapabilitiesSection }))
);
const SolutionsSection = lazy(() =>
  import('./components/SolutionsSection').then((m) => ({ default: m.SolutionsSection }))
);
const WorkSection = lazy(() =>
  import('./components/WorkSection').then((m) => ({ default: m.WorkSection }))
);

const GLOBAL_SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: MQ_EASE,
    },
  },
};

function GlobalSectionReveal({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      variants={GLOBAL_SECTION_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={SECTION_VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

function getSectionTargetElement(id: NavSectionId): HTMLElement | null {
  return (
    document.getElementById(id) ??
    document.querySelector<HTMLElement>(`[data-section-host="${id}"]`)
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [selectedService, setSelectedService] = useState<ServiceOption>(
    'Software Engineering'
  );
  const [contextNote, setContextNote] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [forcedSections, setForcedSections] = useState<Partial<Record<NavSectionId, boolean>>>(() => {
    if (typeof window === 'undefined') return {};
    const hash = window.location.hash.replace('#', '') as NavSectionId;
    return hash ? { [hash]: true } : {};
  });
  const theme: ThemeTone = 'obsidian';
  const nameInputRef = useRef<HTMLInputElement>(null);
  const activeSectionRef = useRef<NavSectionId>(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useSectionMeta(activeSection);

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme');
    try {
      window.localStorage.removeItem('mq-theme');
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const showToast = useCallback((title: string, description: string) => {
    setToast({ id: Date.now(), title, description });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const navigateToSection = useCallback((id: NavSectionId) => {
    setForcedSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    const el = getSectionTargetElement(id);
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    el.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    setActiveSection(id);
  }, []);

  const handleRequestWithService = useCallback(
    (service: ServiceOption, note?: string) => {
      setSelectedService(service);
      if (note) setContextNote(note);
      navigateToSection('contact');
      window.setTimeout(() => {
        nameInputRef.current?.focus({ preventScroll: true });
      }, 450);
    },
    [navigateToSection]
  );

  useEffect(() => {
    const updateActiveSection = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= docHeight - 60) {
        setActiveSection('contact');
        return;
      }

      const anchorY = window.innerHeight * 0.32;
      let current: NavSectionId = 'home';

      for (const item of PRIMARY_NAV_ITEMS) {
        const el = getSectionTargetElement(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= anchorY) {
          current = item.id;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement | null;
      const isEditable =
        Boolean(target?.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')) ||
        Boolean(target?.isContentEditable);

      if (isEditable) return;

      const activeEl = document.activeElement;
      const isBodyFocused =
        activeEl === document.body ||
        activeEl === document.documentElement ||
        activeEl === null;

      if (!isBodyFocused) return;

      const currentIndex = PRIMARY_NAV_ITEMS.findIndex(
        (item) => item.id === activeSectionRef.current
      );
      if (currentIndex === -1) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const nextIndex = Math.min(PRIMARY_NAV_ITEMS.length - 1, currentIndex + 1);
        if (nextIndex !== currentIndex) {
          e.preventDefault();
          navigateToSection(PRIMARY_NAV_ITEMS[nextIndex].id);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const prevIndex = Math.max(0, currentIndex - 1);
        if (prevIndex !== currentIndex) {
          e.preventDefault();
          navigateToSection(PRIMARY_NAV_ITEMS[prevIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateToSection]);

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="min-h-screen bg-[var(--mq-bg)] text-[var(--mq-text)] transition-colors duration-200">
        <ScrollProgressBar />
        <Navbar activeSection={activeSection} onNavigate={navigateToSection} />

        <main>
          <HeroWorkbench onNavigate={navigateToSection} theme={theme} />
          <SectionDivider />
          <SectionDivider />
          <LazySection
            sectionId="solutions"
            forceMount={Boolean(forcedSections.solutions)}
            minHeightPx={680}
          >
            <GlobalSectionReveal>
              <SolutionsSection onSelectSolution={handleRequestWithService} />
            </GlobalSectionReveal>
          </LazySection>
          <SectionDivider />
          <LazySection
            sectionId="capabilities"
            forceMount={Boolean(forcedSections.capabilities)}
            minHeightPx={780}
          >
            <GlobalSectionReveal>
              <CapabilitiesSection onRequestService={handleRequestWithService} />
            </GlobalSectionReveal>
          </LazySection>
          <SectionDivider />
          <LazySection
            sectionId="work"
            forceMount={Boolean(forcedSections.work)}
            minHeightPx={520}
          >
            <GlobalSectionReveal>
              <WorkSection onRequestSimilar={handleRequestWithService} />
            </GlobalSectionReveal>
          </LazySection>
          <SectionDivider />
          <LazySection
            sectionId="company"
            forceMount={Boolean(forcedSections.company)}
            minHeightPx={760}
          >
            <GlobalSectionReveal>
              <ManagedPageSection slug="company"><CompanySection onNotify={showToast} /></ManagedPageSection>
            </GlobalSectionReveal>
          </LazySection>
        </main>

        <SectionDivider />

        <GlobalSectionReveal>
          <ContactFooter
            selectedService={selectedService}
            onServiceChange={setSelectedService}
            contextNote={contextNote}
            onContextNoteChange={setContextNote}
            nameInputRef={nameInputRef}
            onNavigate={navigateToSection}
            onNotify={showToast}
          />
        </GlobalSectionReveal>

        <BackToTopButton onScrollTop={() => setActiveSection('home')} />
        <ToastNotification toast={toast} onDismiss={dismissToast} />
        <CustomCursor />
      </div>
    </MotionConfig>
  );
}
