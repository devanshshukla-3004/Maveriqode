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
import {
  NavSectionId,
  PRIMARY_NAV_ITEMS,
  ServiceOption,
} from './data/maveriqodeData';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [selectedService, setSelectedService] = useState<ServiceOption>(
    'Web & App Development'
  );
  const [contextNote, setContextNote] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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
    const sectionElements = PRIMARY_NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id as NavSectionId);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#070709] text-[#F5F5F7]">
        <ScrollProgressBar />
        <Navbar activeSection={activeSection} onNavigate={navigateToSection} />

        <main>
          <HeroWorkbench onNavigate={navigateToSection} />
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

        <BackToTopButton onScrollTop={() => setActiveSection('home')} />
        <ToastNotification toast={toast} onDismiss={dismissToast} />
        <CustomCursor />
      </div>
    </MotionConfig>
  );
}
