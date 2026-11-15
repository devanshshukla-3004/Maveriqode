import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopButtonProps {
  onScrollTop?: () => void;
}

export function BackToTopButton({ onScrollTop }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById('home');
    if (!heroEl) return;

    const updateVisibility = () => {
      const rect = heroEl.getBoundingClientRect();
      setVisible(rect.bottom <= 80);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      {
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0,
      }
    );

    observer.observe(heroEl);
    updateVisibility();

    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    onScrollTop?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-5 sm:right-8 z-40 w-11 h-11 rounded-xl bg-[#0E0E13]/90 backdrop-blur-md border border-white/12 text-[#A1A1AA] hover:text-white hover:border-[#8B5CF6]/60 shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex items-center justify-center transition-[opacity,transform,border-color,color] duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}
