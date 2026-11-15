import { FormEvent, useEffect, useState, RefObject } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  CAPABILITIES,
  NavSectionId,
  OFFICIAL_CONTACT_EMAIL,
  PRIMARY_NAV_ITEMS,
  ServiceOption,
} from '../data/maveriqodeData';
import { EditorialSerifAccent } from './EditorialSerifAccent';
import { AmbientSoundToggle } from './AmbientSoundToggle';
import {
  SECTION_VIEWPORT,
  STAGGER_CONTAINER_VARIANTS,
  TEXT_REVEAL_VARIANTS,
} from '../utils/motionVariants';

interface ContactFooterProps {
  selectedService: ServiceOption;
  onServiceChange: (service: ServiceOption) => void;
  contextNote: string;
  onContextNoteChange: (note: string) => void;
  nameInputRef: RefObject<HTMLInputElement | null>;
  onNavigate: (id: NavSectionId) => void;
  onNotify: (title: string, description: string) => void;
}

const SERVICE_OPTIONS: ServiceOption[] = CAPABILITIES.map((cap) => cap.title);

export function ContactFooter({
  selectedService,
  onServiceChange,
  contextNote,
  onContextNoteChange,
  nameInputRef,
  onNavigate,
  onNotify,
}: ContactFooterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [preparedInquiry, setPreparedInquiry] = useState<{
    name: string;
    email: string;
    service: ServiceOption;
    note: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const buildMailtoHref = (inquiry: {
    name: string;
    email: string;
    service: ServiceOption;
    note: string;
  }) => {
    const subject = encodeURIComponent(
      `Engineering Inquiry: ${inquiry.service} — ${inquiry.name}`
    );
    const body = encodeURIComponent(
      `Hello MAVERIQODE,\n\nName / Organization: ${inquiry.name}\nReply Email: ${inquiry.email}\nCapability Area: ${inquiry.service}${
        inquiry.note ? `\nProblem / Scope Notes: ${inquiry.note}` : ''
      }\n\nLet's discuss next steps.`
    );
    return `mailto:${OFFICIAL_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setErrorMessage('Please enter your name or organization.');
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    const inquiry = {
      name: trimmedName,
      email: trimmedEmail,
      service: selectedService,
      note: contextNote.trim(),
    };

    const { error } = await supabase.from('website_enquiries').insert({
      name: inquiry.name,
      email: inquiry.email,
      service: inquiry.service,
      message: inquiry.note || '',
      status: 'new',
      admin_notes: '',
    });

    setIsSubmitting(false);
    if (error) {
      setErrorMessage('We could not send your request right now. Please email ' + OFFICIAL_CONTACT_EMAIL + ' directly.');
      onNotify('Message not sent', 'Please try again or contact us by email.');
      return;
    }

    setPreparedInquiry(inquiry);
    onNotify('Enquiry received', 'Your request has been securely submitted to MAVERIQODE.');
    setName('');
    setEmail('');
    onContextNoteChange('');
  };

  const handleCopyBrief = async () => {
    if (!preparedInquiry) return;
    const text = `MAVERIQODE Engineering Inquiry\nTo: ${OFFICIAL_CONTACT_EMAIL}\nName / Organization: ${preparedInquiry.name}\nReply Email: ${preparedInquiry.email}\nCapability Area: ${preparedInquiry.service}${
      preparedInquiry.note ? `\nScope Notes: ${preparedInquiry.note}` : ''
    }`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onNotify(
        'Prepared message copied',
        `Paste directly into an email addressed to ${OFFICIAL_CONTACT_EMAIL}.`
      );
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer
      id="contact"
      className="scroll-mt-20 pt-24 pb-12 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      <motion.div
        variants={shouldReduceMotion ? undefined : STAGGER_CONTAINER_VARIANTS}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView={shouldReduceMotion ? undefined : 'visible'}
        viewport={shouldReduceMotion ? undefined : SECTION_VIEWPORT}
        className="max-w-[1440px] mx-auto flex flex-col gap-12"
      >
        <div>
          <motion.p
            variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
            className="font-mono text-xs text-[var(--mq-accent-soft)] mb-4"
          >
            05 · Contact
          </motion.p>
          <motion.h2
            variants={shouldReduceMotion ? undefined : TEXT_REVEAL_VARIANTS}
            className="font-display font-extrabold text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.03em] text-[var(--mq-text)] text-balance"
          >
            Bring us the{' '}
            <EditorialSerifAccent targetTracking="-0.015em">
              problem.
            </EditorialSerifAccent>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16 items-start">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 max-w-[580px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="leadName" className="sr-only">
                  Your Name or Organization
                </label>
                <input
                  ref={nameInputRef}
                  id="leadName"
                  type="text"
                  maxLength={120}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name / Organization"
                  className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-[var(--mq-text)] placeholder-[var(--mq-muted)] text-sm focus:outline-none focus:border-[#a100ff] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="leadEmail" className="sr-only">
                  Email Address
                </label>
                <input
                  id="leadEmail"
                  type="email"
                  maxLength={254}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-[var(--mq-text)] placeholder-[var(--mq-muted)] text-sm focus:outline-none focus:border-[#a100ff] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="leadService" className="sr-only">
                Select Engineering Capability
              </label>
              <select
                id="leadService"
                value={selectedService}
                onChange={(e) => onServiceChange(e.target.value as ServiceOption)}
                className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-[var(--mq-text)] text-sm focus:outline-none focus:border-[#a100ff] transition-colors"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#15161a] text-[#ecebe6]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="leadContext" className="sr-only">
                Problem Summary or Technical Context (Optional)
              </label>
              <input
                id="leadContext"
                type="text"
                maxLength={5000}
                value={contextNote}
                onChange={(e) => onContextNoteChange(e.target.value)}
                placeholder="Problem summary, system context, or technical goals (optional)"
                className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-[var(--mq-text)] placeholder-[var(--mq-muted)] text-sm focus:outline-none focus:border-[#a100ff] transition-colors"
              />
            </div>

            <AnimatePresence initial={false}>
              {errorMessage && (
                <motion.p
                  key="form-error"
                  role="alert"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-mono text-xs text-rose-400"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={shouldReduceMotion ? undefined : { y: -1.5 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
              className="py-4 px-6 rounded-[10px] bg-gradient-to-br from-[#a100ff] to-[#2a00c8] text-[#ecebe6] font-semibold text-sm hover:opacity-95 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecebe6]"
            >
              {isSubmitting ? 'Sending securely…' : 'Send enquiry'}
            </motion.button>

            <p className="text-xs text-[var(--mq-muted)] leading-relaxed">
              Your message is securely submitted to the MAVERIQODE team. You can also reach us at{' '}
              <span className="font-mono text-[var(--mq-text-secondary)]">
                {OFFICIAL_CONTACT_EMAIL}
              </span>
              . We store your enquiry so the team can respond.
            </p>

            <AnimatePresence initial={false}>
              {preparedInquiry && (
                <motion.div
                  key="prepared-status"
                  role="status"
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-1 p-4 rounded-xl bg-[var(--mq-surface)] border border-[var(--mq-border-strong)] font-mono text-xs text-[var(--mq-text-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2 text-[var(--mq-text)]">
                    <Check
                      className="w-4 h-4 text-[var(--mq-accent-soft)] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Your enquiry has been received for {preparedInquiry.name} ({preparedInquiry.service}). The MAVERIQODE team can now review it.
                    </span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyBrief}
                      className="inline-flex items-center gap-1.5 text-[var(--mq-text)] hover:text-[var(--mq-accent-soft)] transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{copied ? 'Copied' : 'Copy Message'}</span>
                    </button>
                    <a
                      href={buildMailtoHref(preparedInquiry)}
                      className="inline-flex items-center gap-1 text-[#93c5fd] hover:text-[var(--mq-text)] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Send follow-up email</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="flex flex-col gap-3 font-mono text-sm lg:pt-1">
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -2, scale: 1.02, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
              }
              className="w-24 h-24 rounded-2xl overflow-hidden border border-[var(--mq-border)] hover:border-[#a100ff]/55 bg-black p-2 mb-1 transition-colors duration-200"
            >
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_21.51.02__1__3fcdf05a.jpeg"
                alt="MAVERIQODE official brand emblem"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain select-none"
              />
            </motion.div>
            <span className="text-xs text-[var(--mq-accent-soft)] tracking-wider">
              Direct Engineering Email
            </span>
            <a
              href={`mailto:${OFFICIAL_CONTACT_EMAIL}`}
              className="group inline-flex items-center gap-1.5 text-[var(--mq-text)] hover:text-[var(--mq-accent-soft)] transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff] rounded"
            >
              <span>{OFFICIAL_CONTACT_EMAIL}</span>
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <p className="text-xs font-sans text-[var(--mq-muted)] leading-relaxed max-w-[40ch] mt-1">
              Share your problem statement, constraints, or architecture questions directly by email.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--mq-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-[var(--mq-muted)]">
          <span className="inline-flex items-center gap-2.5">
            <img
              src="/assets/aistudio/MAVERIQODE_symbol_only_transparent_149367a9.png"
              alt="MAVERIQODE symbol"
              referrerPolicy="no-referrer"
              className="h-4 w-auto object-contain shrink-0 select-none"
            />
            <span>&copy; 2026 MAVERIQODE. Digital Engineering &amp; Technology.</span>
          </span>
          <div className="flex flex-wrap items-center gap-5">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="hover:text-[var(--mq-text)] transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
            <AmbientSoundToggle />
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
