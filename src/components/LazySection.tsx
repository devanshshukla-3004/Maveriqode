import { ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { NavSectionId } from '../data/maveriqodeData';

interface LazySectionProps {
  sectionId: NavSectionId;
  forceMount?: boolean;
  minHeightPx?: number;
  children: ReactNode;
}

function SectionFallback({ minHeightPx }: { minHeightPx: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading section"
      style={{ minHeight: `${minHeightPx}px` }}
      className="w-full py-24 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)]"
    />
  );
}

export function LazySection({
  sectionId,
  forceMount = false,
  minHeightPx = 420,
  children,
}: LazySectionProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hasEnteredNearViewport, setHasEnteredNearViewport] = useState(forceMount);

  useEffect(() => {
    if (forceMount) {
      setHasEnteredNearViewport(true);
    }
  }, [forceMount]);

  useEffect(() => {
    if (hasEnteredNearViewport) return;
    const host = hostRef.current;
    if (!host) return;

    if (typeof IntersectionObserver === 'undefined') {
      setHasEnteredNearViewport(true);
      return;
    }

    // Mount immediately if section is already within 500px of initial viewport
    const rect = host.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 500 && rect.bottom >= -500) {
      setHasEnteredNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setHasEnteredNearViewport(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '500px 0px',
        threshold: 0,
      }
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [hasEnteredNearViewport]);

  return (
    <div
      ref={hostRef}
      data-section-host={sectionId}
      className="scroll-mt-20"
    >
      {hasEnteredNearViewport ? (
        <Suspense fallback={<SectionFallback minHeightPx={minHeightPx} />}>
          {children}
        </Suspense>
      ) : (
        <SectionFallback minHeightPx={minHeightPx} />
      )}
    </div>
  );
}
