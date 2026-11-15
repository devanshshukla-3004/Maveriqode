import { useEffect, useRef } from 'react';
import { ArrowRight, Move } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { NavSectionId } from '../data/maveriqodeData';

interface HeroWorkbenchProps {
  onNavigate: (id: NavSectionId) => void;
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
  { title: 'MAVERIQODE', sub: 'Core Engine', r: 54, primary: true },
  { title: 'AI AGENTS', sub: 'Automation', r: 44, primary: false },
  { title: 'WEB & APPS', sub: '60fps Stack', r: 44, primary: false },
  { title: 'SEC AUDIT', sub: 'Zero-Trust', r: 44, primary: false },
  { title: 'UI SYSTEMS', sub: 'Brand Craft', r: 40, primary: false },
];

export function HeroWorkbench({ onNavigate }: HeroWorkbenchProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  const glowY = useTransform(scrollYProgress, [0, 1], [0, 210]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.95, 0.2]);

  const canvasY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const canvasOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = sectionRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = container.clientWidth;
    let height = container.clientHeight;
    let animationId = 0;

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
    const centerY = isNarrow ? height * 0.58 : height * 0.45;
    const orbitRadius = isNarrow ? 120 : 185;
    const nodeScale = isNarrow ? 0.78 : 1;

    const nodes: PhysicsNode[] = NODE_DEFS.map((n, i) => {
      const angle = (i / NODE_DEFS.length) * Math.PI * 2;
      const dist = i === 0 ? 0 : orbitRadius;
      return {
        ...n,
        r: Math.round(n.r * nodeScale),
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 1.1,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 1.1,
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

    const handlePointerDown = (e: PointerEvent) => {
      const pt = getLocalCoords(e.clientX, e.clientY);
      for (let i = nodes.length - 1; i >= 0; i--) {
        if (Math.hypot(pt.x - nodes[i].x, pt.y - nodes[i].y) <= nodes[i].r + 10) {
          dragged = nodes[i];
          lastPointer = pt;
          canvas.setPointerCapture(e.pointerId);
          break;
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragged) return;
      const pt = getLocalCoords(e.clientX, e.clientY);
      dragged.vx = (pt.x - lastPointer.x) * 0.35;
      dragged.vy = (pt.y - lastPointer.y) * 0.35;
      dragged.x = pt.x;
      dragged.y = pt.y;
      lastPointer = pt;
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
        n.x = Math.min(Math.max(n.x, n.r + 20), width - n.r - 20);
        n.y = Math.min(Math.max(n.y, n.r + 90), height - n.r - 90);
      });
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('resize', handleResize);

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const centerNode = nodes[0];
      const springRest = width < 768 ? 135 : 205;

      if (!prefersReducedMotion) {
        for (let i = 1; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = n.x - centerNode.x;
          const dy = n.y - centerNode.y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const force = (dist - springRest) * 0.0025;

          if (n !== dragged) {
            n.vx -= (dx / dist) * force;
            n.vy -= (dy / dist) * force;
          }
          if (centerNode !== dragged) {
            centerNode.vx += (dx / dist) * force * 0.3;
            centerNode.vy += (dy / dist) * force * 0.3;
          }
        }

        nodes.forEach((n) => {
          if (n !== dragged) {
            n.x += n.vx;
            n.y += n.vy;
            n.vx *= 0.96;
            n.vy *= 0.96;

            if (n.x < n.r + 20) {
              n.x = n.r + 20;
              n.vx *= -0.7;
            }
            if (n.x > width - n.r - 20) {
              n.x = width - n.r - 20;
              n.vx *= -0.7;
            }
            if (n.y < n.r + 90) {
              n.y = n.r + 90;
              n.vy *= -0.7;
            }
            if (n.y > height - n.r - 90) {
              n.y = height - n.r - 90;
              n.vy *= -0.7;
            }
          }
        });
      }

      // Draw gradient spring connections
      for (let i = 1; i < nodes.length; i++) {
        const n = nodes[i];
        const grad = ctx.createLinearGradient(centerNode.x, centerNode.y, n.x, n.y);
        grad.addColorStop(0, 'rgba(124, 58, 237, 0.72)');
        grad.addColorStop(1, 'rgba(37, 99, 235, 0.72)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerNode.x, centerNode.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }

      // Draw architecture nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.primary ? '#161326' : '#0F0F15';
        ctx.fill();
        ctx.lineWidth = n.primary ? 2 : 1.2;
        ctx.strokeStyle = n.primary ? '#8B5CF6' : 'rgba(255, 255, 255, 0.22)';
        ctx.stroke();

        ctx.fillStyle = '#F5F5F7';
        ctx.font = `600 ${width < 768 ? 9.5 : 11}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(n.title, n.x, n.y - 2);

        ctx.fillStyle = '#A78BFA';
        ctx.font = `400 ${width < 768 ? 8 : 9}px "JetBrains Mono", monospace`;
        ctx.fillText(n.sub, n.x, n.y + 13);
      });

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen pt-28 pb-12 px-5 sm:px-8 lg:px-12 flex flex-col justify-between overflow-hidden"
    >
      {/* Parallax Background Layer 1: Architectural Coordinate Grid */}
      <motion.div
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          ...(shouldReduceMotion ? {} : { y: gridY, opacity: gridOpacity }),
        }}
        className="pointer-events-none absolute -inset-x-4 -top-8 -bottom-32 z-0 will-change-transform"
      />

      {/* Parallax Background Layer 2: Ambient Violet-Cobalt Radial Field */}
      <motion.div
        aria-hidden="true"
        style={
          shouldReduceMotion
            ? {
                background:
                  'radial-gradient(620px circle at 72% 44%, rgba(124, 58, 237, 0.16), rgba(37, 99, 235, 0.08) 45%, transparent 72%)',
              }
            : {
                y: glowY,
                scale: glowScale,
                opacity: glowOpacity,
                background:
                  'radial-gradient(620px circle at 72% 44%, rgba(124, 58, 237, 0.16), rgba(37, 99, 235, 0.08) 45%, transparent 72%)',
              }
        }
        className="pointer-events-none absolute -inset-x-6 -top-12 -bottom-40 z-0 will-change-transform"
      />

      {/* Parallax Background Layer 3: Interactive Physics Workbench Canvas */}
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
          aria-label="Interactive MAVERIQODE architecture nodes canvas. Drag and throw connected nodes."
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        />
      </motion.div>

      {/* Subtle radial readability scrim on the left where copy sits */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-2/3 z-[2] bg-gradient-to-r from-[#070709]/85 via-[#070709]/45 to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-[1440px] w-full mx-auto pointer-events-none pt-4 sm:pt-8"
      >
        <p className="font-mono text-xs tracking-wide text-[#C4B5FD] mb-6">
          maveriqode.tech · Accepting Q4 / Q1 Engineering Sprints
        </p>

        <h1 className="font-display font-extrabold text-[clamp(2.5rem,6.4vw,6.2rem)] leading-[0.96] tracking-[-0.04em] max-w-[960px] text-balance text-white">
          Engineering{' '}
          <span className="bg-gradient-to-br from-[#A855F7] to-[#3B82F6] bg-clip-text text-transparent">
            Flagship
          </span>
          <br />
          Digital Systems.
        </h1>

        <p className="inline-flex items-center gap-2 mt-6 font-mono text-xs text-[#8E8E98]">
          <Move className="w-3.5 h-3.5 text-[#A78BFA]" aria-hidden="true" />
          <span>Interactive Architecture — Drag &amp; throw the live nodes</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-[1440px] w-full mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none"
      >
        <p className="max-w-[500px] text-[#A1A1AA] text-base leading-relaxed">
          MAVERIQODE partners with founders and institutions to build high-velocity web &amp; mobile platforms, autonomous AI workflows, and hardened security infrastructure.
        </p>

        <div className="pointer-events-auto flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-gradient-to-br from-[#7C3AED] to-[#2563EB] text-white font-semibold text-sm shadow-[0_12px_35px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 transition-transform duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Request Architecture Call</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('work')}
            className="inline-flex items-center px-5 py-3.5 rounded-[10px] bg-white/[0.04] border border-white/10 text-white font-medium text-sm hover:border-[#8B5CF6]/60 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            View Deployments
          </button>
        </div>
      </motion.div>
    </section>
  );
}
