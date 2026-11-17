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
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [preparedInquiry, setPreparedInquiry] = useState<{
    name: string;
    company: string;
    phone: string;
    email: string;
    service: ServiceOption;
    plan: string;
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
    company: string;
    phone: string;
    email: string;
    service: ServiceOption;
    plan: string;
    note: string;
  }) => {
    const subject = encodeURIComponent(`Project Enquiry: ${inquiry.plan || inquiry.service} — ${inquiry.name}`);
    const body = encodeURIComponent([
      'Hello MAVERIQODE,',
      '',
      `Contact Person: ${inquiry.name}`,
      `Business / Organization: ${inquiry.company || 'Not provided'}`,
      `Phone: ${inquiry.phone}`,
      `Reply Email: ${inquiry.email}`,
      `Required Service: ${inquiry.service}`,
      `Interested Plan: ${inquiry.plan || 'Not selected'}`,
      inquiry.note ? `Project Details: ${inquiry.note}` : '',
      '',
      'Please contact me to discuss the next steps.',
    ].filter(Boolean).join('\n'));
    return `mailto:${OFFICIAL_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const website = (e.currentTarget.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';

    if (trimmedName.length < 2) {
      setErrorMessage('Please enter your name or organization.');
      return;
    }

    if (!/^\+?[0-9][0-9\s().-]{6,18}$/.test(trimmedPhone)) {
      setErrorMessage('Please enter a valid phone number with country code.');
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
      company: company.trim(),
      phone: trimmedPhone,
      email: trimmedEmail,
      service: selectedService,
      plan,
      note: contextNote.trim(),
    };

    const { error } = await supabase.functions.invoke('website-enquiry', {
      body: {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        service: inquiry.service,
        message: [
          inquiry.company ? `Business / Organization: ${inquiry.company}` : '',
          inquiry.plan ? `Interested Plan: ${inquiry.plan}` : '',
          inquiry.note ? `Project Details: ${inquiry.note}` : '',
        ].filter(Boolean).join('\n\n'),
        website,
      },
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
    setCompany('');
    setPhone('');
    setPlan('');
    setEmail('');
    onContextNoteChange('');
  };

  const handleCopyBrief = async () => {
    if (!preparedInquiry) return;
    const text = [
      'MAVERIQODE Project Enquiry',
      `To: ${OFFICIAL_CONTACT_EMAIL}`,
      `Contact Person: ${preparedInquiry.name}`,
      `Business / Organization: ${preparedInquiry.company || 'Not provided'}`,
      `Phone: ${preparedInquiry.phone}`,
      `Reply Email: ${preparedInquiry.email}`,
      `Required Service: ${preparedInquiry.service}`,
      `Interested Plan: ${preparedInquiry.plan || 'Not selected'}`,
      preparedInquiry.note ? `Project Details: ${preparedInquiry.note}` : '',
    ].filter(Boolean).join('\n');

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
      className="relative isolate scroll-mt-20 overflow-hidden pt-24 pb-10 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a100ff]/70 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-12 h-[560px] w-[560px] rounded-full bg-[#7026d9]/10 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 bottom-0 h-[420px] w-[420px] rounded-full bg-[#3158d8]/[0.07] blur-[150px]" />
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
            <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="leadWebsite">Leave this field empty</label>
              <input id="leadWebsite" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
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
                  placeholder="Contact Person / Your Name"
                  className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-[var(--mq-text)] placeholder-[var(--mq-muted)] text-sm focus:outline-none focus:border-[#a100ff] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="leadCompany" className="sr-only">Business / Organization (Optional)</label>
                <input
                  id="leadCompany"
                  type="text"
                  maxLength={160}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Business / Organization (Optional)"
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
              <label htmlFor="leadPhone" className="sr-only">Phone Number</label>
              <input
                id="leadPhone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={24}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number (with country code)"
                className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-[var(--mq-text)] placeholder-[var(--mq-muted)] text-sm focus:outline-none focus:border-[#a100ff] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="leadService" className="sr-only">
                Select Required Service
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
              <label htmlFor="leadPlan" className="sr-only">Interested Plan (Optional)</label>
              <select
                id="leadPlan"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-[var(--mq-text)] text-sm focus:outline-none focus:border-[#a100ff] transition-colors"
              >
                <option value="" className="bg-[#15161a] text-[#ecebe6]">Interested Plan (Optional)</option>
                <option value="Website Development" className="bg-[#15161a] text-[#ecebe6]">Website Development</option>
                <option value="Complete Business System" className="bg-[#15161a] text-[#ecebe6]">Complete Business System</option>
                <option value="Website + SEO Starter" className="bg-[#15161a] text-[#ecebe6]">Website + SEO Starter</option>
                <option value="Business Automation" className="bg-[#15161a] text-[#ecebe6]">Business Automation</option>
                <option value="Mobile App Development" className="bg-[#15161a] text-[#ecebe6]">Mobile App Development</option>
                <option value="Not sure — need guidance" className="bg-[#15161a] text-[#ecebe6]">Not sure — need guidance</option>
              </select>
            </div>

            <div>
              <label htmlFor="leadContext" className="sr-only">
                Project Details / What do you need? (Optional)
              </label>
              <textarea
                id="leadContext"
                rows={4}
                maxLength={5000}
                value={contextNote}
                onChange={(e) => onContextNoteChange(e.target.value)}
                placeholder="Briefly describe your business, project requirements, goals, or timeline (optional)"
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
                      Your enquiry is in. Our team will review the details and reach out using your preferred contact information.
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

          <div className="flex flex-col gap-6 lg:pt-1">
            <div className="relative isolate overflow-hidden rounded-[28px] border border-[var(--mq-border)] bg-[var(--mq-surface)] p-7 sm:p-9">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#7c3aed]/15 blur-[75px]" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#3158d8]/10 blur-[70px]" />
              <div className="relative z-10 flex items-center justify-between gap-4">
                <img src="/assets/aistudio/MAVERIQODE_symbol_only_transparent_149367a9.png" alt="MAVERIQODE symbol" referrerPolicy="no-referrer" className="h-11 w-auto object-contain select-none" />
                <span className="rounded-full border border-[var(--mq-border)] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.18em] text-[var(--mq-muted)]">Digital Engineering</span>
              </div>
              <div className="relative z-10 mt-6 sm:mt-7">
                <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[var(--mq-accent-soft)]">MAVERIQODE / BUSINESS</p>
                <h3 className="mt-4 max-w-[15ch] font-display text-3xl sm:text-4xl font-bold leading-[1.05] tracking-[-.035em] text-[var(--mq-text)]">Build what moves you <span className="text-[var(--mq-accent-soft)]">forward.</span></h3>
                <p className="mt-5 max-w-[38ch] font-sans text-sm leading-7 text-[var(--mq-muted)]">Thoughtful software, intelligent systems and digital experiences — engineered around the way your business works.</p>
              </div>
              <div className="relative z-10 mt-9 grid grid-cols-2 gap-3">
                {['Software Engineering', 'AI Systems', 'Business Automation', 'Cloud & Security'].map((item) => (
                  <div key={item} className="flex items-center gap-2 border-t border-[var(--mq-border)] pt-3 font-mono text-[10px] leading-5 text-[var(--mq-text-secondary)]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#a100ff]" />{item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[22px] border border-[var(--mq-border)] bg-[var(--mq-surface)]/70 p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[var(--mq-muted)]">Have a project in mind?</p>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-semibold text-[var(--mq-text)]">Let’s talk business.</p>
                  <a href={`mailto:${OFFICIAL_CONTACT_EMAIL}`} className="group mt-1 inline-flex items-center gap-1.5 break-all font-mono text-xs text-[var(--mq-accent-soft)] hover:text-[var(--mq-text)] transition-colors">
                    {OFFICIAL_CONTACT_EMAIL}<ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </a>
                </div>
                <button type="button" onClick={() => nameInputRef.current?.focus()} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[var(--mq-border-strong)] px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-[var(--mq-text)] transition-all hover:border-[#a100ff]/70 hover:bg-[#a100ff]/[.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff]">
                  Start an enquiry <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative pt-8 border-t border-[var(--mq-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-[var(--mq-muted)]">
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
            <a href="/admin" className="hover:text-[var(--mq-text)] transition-colors whitespace-nowrap">Admin</a>
            <AmbientSoundToggle />
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
