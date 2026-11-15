import { useState } from 'react';
import { Plus, ArrowUpRight } from 'lucide-react';
import { CAPABILITIES, ServiceOption } from '../data/maveriqodeData';
import { ScrollReveal } from './ScrollReveal';

interface CapabilitiesSectionProps {
  onRequestService: (service: ServiceOption, contextNote?: string) => void;
}

export function CapabilitiesSection({ onRequestService }: CapabilitiesSectionProps) {
  const [activeId, setActiveId] = useState<string>(CAPABILITIES[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [spotCoords, setSpotCoords] = useState<Record<string, { x: number; y: number }>>({});

  const handleToggle = (id: string) => {
    setActiveId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="capabilities"
      className="scroll-mt-20 py-24 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      <div className="max-w-[1440px] mx-auto">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-xs text-[#A78BFA] mb-3">
              02 · Capabilities — Select a row to inspect
            </p>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4.2vw,3.6rem)] leading-none tracking-[-0.03em] text-white">
              What We Engineer
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--mq-muted)]">End-to-End Ownership</span>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div
            className="flex flex-col border-t border-[var(--mq-border)]"
            onMouseLeave={() => setHoveredId(null)}
          >
          {CAPABILITIES.map((cap) => {
            const isActive = activeId === cap.id;
            const isDimmed = hoveredId !== null && hoveredId !== cap.id && !isActive;
            const coords = spotCoords[cap.id];

            return (
              <div
                key={cap.id}
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
                          ? `radial-gradient(650px circle at ${coords.x}px ${coords.y}px, rgba(124, 58, 237, 0.14), transparent 70%)`
                          : 'radial-gradient(650px circle at 50% 50%, rgba(124, 58, 237, 0.10), transparent 70%)',
                      }
                    : undefined
                }
                className={`border-b border-[var(--mq-border)] overflow-hidden transition-opacity duration-300 ${
                  isDimmed ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(cap.id)}
                  aria-expanded={isActive}
                  className="w-full text-left py-7 sm:py-8 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-[115px_1.4fr_1.1fr_48px] items-center gap-4 md:gap-6 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
                >
                  <span className="font-mono text-xs text-[#A78BFA] tabular-nums">
                    {cap.index} · {cap.code}
                  </span>

                  <h3 className="text-xl sm:text-2xl lg:text-[1.85rem] font-bold tracking-[-0.02em] text-white transition-transform duration-300 group-hover:translate-x-2">
                    {cap.title}
                  </h3>

                  <p className="text-sm text-[var(--mq-muted)] leading-relaxed">{cap.brief}</p>

                  <span
                    aria-hidden="true"
                    className={`hidden md:flex items-center justify-end transition-transform duration-300 ${
                      isActive ? 'rotate-45 text-[#60A5FA]' : 'text-[var(--mq-muted)]'
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
                    <div className="px-2 sm:px-4 pb-8 md:pl-[calc(115px+2.5rem)] grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6 lg:gap-10 items-center">
                      <div>
                        <p className="text-sm sm:text-[15px] text-[var(--mq-text-secondary)] leading-relaxed">
                          {cap.description}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-[var(--mq-muted)]">
                          {cap.stack.map((tech, idx) => (
                            <span key={tech} className="inline-flex items-center gap-2.5">
                              <span>{tech}</span>
                              {idx < cap.stack.length - 1 && (
                                <span aria-hidden="true" className="text-[#64748B]">
                                  ·
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onRequestService(
                              cap.serviceOption,
                              `Interested in ${cap.title}`
                            )
                          }
                          className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#C4B5FD] hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                        >
                          <span>Scope this capability</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="p-5 rounded-xl bg-[var(--mq-surface-widget)] border border-[#8B5CF6]/35 font-mono transition-colors duration-200">
                        <div className="flex items-center justify-between text-xs gap-2">
                          <span className="text-[#93C5FD]">{cap.metricLabel}</span>
                          <span className="text-[#34D399] font-semibold tabular-nums">
                            {cap.metricValue}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] transition-all duration-700 ease-out"
                            style={{ width: isActive ? `${cap.targetWidth}%` : '0%' }}
                          />
                        </div>
                        <p className="mt-2.5 text-[11px] text-[var(--mq-muted)] leading-snug">
                          {cap.metricCaption}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
