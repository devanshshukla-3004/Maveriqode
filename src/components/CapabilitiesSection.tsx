import { useState } from 'react';
import { Plus, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  CAPABILITIES,
  CapabilityBlueprintVariant,
  CapabilityItem,
  ServiceOption,
} from '../data/maveriqodeData';
import {
  CARD_STAGGER_VARIANTS,
  INNER_TEXT_VARIANTS,
  SECTION_VIEWPORT,
  STAGGER_CONTAINER_VARIANTS,
  TEXT_REVEAL_VARIANTS,
} from '../utils/motionVariants';

interface CapabilitiesSectionProps {
  onRequestService: (service: ServiceOption, contextNote?: string) => void;
}

function BlueprintVisual({
  capability,
  isActive,
  shouldReduceMotion,
}: {
  capability: CapabilityItem;
  isActive: boolean;
  shouldReduceMotion: boolean;
}) {
  const variant: CapabilityBlueprintVariant = capability.visualVariant;
  const nodes = capability.blueprintNodes;

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? undefined
          : {
              opacity: isActive ? 1 : 0.72,
              y: isActive ? 0 : 6,
            }
      }
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="p-5 sm:p-6 rounded-xl bg-[var(--mq-surface-widget)] border border-[var(--mq-border-strong)] font-mono transition-colors duration-200"
    >
      <div className="flex items-center justify-between text-[11px] gap-2 mb-4 pb-3 border-b border-[var(--mq-border)]">
        <span className="text-[var(--mq-accent-soft)]">{capability.blueprintRef}</span>
        <span className="text-[var(--mq-muted)] truncate">{capability.blueprintTitle}</span>
      </div>

      {/* Distinct architectural schematic per capability */}
      {variant === 'software' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {nodes.map((node, idx) => (
              <motion.div
                key={node}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: isActive ? 1 : 0.65,
                        y: isActive ? 0 : 4,
                      }
                }
                transition={{
                  duration: 0.28,
                  delay: isActive ? idx * 0.04 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="px-3 py-2.5 rounded-lg bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] flex items-center justify-between text-[11px]"
              >
                <span className="text-[var(--mq-text)]">{node}</span>
                <span className="text-[var(--mq-muted)]">L{idx + 1}</span>
              </motion.div>
            ))}
          </div>
          <svg
            viewBox="0 0 320 38"
            className="w-full h-9"
            aria-hidden="true"
            fill="none"
          >
            <path
              d="M12 19 H308"
              stroke="#2a2b31"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <motion.path
              d="M12 19 H308"
              stroke="url(#cap-grad-sw)"
              strokeWidth="1.6"
              initial={false}
              animate={{
                pathLength: shouldReduceMotion ? 1 : isActive ? 1 : 0.22,
                opacity: isActive ? 1 : 0.4,
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
            <circle cx="12" cy="19" r="3.5" fill="#a100ff" />
            <motion.circle
              cx="110"
              cy="19"
              r="3"
              fill="#2a2b31"
              stroke="#ecebe6"
              strokeWidth="1"
              animate={shouldReduceMotion ? undefined : { scale: isActive ? 1.15 : 1 }}
              transition={{ duration: 0.25, delay: 0.1 }}
            />
            <motion.circle
              cx="210"
              cy="19"
              r="3"
              fill="#2a2b31"
              stroke="#ecebe6"
              strokeWidth="1"
              animate={shouldReduceMotion ? undefined : { scale: isActive ? 1.15 : 1 }}
              transition={{ duration: 0.25, delay: 0.2 }}
            />
            <circle cx="308" cy="19" r="3.5" fill="#2a00c8" />
            <defs>
              <linearGradient id="cap-grad-sw" x1="12" y1="19" x2="308" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a100ff" />
                <stop offset="1" stopColor="#2a00c8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {variant === 'ai' && (
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {nodes.slice(0, 3).map((node, idx) => (
                <motion.div
                  key={node}
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          opacity: isActive ? 1 : 0.65,
                          y: isActive ? 0 : 4,
                        }
                  }
                  transition={{
                    duration: 0.26,
                    delay: isActive ? idx * 0.045 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="px-2.5 py-2 rounded-lg bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] text-center text-[var(--mq-text)]"
                >
                  {node}
                </motion.div>
              ))}
            </div>
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: isActive ? 1 : 0.7,
                      scale: isActive ? 1 : 0.985,
                    }
              }
              transition={{ duration: 0.32, delay: isActive ? 0.12 : 0, ease: [0.16, 1, 0.3, 1] }}
              className="px-3 py-2.5 rounded-lg bg-[var(--mq-surface-inset)] border border-[#a100ff]/45 flex items-center justify-between text-[11px]"
            >
              <span className="text-[var(--mq-accent-soft)]">{nodes[3]}</span>
              <span className="text-[var(--mq-muted)]">Deterministic Boundary</span>
            </motion.div>
          </div>
        </div>
      )}

      {variant === 'automation' && (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[11px]">
          <div className="space-y-2">
            <div className="px-2.5 py-2 rounded-lg bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] text-[var(--mq-text)]">
              {nodes[0]}
            </div>
            <div className="px-2.5 py-2 rounded-lg bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] text-[var(--mq-muted)]">
              {nodes[1]}
            </div>
          </div>
          <div className="flex flex-col items-center px-1 text-[var(--mq-accent-soft)]" aria-hidden="true">
            <motion.span
              animate={{
                scaleX: shouldReduceMotion ? 1 : isActive ? 1 : 0.35,
                opacity: isActive ? 1 : 0.45,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-6 h-px origin-left bg-gradient-to-r from-[#a100ff] to-[#2a00c8]"
            />
          </div>
          <div className="space-y-2">
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : { opacity: isActive ? 1 : 0.7, x: isActive ? 0 : 4 }
              }
              transition={{ duration: 0.3, delay: isActive ? 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
              className="px-2.5 py-2 rounded-lg bg-[var(--mq-surface-inset)] border border-[#a100ff]/45 text-[var(--mq-text)]"
            >
              {nodes[2]}
            </motion.div>
            <div className="px-2.5 py-2 rounded-lg bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] text-[var(--mq-muted)]">
              {nodes[3]}
            </div>
          </div>
        </div>
      )}

      {variant === 'saas' && (
        <div className="space-y-2 text-[11px]">
          <div className="px-3 py-2 rounded-lg bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] flex items-center justify-between">
            <span className="text-[var(--mq-text)]">{nodes[0]}</span>
            <span className="text-[var(--mq-accent-soft)]">Shared UI Core</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {nodes.slice(1).map((node, idx) => (
              <motion.div
                key={node}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: isActive ? 1 : 0.65, y: isActive ? 0 : 4 }
                }
                transition={{
                  duration: 0.28,
                  delay: isActive ? idx * 0.05 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="px-2.5 py-2.5 rounded-lg bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] text-center text-[var(--mq-text-secondary)]"
              >
                {node}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {variant === 'cybersecurity' && (
        <div className="space-y-2 text-[11px]">
          {nodes.map((node, idx) => (
            <motion.div
              key={node}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { opacity: isActive ? 1 : 0.7, x: isActive ? 0 : -4 }
              }
              transition={{
                duration: 0.26,
                delay: isActive ? idx * 0.05 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`px-3 py-2 rounded-lg bg-[var(--mq-surface-inset)] border flex items-center justify-between ${
                idx === 1 ? 'border-[#a100ff]/50' : 'border-[var(--mq-border)]'
              }`}
            >
              <span className="text-[var(--mq-text)]">{node}</span>
              <span className="text-[var(--mq-muted)]">Gate 0{idx + 1}</span>
            </motion.div>
          ))}
        </div>
      )}

      {variant === 'infrastructure' && (
        <div className="grid grid-cols-2 gap-2.5 text-[11px]">
          {nodes.map((node, idx) => (
            <motion.div
              key={node}
              animate={
                shouldReduceMotion
                  ? undefined
                  : { opacity: isActive ? 1 : 0.68, scale: isActive ? 1 : 0.97 }
              }
              transition={{
                duration: 0.28,
                delay: isActive ? idx * 0.045 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-3 rounded-lg bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] flex flex-col gap-1"
            >
              <span className="text-[var(--mq-muted)]">0{idx + 1}</span>
              <span className="text-[var(--mq-text)] font-medium">{node}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function CapabilitiesSection({ onRequestService }: CapabilitiesSectionProps) {
  const [activeId, setActiveId] = useState<string>(CAPABILITIES[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [spotCoords, setSpotCoords] = useState<Record<string, { x: number; y: number }>>({});
  const shouldReduceMotion = useReducedMotion();

  const handleToggle = (id: string) => {
    setActiveId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="capabilities"
      className="relative overflow-hidden scroll-mt-20 py-24 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-75"
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
              className="font-mono text-xs text-[var(--mq-accent-soft)] mb-3"
            >
              02 · Capabilities — Six Core Disciplines
            </motion.p>
            <motion.h2
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="font-display font-extrabold text-[clamp(2rem,4.2vw,3.6rem)] leading-none tracking-[-0.03em] text-[var(--mq-text)]"
            >
              What We Engineer
            </motion.h2>
          </div>
          <motion.span
            variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
            className="font-mono text-xs text-[var(--mq-muted)]"
          >
            Select a discipline to inspect architecture scope
          </motion.span>
        </motion.div>

        <motion.div
          variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
          className="flex flex-col border-t border-[var(--mq-border)]"
          onMouseLeave={() => setHoveredId(null)}
        >
          {CAPABILITIES.map((cap) => {
            const isActive = activeId === cap.id;
            const isDimmed = hoveredId !== null && hoveredId !== cap.id && !isActive;
            const coords = spotCoords[cap.id];

            return (
              <motion.div
                key={cap.id}
                variants={shouldReduceMotion ? undefined : CARD_STAGGER_VARIANTS}
                onMouseEnter={() => setHoveredId(cap.id)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setSpotCoords((prev) => ({
                      ...prev,
                      [cap.id]: {
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      },
                    }));
                  }}
                  style={
                    isActive || hoveredId === cap.id
                      ? {
                          background: coords
                            ? `radial-gradient(640px circle at ${coords.x}px ${coords.y}px, rgba(161, 0, 255, 0.11), transparent 70%)`
                            : 'radial-gradient(640px circle at 50% 50%, rgba(161, 0, 255, 0.08), transparent 70%)',
                        }
                      : undefined
                  }
                  className={`border-b border-[var(--mq-border)] overflow-hidden transition-opacity duration-300 ${
                    isDimmed ? 'opacity-55' : 'opacity-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(cap.id)}
                    aria-expanded={isActive}
                    className="w-full text-left py-7 sm:py-8 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-[135px_1.35fr_1.15fr_48px] items-center gap-4 md:gap-6 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff]"
                  >
                    <motion.span
                      variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                      className="font-mono text-xs text-[var(--mq-accent-soft)] tabular-nums"
                    >
                      {cap.index} · {cap.code}
                    </motion.span>

                    <motion.h3
                      variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                      className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-[-0.02em] text-[var(--mq-text)] transition-transform duration-300 group-hover:translate-x-2"
                    >
                      {cap.title}
                    </motion.h3>

                    <motion.p
                      variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                      className="text-sm text-[var(--mq-muted)] leading-relaxed"
                    >
                      {cap.brief}
                    </motion.p>

                    <span
                      aria-hidden="true"
                      className={`hidden md:flex items-center justify-end transition-transform duration-300 ${
                        isActive ? 'rotate-45 text-[var(--mq-accent-soft)]' : 'text-[var(--mq-muted)]'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-2 sm:px-4 pb-8 md:pl-[calc(135px+2.5rem)] grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-10 items-start">
                        <div>
                          <p className="text-sm sm:text-[15px] text-[var(--mq-text-secondary)] leading-relaxed mb-4">
                            {cap.description}
                          </p>

                          <div className="mb-4">
                            <p className="font-mono text-[11px] text-[var(--mq-accent-soft)] mb-2">
                              Engineering Focus Areas
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm text-[var(--mq-muted)]">
                              {cap.focusAreas.map((area) => (
                                <li key={area} className="leading-snug">
                                  · {area}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-3 border-t border-[var(--mq-border)] flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-[var(--mq-muted)]">
                              {cap.stack.map((tech, idx) => (
                                <span key={tech} className="inline-flex items-center gap-2.5">
                                  <span>{tech}</span>
                                  {idx < cap.stack.length - 1 && (
                                    <span aria-hidden="true" className="text-[var(--mq-border-strong)]">
                                      ·
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>

                            <motion.button
                              type="button"
                              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                              onClick={() =>
                                onRequestService(cap.title, `Interested in ${cap.title}`)
                              }
                              className="group/btn inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[var(--mq-accent-soft)] hover:text-[var(--mq-text)] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff] rounded"
                            >
                              <span>Scope this capability</span>
                              <ArrowUpRight
                                className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                                aria-hidden="true"
                              />
                            </motion.button>
                          </div>
                        </div>

                        <BlueprintVisual
                          capability={cap}
                          isActive={isActive}
                          shouldReduceMotion={Boolean(shouldReduceMotion)}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
      </div>
    </section>
  );
}
