import { useEffect, useRef, useState } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, [role="button"], [data-cursor-interactive="true"]';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluateCapability = () => {
      setEnabled(finePointer.matches && !reducedMotion.matches);
    };

    evaluateCapability();
    finePointer.addEventListener('change', evaluateCapability);
    reducedMotion.addEventListener('change', evaluateCapability);

    return () => {
      finePointer.removeEventListener('change', evaluateCapability);
      reducedMotion.removeEventListener('change', evaluateCapability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ringRef.current;
    if (!el) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let currentScale = 1;
    let targetScale = 1;
    let isVisible = false;
    let isOverPill = false;
    let isPressed = false;
    let isInteractive = false;
    let rafId = 0;

    const updateVisualState = () => {
      if (!isVisible || isOverPill) {
        el.style.opacity = '0';
        return;
      }

      el.style.opacity = '1';

      if (isPressed) {
        targetScale = isInteractive ? 1.45 : 0.85;
      } else if (isInteractive) {
        targetScale = 1.85;
      } else {
        targetScale = 1;
      }

      if (isInteractive) {
        el.style.borderColor = 'rgba(139, 92, 246, 0.85)';
        el.style.backgroundColor = 'rgba(124, 58, 237, 0.14)';
      } else {
        el.style.borderColor = 'rgba(255, 255, 255, 0.32)';
        el.style.backgroundColor = 'rgba(124, 58, 237, 0.04)';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        currentX = targetX;
        currentY = targetY;
        isVisible = true;
      }

      const target = e.target as Element | null;
      isOverPill = Boolean(target?.closest('[data-cursor-pill="true"]'));
      isInteractive = Boolean(target?.closest(INTERACTIVE_SELECTOR));
      updateVisualState();
    };

    const handleMouseDown = () => {
      isPressed = true;
      updateVisualState();
    };

    const handleMouseUp = () => {
      isPressed = false;
      updateVisualState();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      updateVisualState();
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      currentScale += (targetScale - currentScale) * 0.2;

      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${currentScale.toFixed(3)})`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-5 h-5 rounded-full border pointer-events-none z-[90] opacity-0 transition-[opacity,border-color,background-color] duration-150 ease-out will-change-transform"
    />
  );
}
