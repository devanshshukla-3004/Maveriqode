import { KeyboardEvent, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { COMPANY_FAQS, EXECUTION_STEPS } from '../data/maveriqodeData';
import { ScrollReveal } from './ScrollReveal';

const COMMITMENTS = [
  { value: '< 4 hrs', label: 'Response SLA on Business Days' },
  { value: '24 hrs', label: 'Architecture & Milestone Blueprint' },
  { value: '100%', label: 'Full Source-Code Handover' },
  { value: 'Weekly', label: 'Live Staging Deployments' },
];

export function CompanySection() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(COMPANY_FAQS[0].id);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleFaqKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = COMPANY_FAQS.length;
    let nextIndex: number | null = null;

    if (e.key === 'ArrowDown') {
      nextIndex = (index + 1) % count;
    } else if (e.key === 'ArrowUp') {
      nextIndex = (index - 1 + count) % count;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = count - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      triggerRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <section
      id="company"
      className="scroll-mt-20 py-24 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      <div className="max-w-[1440px] mx-auto">
        <ScrollReveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs text-[#A78BFA] mb-3">01 · Company</p>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.03em] text-white text-balance mb-6">
              Senior engineering teams, zero outsourced handoffs.
            </h2>
            <p className="text-[var(--mq-text-secondary)] text-base sm:text-lg leading-relaxed max-w-[62ch]">
              MAVERIQODE is a digital engineering, AI systems, and security practice built for teams that cannot afford fragile prototypes or opaque timelines. You work directly with the engineers writing your architecture, shipping production code every week.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {COMMITMENTS.map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl bg-[var(--mq-surface)] border border-[var(--mq-border)] transition-colors duration-200"
              >
                <div className="font-display font-bold text-2xl sm:text-3xl text-white tabular-nums mb-1.5">
                  {item.value}
                </div>
                <div className="text-xs text-[var(--mq-muted)] leading-snug">{item.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal
          delay={0.08}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {EXECUTION_STEPS.map((item) => (
            <div
              key={item.step}
              className="p-7 rounded-2xl bg-[var(--mq-surface)] border border-[var(--mq-border)] flex flex-col justify-between transition-colors duration-200"
            >
              <div>
                <span className="block font-mono text-xs text-[#A78BFA] mb-3">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--mq-muted)] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </ScrollReveal>

        {/* Engineering Process FAQ Accordion */}
        <ScrollReveal
          delay={0.12}
          className="pt-16 border-t border-[var(--mq-border)] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
        >
          <div className="lg:col-span-5">
            <p className="font-mono text-xs text-[#93C5FD] mb-3">
              Engineering Process · FAQ
            </p>
            <h3 className="font-display font-extrabold text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.08] tracking-[-0.02em] text-white text-balance mb-4">
              Common questions on how we build and ship.
            </h3>
            <p className="text-sm sm:text-base text-[var(--mq-muted)] leading-relaxed max-w-[44ch]">
              Clear answers on sprint cadence, intellectual property, security validation, and collaborating with your team.
            </p>
          </div>

          <div className="lg:col-span-7 border-t border-[var(--mq-border)]">
            {COMPANY_FAQS.map((faq, index) => {
              const isOpen = openFaqId === faq.id;
              const triggerId = `faq-trigger-${faq.id}`;
              const panelId = `faq-panel-${faq.id}`;

              return (
                <div
                  key={faq.id}
                  className="border-b border-[var(--mq-border)]"
                >
                  <h4>
                    <button
                      ref={(el) => {
                        triggerRefs.current[index] = el;
                      }}
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqId((prev) => (prev === faq.id ? null : faq.id))}
                      onKeyDown={(e) => handleFaqKeyDown(e, index)}
                      className="w-full py-5 sm:py-6 text-left flex items-center justify-between gap-4 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
                    >
                      <span
                        className={`text-base sm:text-lg font-semibold leading-snug transition-colors duration-150 ${
                          isOpen
                            ? 'text-white'
                            : 'text-[var(--mq-text-secondary)] group-hover:text-white'
                        }`}
                      >
                        {faq.question}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? 'rotate-180 text-[#A78BFA]'
                            : 'text-[var(--mq-muted)] group-hover:text-white'
                        }`}
                      />
                    </button>
                  </h4>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows,opacity] duration-250 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-8 text-sm sm:text-[15px] text-[var(--mq-muted)] leading-relaxed">
                        {faq.answer}
                      </p>
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
