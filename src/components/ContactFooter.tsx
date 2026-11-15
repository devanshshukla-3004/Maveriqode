import { FormEvent, useEffect, useState, RefObject } from 'react';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import {
  NavSectionId,
  PRIMARY_NAV_ITEMS,
  ServiceOption,
} from '../data/maveriqodeData';
import { ScrollReveal } from './ScrollReveal';

interface ContactFooterProps {
  selectedService: ServiceOption;
  onServiceChange: (service: ServiceOption) => void;
  contextNote: string;
  onContextNoteChange: (note: string) => void;
  nameInputRef: RefObject<HTMLInputElement | null>;
  onNavigate: (id: NavSectionId) => void;
  onNotify: (title: string, description: string) => void;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  'Web & App Development',
  'AI Automation & Agents',
  'AI & Web Security Audit',
  'Brand & UI/UX Design',
];

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
  const [submittedBrief, setSubmittedBrief] = useState<{
    name: string;
    email: string;
    service: ServiceOption;
    note: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setErrorMessage('Please enter your name or company name.');
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!emailValid) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    setErrorMessage('');
    const brief = {
      name: trimmedName,
      email: trimmedEmail,
      service: selectedService,
      note: contextNote.trim(),
    };
    setSubmittedBrief(brief);
    onNotify(
      'Project brief submitted',
      `Prepared for ${brief.name} (${brief.service}). Response SLA is under 4 hours.`
    );

    const subject = encodeURIComponent(`Project Inquiry: ${brief.service} — ${brief.name}`);
    const body = encodeURIComponent(
      `Hi MAVERIQODE Team,\n\nName/Company: ${brief.name}\nEmail: ${brief.email}\nInterested In: ${brief.service}${
        brief.note ? `\nScope Context: ${brief.note}` : ''
      }\n\nLet's discuss our project scope.`
    );
    window.location.href = `mailto:hello@maveriqode.tech?subject=${subject}&body=${body}`;
  };

  const handleCopyBrief = async () => {
    if (!submittedBrief) return;
    const text = `MAVERIQODE Project Brief\nName/Company: ${submittedBrief.name}\nEmail: ${submittedBrief.email}\nTrack: ${submittedBrief.service}${
      submittedBrief.note ? `\nScope: ${submittedBrief.note}` : ''
    }\nDirect Contact: hello@maveriqode.tech`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onNotify('Brief copied to clipboard', 'Ready to paste into your email or Slack.');
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer
      id="contact"
      className="scroll-mt-20 pt-24 pb-12 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200"
    >
      <ScrollReveal className="max-w-[1440px] mx-auto flex flex-col gap-12">
        <div>
          <p className="font-mono text-xs text-[#A78BFA] mb-4">05 · Contact</p>
          <h2 className="font-display font-extrabold text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.03em] text-white text-balance">
            Ready to ship
            <br />
            something{' '}
            <span className="bg-gradient-to-br from-[#A855F7] to-[#3B82F6] bg-clip-text text-transparent">
              iconic?
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16 items-end">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 max-w-[560px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="leadName" className="sr-only">
                  Your Name or Company
                </label>
                <input
                  ref={nameInputRef}
                  id="leadName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name / Company"
                  className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-white placeholder-[var(--mq-muted)] text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="leadEmail" className="sr-only">
                  Work Email
                </label>
                <input
                  id="leadEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work Email"
                  className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-white placeholder-[var(--mq-muted)] text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
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
                className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-white text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#151923] text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="leadContext" className="sr-only">
                Project Scope or Goals (Optional)
              </label>
              <input
                id="leadContext"
                type="text"
                value={contextNote}
                onChange={(e) => onContextNoteChange(e.target.value)}
                placeholder="Project scope, target timeline, or architecture goals (optional)"
                className="w-full px-4 py-3.5 rounded-[10px] bg-[var(--mq-surface)] border border-[var(--mq-border)] text-white placeholder-[var(--mq-muted)] text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
              />
            </div>

            {errorMessage && (
              <p role="alert" className="font-mono text-xs text-rose-400">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="py-4 px-6 rounded-[10px] bg-gradient-to-br from-[#7C3AED] to-[#2563EB] text-white font-semibold text-sm hover:opacity-95 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Send Project Brief
            </button>

            {submittedBrief && (
              <div
                role="status"
                className="mt-1 p-4 rounded-xl bg-[var(--mq-surface)] border border-[#34D399]/35 font-mono text-xs text-[var(--mq-text-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2 text-[#34D399]">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Brief prepared for {submittedBrief.name} ({submittedBrief.service}).
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyBrief}
                    className="inline-flex items-center gap-1.5 text-white hover:text-[#A78BFA] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{copied ? 'Copied' : 'Copy Brief'}</span>
                  </button>
                  <a
                    href={`mailto:hello@maveriqode.tech?subject=${encodeURIComponent(
                      `Project Inquiry: ${submittedBrief.service} — ${submittedBrief.name}`
                    )}`}
                    className="inline-flex items-center gap-1 text-[#93C5FD] hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            )}
          </form>

          <div className="flex flex-col gap-3 font-mono text-sm">
            <span className="text-xs text-[#A78BFA] tracking-wider">Direct Channels</span>
            <a
              href="mailto:hello@maveriqode.tech"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#A78BFA] transition-colors w-fit"
            >
              <span>hello@maveriqode.tech</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="https://maveriqode.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#A78BFA] transition-colors w-fit"
            >
              <span>maveriqode.tech</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <p className="text-xs text-[var(--mq-muted)] mt-1">
              Response SLA: Under 4 hours during business days.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--mq-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-[var(--mq-muted)]">
          <span>&copy; 2026 MAVERIQODE Digital Engineering. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-5">
            {PRIMARY_NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="hover:text-white transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
