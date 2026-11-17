import { useEffect, useRef } from 'react';
import { ArrowRight, Move } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { NavSectionId } from '../data/maveriqodeData';
import { EditorialSerifAccent } from './EditorialSerifAccent';
import { ThemeTone } from './ThemeToggle';

interface HeroWorkbenchProps {
  onNavigate: (id: NavSectionId) => void;
  theme: ThemeTone;
}

interface PhysicsNode {
  title: string;
  sub: string;
  r: number;
  primary: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const NODE_DEFS = [
  { title: 'MAVERIQODE', sub: 'Core Atelier', r: 54, primary: true },
  { title: 'SOFTWARE', sub: 'Engineering', r: 42, primary: false },
  { title: 'AI SYSTEMS', sub: 'Intelligence', r: 42, primary: false },
  { title: 'AUTOMATION', sub: 'Integration', r: 42, primary: false },
  { title: 'SECURITY', sub: 'Hardening', r: 40, primary: false },
  { title: 'INFRA', sub: 'Cloud Fabric', r: 40, primary: false },
];

export function HeroWorkbench({ onNavigate, theme }: HeroWorkbenchProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef<ThemeTone>(theme);
  const redrawRef = useRef<(() => void) | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    themeRef.current = theme;
    redrawRef.current?.();
  }, [theme]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  const glowY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.95, 0.2]);

  const canvasY = useTransform(scrollYProgress, [0, 1], [0, 75]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = sectionRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionMedia.matches;
    let width = container.clientWidth;
    let height = container.clientHeight;
    let animationId = 0;
    const initialRect = container.getBoundingClientRect();
    let isHeroVisible =
      initialRect.bottom > 0 && initialRect.top < window.innerHeight;
    let isTabVisible = document.visibilityState === 'visible';

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();

    const isNarrow = width < 768;
    const centerX = isNarrow ? width * 0.5 : width * 0.72;
    const centerY = isNarrow ? height * 0.56 : height * 0.45;
    const orbitRadius = isNarrow ? 122 : 190;
    const nodeScale = isNarrow ? 0.76 : 1;

    const satelliteCount = NODE_DEFS.length - 1;
    const nodes: PhysicsNode[] = NODE_DEFS.map((n, i) => {
      const angle = ((i - 1) / satelliteCount) * Math.PI * 2 - Math.PI * 0.35;
      const dist = i === 0 ? 0 : orbitRadius;
      return {
        ...n,
        r: Math.round(n.r * nodeScale),
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.6,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.6,
      };
    });

    let dragged: PhysicsNode | null = null;
    let lastPointer = { x: 0, y: 0 };

    const getLocalCoords = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const renderScene = (stepPhysics: boolean) => {
      ctx.clearRect(0, 0, width, height);
      const centerNode = nodes[0];
      const springRest = width < 768 ? 132 : 200;

      if (stepPhysics && !prefersReducedMotion) {
        for (let i = 1; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = n.x - centerNode.x;
          const dy = n.y - centerNode.y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const force = (dist - springRest) * 0.0022;

          if (n !== dragged) {
            n.vx -= (dx / dist) * force;
            n.vy -= (dy / dist) * force;
          }
          if (centerNode !== dragged) {
            centerNode.vx += (dx / dist) * force * 0.25;
            centerNode.vy += (dy / dist) * force * 0.25;
          }
        }

        nodes.forEach((n) => {
          if (n !== dragged) {
            n.x += n.vx;
            n.y += n.vy;
            n.vx *= 0.965;
            n.vy *= 0.965;

            if (n.x < n.r + 24) {
              n.x = n.r + 24;
              n.vx *= -0.65;
            }
            if (n.x > width - n.r - 24) {
              n.x = width - n.r - 24;
              n.vx *= -0.65;
            }
            if (n.y < n.r + 92) {
              n.y = n.r + 92;
              n.vy *= -0.65;
            }
            if (n.y > height - n.r - 92) {
              n.y = height - n.r - 92;
              n.vy *= -0.65;
            }
          }
        });
      }

      const isOpaline = themeRef.current === 'opaline';

      // Architectural radial coordinate rings anchored around core node
      ctx.save();
      ctx.strokeStyle = isOpaline ? 'rgba(91, 67, 122, 0.16)' : 'rgba(42, 43, 49, 0.75)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.arc(centerNode.x, centerNode.y, springRest, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw brand violet-to-blue spring connections & subtle telemetry packets
      const pulsePhase = ((performance.now() * 0.00038) % 1);
      for (let i = 1; i < nodes.length; i++) {
        const n = nodes[i];
        const grad = ctx.createLinearGradient(centerNode.x, centerNode.y, n.x, n.y);
        grad.addColorStop(0, 'rgba(161, 0, 255, 0.72)');
        grad.addColorStop(1, 'rgba(42, 0, 200, 0.72)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(centerNode.x, centerNode.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();

        if (!prefersReducedMotion) {
          const offset = (pulsePhase + (i - 1) * 0.2) % 1;
          const px = centerNode.x + (n.x - centerNode.x) * offset;
          const py = centerNode.y + (n.y - centerNode.y) * offset;
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = offset < 0.5 ? '#d28cff' : '#93c5fd';
          ctx.fill();
        }
      }

      // Draw engineering nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.primary
          ? isOpaline
            ? '#e4d9f0'
            : '#171522'
          : isOpaline
          ? '#f5effa'
          : '#15161a';
        ctx.fill();
        ctx.lineWidth = n.primary ? 1.8 : 1.1;
        ctx.strokeStyle = n.primary
          ? '#a100ff'
          : isOpaline
          ? '#c7b5d9'
          : '#2a2b31';
        ctx.stroke();

        ctx.fillStyle = isOpaline ? '#2a2039' : '#ecebe6';
        ctx.font = `600 ${width < 768 ? 9 : 10.5}px "Archivo", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(n.title, n.x, n.y - 2);

        ctx.fillStyle = n.primary ? (isOpaline ? '#7540c8' : '#d28cff') : (isOpaline ? '#766987' : '#b4b7bf');
        ctx.font = `400 ${width < 768 ? 7.5 : 9}px "JetBrains Mono", monospace`;
        ctx.fillText(n.sub, n.x, n.y + 13);
      });
    };

    const tick = () => {
      animationId = 0;
      if (!isHeroVisible || !isTabVisible || prefersReducedMotion) return;
      renderScene(true);
      animationId = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (prefersReducedMotion) {
        renderScene(false);
        return;
      }
      if (isHeroVisible && isTabVisible && !animationId) {
        animationId = requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = 0;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!isHeroVisible) return;
      const pt = getLocalCoords(e.clientX, e.clientY);
      for (let i = nodes.length - 1; i >= 0; i--) {
        if (Math.hypot(pt.x - nodes[i].x, pt.y - nodes[i].y) <= nodes[i].r + 10) {
          dragged = nodes[i];
          lastPointer = pt;
          canvas.setPointerCapture(e.pointerId);
          ensureRunning();
          break;
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragged) return;
      const pt = getLocalCoords(e.clientX, e.clientY);
      dragged.vx = (pt.x - lastPointer.x) * 0.3;
      dragged.vy = (pt.y - lastPointer.y) * 0.3;
      dragged.x = pt.x;
      dragged.y = pt.y;
      lastPointer = pt;
      if (prefersReducedMotion) {
        renderScene(false);
      } else {
        ensureRunning();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (dragged && canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
      dragged = null;
    };

    const handleResize = () => {
      updateSize();
      nodes.forEach((n) => {
        n.x = Math.min(Math.max(n.x, n.r + 24), width - n.r - 24);
        n.y = Math.min(Math.max(n.y, n.r + 92), height - n.r - 92);
      });
      renderScene(false);
    };

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
      if (isTabVisible) {
        ensureRunning();
      } else {
        stopLoop();
      }
    };

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        stopLoop();
        renderScene(false);
      } else {
        ensureRunning();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isHeroVisible = entry.isIntersecting;
        container.dataset.heroVisible = isHeroVisible ? 'true' : 'false';
        if (isHeroVisible) {
          ensureRunning();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.02, rootMargin: '40px 0px' }
    );

    container.dataset.heroVisible = isHeroVisible ? 'true' : 'false';
    observer.observe(container);

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionMedia.addEventListener('change', handleReducedMotionChange);

    redrawRef.current = () => renderScene(false);
    renderScene(false);
    ensureRunning();

    return () => {
      redrawRef.current = null;
      stopLoop();
      observer.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionMedia.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen pt-28 pb-12 px-5 sm:px-8 lg:px-12 flex flex-col justify-between overflow-hidden"
    >
      {/* Parallax Layer 1: Blueprint Coordinate Grid */}
      <motion.div
        aria-hidden="true"
        style={{
          backgroundImage:
            theme === 'opaline' ? 'linear-gradient(rgba(76, 52, 104, 0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(76, 52, 104, 0.075) 1px, transparent 1px)' : 'linear-gradient(rgba(236, 235, 230, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 235, 230, 0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          ...(shouldReduceMotion ? {} : { y: gridY, opacity: gridOpacity }),
        }}
        className="pointer-events-none absolute -inset-x-4 -top-8 -bottom-32 z-0 will-change-transform"
      />

      {/* Parallax Layer 2: Controlled Violet-Blue Radial Ambient Field */}
      <motion.div
        aria-hidden="true"
        style={
          shouldReduceMotion
            ? {
                background:
                  'radial-gradient(560px circle at 72% 44%, rgba(161, 0, 255, 0.13), rgba(42, 0, 200, 0.08) 46%, transparent 72%)',
              }
            : {
                y: glowY,
                scale: glowScale,
                opacity: glowOpacity,
                background:
                  'radial-gradient(560px circle at 72% 44%, rgba(161, 0, 255, 0.13), rgba(42, 0, 200, 0.08) 46%, transparent 72%)',
              }
        }
        className="pointer-events-none absolute -inset-x-6 -top-12 -bottom-40 z-0 will-change-transform"
      />

      {/* Parallax Layer 3: Interactive Architecture Workbench Canvas */}
      <motion.div
        style={
          shouldReduceMotion
            ? undefined
            : {
                y: canvasY,
                opacity: canvasOpacity,
              }
        }
        className="absolute inset-0 z-[1] will-change-transform"
      >
        <canvas
          ref={canvasRef}
          aria-label="Interactive MAVERIQODE systems workbench. Drag and inspect connected engineering nodes."
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />
      </motion.div>

      {/* Directional readability scrim on the left where editorial copy sits */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-2/3 z-[2]"
        style={{
          background:
            'linear-gradient(to right, color-mix(in srgb, var(--mq-bg) 92%, transparent), color-mix(in srgb, var(--mq-bg) 52%, transparent), transparent)',
        }}
      />

      {/* Subtle hardware-accelerated CSS film grain overlay */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-[10%] z-[3] mq-hero-grain ${
          shouldReduceMotion ? '!animate-none' : ''
        }`}
      />

      <div className="relative z-10 max-w-[1440px] w-full mx-auto pointer-events-none pt-4 sm:pt-8">
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.45, delay: 0.02, ease: [0.16, 1, 0.3, 1] }
          }
          className="font-mono text-xs tracking-wide text-[var(--mq-accent-soft)] mb-6"
        >
          MAVERIQODE · Digital Engineering Atelier
        </motion.p>

        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }
          }
          className="font-display font-extrabold text-[clamp(2.4rem,5.8vw,5.4rem)] leading-[0.98] tracking-[-0.035em] max-w-[920px] text-balance text-[var(--mq-text)]"
        >
          Engineered for{' '}
          <EditorialSerifAccent trigger="mount" targetTracking="-0.015em" delay={0.14}>
            enduring
          </EditorialSerifAccent>
          <br />
          digital systems.
        </motion.h1>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }
          }
          className="inline-flex items-center gap-2 mt-6 font-mono text-xs text-[var(--mq-muted)]"
        >
          <Move className="w-3.5 h-3.5 text-[var(--mq-accent-soft)]" aria-hidden="true" />
          <span>Interactive Workbench — Drag system nodes to inspect connections</span>
        </motion.p>
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }
        }
        className="relative z-10 max-w-[1440px] w-full mx-auto pt-8 border-t border-[var(--mq-border)] flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none"
      >
        <p className="max-w-[540px] text-[var(--mq-text-secondary)] text-base leading-relaxed">
          MAVERIQODE is a digital engineering company building software products, AI systems, operational automation, cybersecurity solutions, and cloud infrastructure.
        </p>

        <div className="pointer-events-auto flex flex-wrap items-center gap-3.5">
          <motion.button
            type="button"
            onClick={() => onNavigate('contact')}
            whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.015 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-gradient-to-br from-[#a100ff] to-[#2a00c8] text-[#ecebe6] font-semibold text-sm shadow-[0_10px_28px_rgba(161,0,255,0.28)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecebe6]"
          >
            <span>Bring us the problem</span>
            <ArrowRight
              className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onNavigate('capabilities')}
            whileHover={shouldReduceMotion ? undefined : { y: -1.5 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center px-5 py-3.5 rounded-[10px] bg-[var(--mq-surface)]/80 border border-[var(--mq-border)] text-[var(--mq-text)] font-medium text-sm hover:border-[#a100ff]/65 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff]"
          >
            Explore capabilities
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
