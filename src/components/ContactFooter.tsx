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

          <div className="flex flex-col gap-5 font-mono text-sm lg:pt-1">
            <div className="relative overflow-hidden rounded-[28px] border border-[var(--mq-border)] bg-[linear-gradient(145deg,rgba(25,20,42,.92),rgba(10,12,24,.96))] p-4 sm:p-6 shadow-[0_28px_90px_rgba(0,0,0,.28)]">
              <div aria-hidden="true" className="absolute inset-0 mq-blueprint-grid opacity-35" />
              <div className="relative z-10 mb-1 flex items-center justify-between gap-3">
                <span className="font-mono text-[9px] tracking-[.22em] text-[#c5a3ff]">MAVERIQODE / CORE ATELIER</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-2.5 py-1 font-mono text-[9px] text-emerald-200"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> SYSTEMS THINKING</span>
              </div>
              <svg viewBox="0 0 520 420" role="img" aria-label="MAVERIQODE core atelier connecting software engineering, AI systems, automation, security and infrastructure" className="relative z-10 mx-auto block w-full max-w-[520px] overflow-visible">
                <defs>
                  <radialGradient id="mqCoreGlow"><stop offset="0%" stopColor="#8b35ef" stopOpacity=".25"/><stop offset="100%" stopColor="#8b35ef" stopOpacity="0"/></radialGradient>
                  <linearGradient id="mqCoreLine" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a100ff"/><stop offset="100%" stopColor="#4b68ff"/></linearGradient>
                </defs>
                <circle cx="260" cy="210" r="188" fill="none" stroke="rgba(190,160,255,.12)" strokeDasharray="2 8" className="mq-footer-orbit"/>
                <circle cx="260" cy="210" r="150" fill="url(#mqCoreGlow)"/>
                <g fill="none" stroke="url(#mqCoreLine)" strokeWidth="1.6" opacity=".9">
                  <path className="mq-footer-orbit-line" d="M260 210 L115 92"/><path className="mq-footer-orbit-line" d="M260 210 L350 55"/><path className="mq-footer-orbit-line" d="M260 210 L438 246"/><path className="mq-footer-orbit-line" d="M260 210 L290 365"/><path className="mq-footer-orbit-line" d="M260 210 L78 310"/>
                </g>
                <g fill="#a88aff"><circle cx="187" cy="150" r="2.6"/><circle cx="307" cy="130" r="2.6"/><circle cx="350" cy="226" r="2.6"/><circle cx="275" cy="286" r="2.6"/><circle cx="168" cy="260" r="2.6"/></g>
                <g className="mq-footer-orbit-node">
                  <circle cx="260" cy="210" r="55" fill="#f0eef8" stroke="#a100ff" strokeWidth="2.2"/>
                  <text x="260" y="205" textAnchor="middle" fill="#202437" fontSize="11" fontWeight="700">MAVERIQODE</text>
                  <text x="260" y="224" textAnchor="middle" fill="#8051c9" fontSize="9" fontFamily="monospace">Core Atelier</text>
                </g>
                {[
                  {x:115,y:92,title:'INFRA',sub:'Cloud Fabric'},
                  {x:350,y:55,title:'SOFTWARE',sub:'Engineering'},
                  {x:438,y:246,title:'AI SYSTEMS',sub:'Intelligence'},
                  {x:290,y:365,title:'AUTOMATION',sub:'Integration'},
                  {x:78,y:310,title:'SECURITY',sub:'Hardening'}
                ].map((node) => (
                  <g key={node.title} className="mq-footer-orbit-node">
                    <circle cx={node.x} cy={node.y} r="39" fill="#f1f2f7" stroke="#cbd0df" strokeWidth="1"/>
                    <text x={node.x} y={node.y-2} textAnchor="middle" fill="#273044" fontSize="10" fontWeight="700">{node.title}</text>
                    <text x={node.x} y={node.y+13} textAnchor="middle" fill="#657086" fontSize="8.5" fontFamily="monospace">{node.sub}</text>
                  </g>
                ))}
              </svg>
              <p className="relative z-10 mx-auto max-w-[38ch] text-center font-sans text-xs leading-6 text-[var(--mq-muted)]">One connected engineering practice. From infrastructure and security to intelligent systems and automation.</p>
            </div>
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
              Business Enquiries
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
              Tell us about your business goals, required service, and project scope. Our team will get back to you.
            </p>
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
            <AmbientSoundToggle />
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
