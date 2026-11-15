import { MouseEvent, useState } from 'react';
import { ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { ServiceOption, WORK_EVALUATION_AREAS } from '../data/maveriqodeData';
import { EditorialSerifAccent } from './EditorialSerifAccent';
import {
  INNER_TEXT_VARIANTS,
  SECTION_VIEWPORT,
  STAGGER_CONTAINER_VARIANTS,
  TEXT_REVEAL_VARIANTS,
} from '../utils/motionVariants';

interface WorkSectionProps {
  onRequestSimilar: (service: ServiceOption, contextNote: string) => void;
}

export function WorkSection({ onRequestSimilar }: WorkSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const [hovered, setHovered] = useState(false);

  const springConfig = { stiffness: 250, damping: 26, mass: 0.55 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);
  const gridShiftX = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const gridShiftY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);
  const railShiftX = useTransform(smoothX, [-0.5, 0.5], [4, -4]);
  const railShiftY = useTransform(smoothY, [-0.5, 0.5], [3, -3]);
  const sheenBg = useMotionTemplate`radial-gradient(560px circle at ${glowX}% ${glowY}%, rgba(161, 0, 255, 0.12), rgba(42, 0, 200, 0.06) 42%, transparent 72%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || window.innerWidth < 860) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(nx);
    pointerY.set(ny);
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      id="work"
      className="scroll-mt-20 relative z-10 py-24 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
          className="flex flex-wrap items-end justify-between gap-4 mb-12"
        >
          <div>
            <motion.p
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="font-mono text-xs text-[#93c5fd] mb-3"
            >
              04 · Work — Selected Archive
            </motion.p>
            <motion.h2
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="font-display font-extrabold text-[clamp(2rem,4.2vw,3.6rem)] leading-none tracking-[-0.03em] text-[var(--mq-text)]"
            >
              Verified{' '}
              <EditorialSerifAccent targetTracking="-0.015em">
                Engagements
              </EditorialSerifAccent>
            </motion.h2>
          </div>
          <motion.span
            variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
            className="font-mono text-xs text-[var(--mq-muted)]"
          >
            Client Confidentiality Standard
          </motion.span>
        </motion.div>

        {/* Intentional empty/private-archive state with interactive 3D tilt frame */}
        <motion.div
          variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          style={{ perspective: '1200px' }}
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
            className="relative rounded-3xl bg-[var(--mq-surface-card)] border border-[var(--mq-border-strong)] p-7 sm:p-10 lg:p-12 overflow-hidden transition-colors duration-200 hover:border-[#a100ff]/55"
          >
            {!shouldReduceMotion && (
              <motion.div
                aria-hidden="true"
                style={{ background: sheenBg }}
                className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                  hovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            {/* Subtle architectural blueprint coordinate lines with inner parallax */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2 opacity-40"
              style={{
                x: shouldReduceMotion ? 0 : gridShiftX,
                y: shouldReduceMotion ? 0 : gridShiftY,
                backgroundImage:
                  'linear-gradient(rgba(236, 235, 230, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 235, 230, 0.03) 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-12 items-start">
              <div>
                <motion.div
                  variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                  className="inline-flex items-center gap-2 font-mono text-xs text-[var(--mq-accent-soft)] mb-4"
                >
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>Published Only With Client Authorization</span>
                </motion.div>

                <motion.h3
                  variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                  className="font-display font-extrabold text-[clamp(1.65rem,3vw,2.5rem)] leading-[1.08] tracking-[-0.02em] text-[var(--mq-text)] text-balance mb-4"
                >
                  Public case studies are added as engagements clear disclosure.
                </motion.h3>

                <motion.p
                  variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                  className="text-[var(--mq-text-secondary)] text-sm sm:text-base leading-relaxed max-w-[58ch] mb-6"
                >
                  MAVERIQODE does not publish simulated projects, fabricated benchmarks, or unattributed client work. Detailed technical walkthroughs and architectural references are shared privately during engineering evaluations.
                </motion.p>

                <motion.button
                  type="button"
                  variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                  whileHover={shouldReduceMotion ? undefined : { y: -1.5 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                  onClick={() =>
                    onRequestSimilar(
                      'Software Engineering',
                      'Requesting a private technical walkthrough'
                    )
                  }
                  className="group/btn inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-gradient-to-br from-[#a100ff] to-[#2a00c8] text-[#ecebe6] text-xs font-semibold hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecebe6]"
                >
                  <span>Request Technical Walkthrough</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5"
                    aria-hidden="true"
                  />
                </motion.button>
              </div>

              <motion.div
                style={
                  shouldReduceMotion
                    ? undefined
                    : { x: railShiftX, y: railShiftY }
                }
                className="border-t border-[var(--mq-border)] lg:border-t-0 lg:border-l lg:pl-10"
              >
                {WORK_EVALUATION_AREAS.map((area, idx) => (
                  <motion.div
                    key={area.code}
                    variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                    className={`py-5 ${
                      idx === 0 ? 'border-b border-[var(--mq-border)] lg:pt-0' : 'pb-0'
                    }`}
                  >
                    <span className="block font-mono text-[11px] text-[var(--mq-accent-soft)] mb-1.5">
                      {area.code}
                    </span>
                    <h4 className="text-base font-bold text-[var(--mq-text)] mb-1.5">
                      {area.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--mq-muted)] leading-relaxed mb-3">
                      {area.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => onRequestSimilar(area.serviceOption, area.title)}
                      className="group/link inline-flex items-center gap-1.5 font-mono text-xs text-[var(--mq-text)] hover:text-[var(--mq-accent-soft)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff] rounded"
                    >
                      <span>Discuss in brief</span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
