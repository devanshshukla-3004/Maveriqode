import { MouseEvent, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { CASE_STUDIES, CaseStudy, ServiceOption } from '../data/maveriqodeData';
import { ScrollReveal } from './ScrollReveal';

interface WorkSectionProps {
  onRequestSimilar: (service: ServiceOption, contextNote: string) => void;
}

interface TiltProjectCardProps {
  project: CaseStudy;
  cardRef: (el: HTMLElement | null) => void;
  onInspect: (project: CaseStudy) => void;
  onPillEnter: (label: string) => void;
  onPillLeave: () => void;
  onPillMove: (x: number, y: number) => void;
}

function TiltProjectCard({
  project,
  cardRef,
  onInspect,
  onPillEnter,
  onPillLeave,
  onPillMove,
}: TiltProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const [hovered, setHovered] = useState(false);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.55 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4.5, -4.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);
  const sheenBg = useMotionTemplate`radial-gradient(520px circle at ${glowX}% ${glowY}%, rgba(139, 92, 246, 0.14), rgba(37, 99, 235, 0.06) 40%, transparent 72%)`;

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    onPillMove(e.clientX, e.clientY);
    if (shouldReduceMotion || window.innerWidth < 860) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(nx);
    pointerY.set(ny);
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    onPillEnter(project.cursorLabel);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    pointerX.set(0);
    pointerY.set(0);
    onPillLeave();
  };

  return (
    <article
      data-cursor-pill="true"
      ref={cardRef}
      onClick={() => onInspect(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ perspective: '1200px' }}
      className="md:sticky md:top-[104px] origin-top will-change-transform cursor-pointer group"
    >
      <motion.div
        style={
          shouldReduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className="relative bg-[var(--mq-surface-card)] border border-[var(--mq-border-strong)] rounded-3xl p-6 sm:p-10 lg:p-12 min-h-[410px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-center shadow-[0_-20px_60px_rgba(0,0,0,0.65)] transition-colors duration-200 group-hover:border-[#7C3AED]/65 overflow-hidden"
      >
        {/* Dynamic pointer-tracked 3D sheen */}
        {!shouldReduceMotion && (
          <motion.div
            aria-hidden="true"
            style={{ background: sheenBg }}
            className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        <ScrollReveal
          yOffset={16}
          className="relative z-10 transition-transform duration-300 ease-out"
        >
          <p className="font-mono text-xs text-[#93C5FD] tracking-wider mb-3">
            {project.caseNumber} · {project.category}
          </p>

          <h3 className="font-display font-extrabold text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.08] text-white mb-4 text-balance">
            {project.title}
          </h3>

          <p className="text-[var(--mq-muted)] text-sm sm:text-base leading-relaxed mb-7">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-8 sm:gap-10 pt-5 border-t border-[var(--mq-border)] font-mono">
            {project.stats.map((stat) => (
              <div key={stat.label}>
                <strong className="block text-xl sm:text-2xl text-white tabular-nums">
                  {stat.value}
                </strong>
                <span className="text-[11px] text-[var(--mq-muted)]">{stat.label}</span>
              </div>
            ))}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInspect(project);
              }}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#C4B5FD] group-hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
            >
              <span>Inspect Case</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal
          delay={0.08}
          yOffset={16}
          className="relative z-10 h-full min-h-[270px] sm:min-h-[300px] rounded-2xl border border-[var(--mq-border)] p-6 flex flex-col justify-between overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: project.accentGradient }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10 bg-[var(--mq-surface-inset)]/88 border border-[var(--mq-border-strong)] rounded-xl p-5 backdrop-blur-md transition-transform duration-300 ease-out group-hover:-translate-y-1.5 font-mono">
            <div className="flex items-center justify-between text-[11px] text-[#34D399] gap-2">
              <span>{project.stageStatus}</span>
              <span className="text-[#93C5FD]">{project.stageBadge}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-white my-2.5 font-sans">
              {project.stageHeading}
            </div>
            <div className="text-xs text-[var(--mq-muted)]">{project.stageSub}</div>
          </div>

          <div className="relative z-10 bg-[var(--mq-surface-inset)]/88 border border-[var(--mq-border-strong)] rounded-xl p-4 backdrop-blur-md transition-transform duration-300 ease-out group-hover:-translate-y-1 font-mono text-xs text-[#C4B5FD]">
            Stack: {project.stackSummary}
          </div>
        </ScrollReveal>
      </motion.div>
    </article>
  );
}

export function WorkSection({ onRequestSimilar }: WorkSectionProps) {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [pillState, setPillState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    label: 'Inspect Case ↗',
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (window.innerWidth < 860) {
        cardRefs.current.forEach((card) => {
          if (card) {
            card.style.transform = '';
            card.style.filter = '';
          }
        });
        return;
      }

      cardRefs.current.forEach((card, i) => {
        const nextCard = cardRefs.current[i + 1];
        if (!card || !nextCard) return;

        const rect = card.getBoundingClientRect();
        const nextRect = nextCard.getBoundingClientRect();
        const overlap = Math.max(0, (rect.bottom - nextRect.top) / rect.height);
        const clamped = Math.min(1, overlap);
        const scale = 1 - clamped * 0.06;
        const brightness = 1 - clamped * 0.35;

        card.style.transform = `scale(${scale.toFixed(3)})`;
        card.style.filter = `brightness(${brightness.toFixed(2)})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedCase) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedCase(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCase]);

  return (
    <section
      id="work"
      className="scroll-mt-20 relative z-10 py-24 pb-32 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      {/* Magnetic Cursor Pill (desktop pointer only) */}
      <div
        aria-hidden="true"
        style={{ left: `${pillState.x}px`, top: `${pillState.y}px` }}
        className={`hidden md:block fixed px-4 py-2 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2563EB] text-white font-mono text-[11px] font-semibold tracking-wider pointer-events-none z-50 shadow-[0_10px_30px_rgba(124,58,237,0.45)] transition-[opacity,transform] duration-200 ease-out ${
          pillState.visible
            ? 'opacity-100 -translate-x-1/2 -translate-y-1/2 scale-100'
            : 'opacity-0 -translate-x-1/2 -translate-y-1/2 scale-75'
        }`}
      >
        {pillState.label}
      </div>

      <div className="max-w-[1440px] mx-auto">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-xs text-[#60A5FA] mb-3">
              04 · Work — Selected Deployments
            </p>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4.2vw,3.6rem)] leading-none tracking-[-0.03em] text-white">
              Systems In Production
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--mq-muted)]">MAVERIQODE Archive</span>
        </ScrollReveal>

        <div className="relative flex flex-col gap-12 lg:gap-16">
          {CASE_STUDIES.map((project, index) => (
            <TiltProjectCard
              key={project.id}
              project={project}
              cardRef={(el) => {
                cardRefs.current[index] = el;
              }}
              onInspect={setSelectedCase}
              onPillEnter={(label) =>
                setPillState((prev) => ({
                  ...prev,
                  visible: true,
                  label,
                }))
              }
              onPillLeave={() =>
                setPillState((prev) => ({
                  ...prev,
                  visible: false,
                }))
              }
              onPillMove={(x, y) =>
                setPillState((prev) => ({
                  ...prev,
                  x,
                  y,
                }))
              }
            />
          ))}
        </div>
      </div>

      {/* Interactive Case Study Inspector Modal */}
      {selectedCase && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
          onClick={() => setSelectedCase(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl bg-[var(--mq-surface)] border border-[var(--mq-border-strong)] p-6 sm:p-8 shadow-2xl my-auto"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-xs text-[#93C5FD] mb-2">
                  {selectedCase.caseNumber} · {selectedCase.category}
                </p>
                <h3
                  id="case-modal-title"
                  className="font-display font-extrabold text-2xl sm:text-3xl text-white"
                >
                  {selectedCase.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                aria-label="Close case study details"
                className="w-10 h-10 rounded-lg border border-[var(--mq-border)] bg-white/[0.04] text-[var(--mq-muted)] hover:text-white flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-6 mb-6 border-b border-[var(--mq-border)] font-mono">
              {selectedCase.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[var(--mq-muted)]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-5 text-sm text-[var(--mq-text-secondary)] leading-relaxed mb-7">
              <div>
                <h4 className="font-mono text-xs text-[#A78BFA] mb-1.5">Challenge</h4>
                <p>{selectedCase.challenge}</p>
              </div>
              <div>
                <h4 className="font-mono text-xs text-[#A78BFA] mb-1.5">Architecture</h4>
                <p>{selectedCase.architecture}</p>
              </div>
              <div>
                <h4 className="font-mono text-xs text-[#A78BFA] mb-2">
                  Verified Outcomes
                </h4>
                <ul className="space-y-2">
                  {selectedCase.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-5 border-t border-[var(--mq-border)] flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-xs text-[var(--mq-muted)]">
                {selectedCase.stackSummary}
              </span>
              <button
                type="button"
                onClick={() => {
                  const chosen = selectedCase;
                  setSelectedCase(null);
                  onRequestSimilar(
                    chosen.serviceOption,
                    `Similar architecture to ${chosen.title}`
                  );
                }}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#2563EB] text-white text-xs font-semibold hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Request Similar Architecture
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
