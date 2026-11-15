import { ArrowRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SOLUTIONS, ServiceOption } from '../data/maveriqodeData';
import { EditorialSerifAccent } from './EditorialSerifAccent';
import {
  CARD_STAGGER_VARIANTS,
  INNER_TEXT_VARIANTS,
  MQ_EASE,
  SECTION_VIEWPORT,
  STAGGER_CONTAINER_VARIANTS,
  TEXT_REVEAL_VARIANTS,
} from '../utils/motionVariants';

interface SolutionsSectionProps {
  onSelectSolution: (service: ServiceOption, contextNote: string) => void;
}

const outcomeListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export function SolutionsSection({ onSelectSolution }: SolutionsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="solutions"
      className="relative overflow-hidden scroll-mt-20 py-24 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-80"
      />
      <div className="relative z-10 max-w-[1440px] mx-auto">
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
              03 · Solutions
            </motion.p>
            <motion.h2
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="font-display font-extrabold text-[clamp(2rem,4.2vw,3.6rem)] leading-none tracking-[-0.03em] text-[var(--mq-text)]"
            >
              Built Around{' '}
              <EditorialSerifAccent targetTracking="-0.015em">
                Outcomes
              </EditorialSerifAccent>
            </motion.h2>
          </div>
          <motion.span
            variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
            className="font-mono text-xs text-[var(--mq-muted)]"
          >
            Practical Engineering Tracks
          </motion.span>
        </motion.div>

        {/* Balanced 2-row asymmetric bento: Row 1 (2+1), Row 2 (1+1+1) */}
        <motion.div
          variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {SOLUTIONS.map((sol, index) => {
            const isWideAnchor = index === 0;
            return (
              <motion.article
                key={sol.id}
                variants={shouldReduceMotion ? undefined : CARD_STAGGER_VARIANTS}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.18, ease: MQ_EASE } }
                }
                className={`relative overflow-hidden rounded-2xl bg-[var(--mq-surface)] border border-[var(--mq-border)] p-7 sm:p-8 flex flex-col justify-between transition-colors duration-200 hover:border-[#a100ff]/55 ${
                  isWideAnchor ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                {isWideAnchor && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-35"
                  />
                )}
                <div className="relative z-10">
                  <motion.div
                    variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                    className="flex flex-wrap items-center justify-between gap-2 mb-4 font-mono text-xs"
                  >
                    <span className="text-[var(--mq-accent-soft)]">{sol.kicker}</span>
                    <span className="text-[var(--mq-muted)]">{sol.architectureFocus}</span>
                  </motion.div>

                  <motion.h3
                    variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                    className="font-display font-bold text-2xl sm:text-[1.65rem] leading-tight text-[var(--mq-text)] mb-3 text-balance"
                  >
                    {sol.title}
                  </motion.h3>

                  <motion.p
                    variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                    className="text-sm sm:text-[15px] text-[var(--mq-text-secondary)] leading-relaxed mb-6 max-w-[65ch]"
                  >
                    {sol.summary}
                  </motion.p>

                  <motion.ul
                    variants={shouldReduceMotion ? undefined : outcomeListVariants}
                    className="space-y-3 mb-8"
                  >
                    {sol.outcomes.map((outcome) => (
                      <motion.li
                        key={outcome}
                        variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                        className="flex items-start gap-2.5 text-sm text-[var(--mq-muted)] leading-snug"
                      >
                        <Check
                          className="w-4 h-4 text-[var(--mq-accent-soft)] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{outcome}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                <motion.div
                  variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                  className="relative z-10 pt-5 border-t border-[var(--mq-border)] flex items-center justify-between gap-4"
                >
                  <span className="font-mono text-xs text-[var(--mq-muted)] truncate">
                    {sol.serviceOption}
                  </span>
                  <motion.button
                    type="button"
                    whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.975 }}
                    onClick={() =>
                      onSelectSolution(sol.serviceOption, `${sol.kicker}: ${sol.title}`)
                    }
                    className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] text-xs font-semibold text-[var(--mq-text)] hover:bg-gradient-to-r hover:from-[#a100ff] hover:to-[#2a00c8] hover:border-transparent transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff]"
                  >
                    <span>Discuss Scope</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </motion.button>
                </motion.div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
