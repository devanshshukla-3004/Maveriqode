import { FormEvent, KeyboardEvent, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Mail } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  COMPANY_FAQS,
  COMPANY_PRINCIPLES,
  EXECUTION_STEPS,
  OFFICIAL_CONTACT_EMAIL,
} from '../data/maveriqodeData';
import { EditorialSerifAccent } from './EditorialSerifAccent';
import {
  CARD_STAGGER_VARIANTS,
  INNER_TEXT_VARIANTS,
  MQ_EASE,
  SECTION_VIEWPORT,
  STAGGER_CONTAINER_VARIANTS,
  TEXT_REVEAL_VARIANTS,
} from '../utils/motionVariants';

interface CompanySectionProps {
  onNotify: (title: string, description: string) => void;
}

export function CompanySection({ onNotify }: CompanySectionProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(COMPANY_FAQS[0].id);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [preparedAddress, setPreparedAddress] = useState<string | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

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

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!isValid) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }

    setNewsletterError('');
    setPreparedAddress(trimmed);
    setNewsletterEmail('');

    onNotify(
      'Subscription draft prepared',
      `Your email application is opening to send your dispatch request (${trimmed}) to ${OFFICIAL_CONTACT_EMAIL}.`
    );

    const subject = encodeURIComponent('MAVERIQODE Engineering Dispatches — Subscription');
    const body = encodeURIComponent(
      `Hello MAVERIQODE,\n\nPlease add ${trimmed} to technical notes and engineering dispatches.\n`
    );
    window.location.href = `mailto:${OFFICIAL_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="company"
      className="relative overflow-hidden scroll-mt-20 py-24 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-85"
      />
      <div className="relative z-10 max-w-[1440px] mx-auto">
        {/* Editorial Company Identity & Architectural Principles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          <motion.div
            variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
            className="lg:col-span-6"
          >
            <motion.p
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="font-mono text-xs text-[var(--mq-accent-soft)] mb-3"
            >
              05 · Company
            </motion.p>
            <motion.h2
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="font-display font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.03] tracking-[-0.03em] text-[var(--mq-text)] text-balance mb-6"
            >
              Precision engineering,{' '}
              <EditorialSerifAccent targetTracking="-0.01em">
                without the layers.
              </EditorialSerifAccent>
            </motion.h2>
            <motion.p
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="text-[var(--mq-text-secondary)] text-base sm:text-lg leading-relaxed max-w-[58ch] mb-4"
            >
              MAVERIQODE is a digital engineering and technology company focused on designing and building durable software products, applied AI systems, operational automation, security controls, and cloud infrastructure.
            </motion.p>
            <motion.p
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="text-[var(--mq-muted)] text-sm sm:text-base leading-relaxed max-w-[58ch]"
            >
              We approach software as architecture first—defining system boundaries, data integrity, and failure modes before writing application code.
            </motion.p>
          </motion.div>

          <motion.div
            variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
            className="lg:col-span-6 border-t border-[var(--mq-border)]"
          >
            {COMPANY_PRINCIPLES.map((principle) => (
              <motion.div
                key={principle.index}
                variants={shouldReduceMotion ? undefined : CARD_STAGGER_VARIANTS}
                className="py-6 border-b border-[var(--mq-border)] grid grid-cols-1 sm:grid-cols-[72px_1fr] gap-2 sm:gap-5 items-baseline"
              >
                <motion.span
                  variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                  className="font-mono text-xs text-[var(--mq-accent-soft)] tabular-nums"
                >
                  {principle.index}
                </motion.span>
                <div>
                  <motion.h3
                    variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                    className="text-lg font-bold text-[var(--mq-text)] tracking-tight mb-1.5"
                  >
                    {principle.title}
                  </motion.h3>
                  <motion.p
                    variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                    className="text-sm text-[var(--mq-muted)] leading-relaxed"
                  >
                    {principle.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Engineering Process Stages */}
        <motion.div
          variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {EXECUTION_STEPS.map((item) => (
            <motion.div
              key={item.step}
              variants={shouldReduceMotion ? undefined : CARD_STAGGER_VARIANTS}
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              transition={{ duration: 0.18, ease: MQ_EASE }}
              className="p-7 rounded-2xl bg-[var(--mq-surface)] border border-[var(--mq-border)] hover:border-[#a100ff]/50 flex flex-col justify-between transition-colors duration-200"
            >
              <div>
                <motion.span
                  variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                  className="block font-mono text-xs text-[var(--mq-accent-soft)] mb-3"
                >
                  {item.step}
                </motion.span>
                <motion.h3
                  variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                  className="text-xl font-bold text-[var(--mq-text)] tracking-tight mb-2.5"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                  className="text-sm text-[var(--mq-muted)] leading-relaxed"
                >
                  {item.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Engineering Process FAQ Accordion */}
        <div className="pt-16 border-t border-[var(--mq-border)] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16">
          <motion.div
            variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
            className="lg:col-span-5"
          >
            <motion.p
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="font-mono text-xs text-[#93c5fd] mb-3"
            >
              Engineering Process · FAQ
            </motion.p>
            <motion.h3
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="font-display font-extrabold text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.08] tracking-[-0.02em] text-[var(--mq-text)] text-balance mb-4"
            >
              How we structure and deliver engineering work.
            </motion.h3>
            <motion.p
              variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
              className="text-sm sm:text-base text-[var(--mq-muted)] leading-relaxed max-w-[44ch]"
            >
              Direct answers regarding scope definition, codebase ownership, technical visibility, and security practices.
            </motion.p>
          </motion.div>

          <motion.div
            variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView={shouldReduceMotion ? undefined : 'visible'}
            viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
            className="lg:col-span-7 border-t border-[var(--mq-border)]"
          >
            {COMPANY_FAQS.map((faq, index) => {
              const isOpen = openFaqId === faq.id;
              const triggerId = `faq-trigger-${faq.id}`;
              const panelId = `faq-panel-${faq.id}`;

              return (
                <motion.div
                  key={faq.id}
                  variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
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
                      className="w-full py-5 sm:py-6 text-left flex items-center justify-between gap-4 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff] rounded"
                    >
                      <span
                        className={`text-base sm:text-lg font-semibold leading-snug transition-colors duration-150 ${
                          isOpen
                            ? 'text-[var(--mq-text)]'
                            : 'text-[var(--mq-text-secondary)] group-hover:text-[var(--mq-text)]'
                        }`}
                      >
                        {faq.question}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? 'rotate-180 text-[var(--mq-accent-soft)]'
                            : 'text-[var(--mq-muted)] group-hover:text-[var(--mq-text)]'
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Discreet Engineering Dispatches Signup at Bottom of Company Section */}
        <motion.div
          variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
          initial={shouldReduceMotion ? false : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
          className="pt-12 border-t border-[var(--mq-border)]"
        >
          <motion.div
            variants={shouldReduceMotion ? undefined : CARD_STAGGER_VARIANTS}
            className="rounded-2xl bg-[var(--mq-surface)] border border-[var(--mq-border)] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="max-w-[54ch]">
              <motion.p
                variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                className="font-mono text-xs text-[var(--mq-accent-soft)] mb-2"
              >
                Engineering Dispatches
              </motion.p>
              <motion.h3
                variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                className="text-lg sm:text-xl font-bold text-[var(--mq-text)] tracking-tight mb-1.5"
              >
                Architecture notes &amp; system updates
              </motion.h3>
              <motion.p
                variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
                className="text-sm text-[var(--mq-muted)] leading-relaxed"
              >
                Receive occasional engineering notes on software architecture, AI systems, and security. Submitting opens your email client addressed to{' '}
                <span className="text-[var(--mq-text-secondary)] font-mono text-xs">
                  {OFFICIAL_CONTACT_EMAIL}
                </span>
                .
              </motion.p>
            </div>

            <motion.div
              variants={shouldReduceMotion ? undefined : INNER_TEXT_VARIANTS}
              className="w-full lg:w-auto lg:min-w-[400px]"
            >
              <form
                onSubmit={handleNewsletterSubmit}
                noValidate
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <label htmlFor="company-dispatch-email" className="sr-only">
                  Email address for engineering dispatches
                </label>
                <div className="relative flex-1">
                  <Mail
                    className="w-4 h-4 text-[var(--mq-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="company-dispatch-email"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="you@organization.com"
                    className="w-full pl-10 pr-4 py-3 rounded-[10px] bg-[var(--mq-surface-inset)] border border-[var(--mq-border)] text-sm text-[var(--mq-text)] placeholder-[var(--mq-muted)] focus:outline-none focus:border-[#a100ff] transition-colors"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={shouldReduceMotion ? undefined : { y: -1.5 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] bg-gradient-to-br from-[#a100ff] to-[#2a00c8] text-[#ecebe6] text-xs font-semibold hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecebe6]"
                >
                  <span>Request Notes</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </motion.button>
              </form>

              {newsletterError && (
                <p role="alert" className="mt-2 font-mono text-xs text-rose-400">
                  {newsletterError}
                </p>
              )}

              {preparedAddress && !newsletterError && (
                <p role="status" className="mt-2 font-mono text-xs text-[var(--mq-accent-soft)]">
                  Prepared email draft for {preparedAddress} to {OFFICIAL_CONTACT_EMAIL}.
                </p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
