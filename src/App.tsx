import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroWorkbench } from './components/HeroWorkbench';
import { CompanySection } from './components/CompanySection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { SolutionsSection } from './components/SolutionsSection';
import { WorkSection } from './components/WorkSection';
import { ContactFooter } from './components/ContactFooter';
import { BackToTopButton } from './components/BackToTopButton';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ToastMessage, ToastNotification } from './components/ToastNotification';
import { SectionDivider } from './components/SectionDivider';
import { ThemeToggle, ThemeTone } from './components/ThemeToggle';
import {
  NavSectionId,
  PRIMARY_NAV_ITEMS,
  ServiceOption,
} from './data/maveriqodeData';
import { useSectionMeta } from './utils/seoMeta';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [selectedService, setSelectedService] = useState<ServiceOption>(
    'Web & App Development'
  );
  const [contextNote, setContextNote] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [theme, setTheme] = useState<ThemeTone>(() => {
    if (typeof window === 'undefined') return 'obsidian';
    return window.localStorage.getItem('mq-theme') === 'slate' ? 'slate' : 'obsidian';
  });
  const nameInputRef = useRef<HTMLInputElement>(null);

  useSectionMeta(activeSection);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'slate') {
      root.setAttribute('data-theme', 'slate');
    } else {
      root.removeAttribute('data-theme');
    }
    try {
      window.localStorage.setItem('mq-theme', theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'obsidian' ? 'slate' : 'obsidian'));
  }, []);

  const showToast = useCallback((title: string, description: string) => {
    setToast({ id: Date.now(), title, description });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const navigateToSection = useCallback((id: NavSectionId) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        const el = document.getElementById(item.id);
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

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[var(--mq-bg)] text-[var(--mq-text)] transition-colors duration-200">
        <ScrollProgressBar />
        <Navbar activeSection={activeSection} onNavigate={navigateToSection} />

        <main>
          <HeroWorkbench onNavigate={navigateToSection} theme={theme} />
          <SectionDivider />
          <CompanySection />
          <SectionDivider />
          <CapabilitiesSection onRequestService={handleRequestWithService} />
          <SectionDivider />
          <SolutionsSection onSelectSolution={handleRequestWithService} />
          <SectionDivider />
          <WorkSection onRequestSimilar={handleRequestWithService} />
        </main>

        <SectionDivider />

        <ContactFooter
          selectedService={selectedService}
          onServiceChange={setSelectedService}
          contextNote={contextNote}
          onContextNoteChange={setContextNote}
          nameInputRef={nameInputRef}
          onNavigate={navigateToSection}
          onNotify={showToast}
        />

        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <BackToTopButton onScrollTop={() => setActiveSection('home')} />
        <ToastNotification toast={toast} onDismiss={dismissToast} />
        <CustomCursor />
      </div>
    </MotionConfig>
  );
}
