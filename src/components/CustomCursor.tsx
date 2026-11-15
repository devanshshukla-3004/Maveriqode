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

    const scheduleTick = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const updateVisualState = () => {
      if (!isVisible || isOverPill) {
        el.style.opacity = '0';
        return;
      }

      el.style.opacity = '1';

      if (isPressed) {
        targetScale = isInteractive ? 1.4 : 0.85;
      } else if (isInteractive) {
        targetScale = 1.75;
      } else {
        targetScale = 1;
      }

      if (isInteractive) {
        el.style.borderColor = 'rgba(161, 0, 255, 0.82)';
        el.style.backgroundColor = 'rgba(161, 0, 255, 0.12)';
      } else {
        el.style.borderColor = 'rgba(236, 235, 230, 0.34)';
        el.style.backgroundColor = 'rgba(42, 0, 200, 0.05)';
      }

      scheduleTick();
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
      rafId = 0;
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;
      currentScale += (targetScale - currentScale) * 0.22;

      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${currentScale.toFixed(3)})`;

      const settled =
        Math.abs(targetX - currentX) < 0.08 &&
        Math.abs(targetY - currentY) < 0.08 &&
        Math.abs(targetScale - currentScale) < 0.004;

      if (!settled && isVisible) {
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
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
