import { ReactNode, useEffect, useState } from 'react';
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { COMPANY_FAQS } from '../data/maveriqodeData';

type Entry = {
  eyebrow?: string;
  title?: string;
  description?: string;
  details?: string[];
  tags?: string[];
  meta?: string;
};
type ProcessEntry = { step?: string; title?: string; description?: string };
type FaqEntry = { question?: string; answer?: string };
type PageContent = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  secondaryIntro?: string;
  principles?: Entry[];
  items?: Entry[];
  process?: ProcessEntry[];
  faqs?: FaqEntry[];
  note?: string;
  ctaLabel?: string;
  ctaHref?: string;
};
type RecordData = { title: string; content: PageContent };

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const list = (value: unknown): string[] => Array.isArray(value) ? value.filter((x): x is string => typeof x === 'string' && Boolean(x.trim())).slice(0, 12) : [];
const entries = (value: unknown): Entry[] => Array.isArray(value) ? value.filter((x): x is Entry => Boolean(x) && typeof x === 'object' && !Array.isArray(x)).slice(0, 12) : [];
const processes = (value: unknown): ProcessEntry[] => Array.isArray(value) ? value.filter((x): x is ProcessEntry => Boolean(x) && typeof x === 'object' && !Array.isArray(x)).slice(0, 8) : [];
const faqs = (value: unknown): FaqEntry[] => Array.isArray(value) ? value.filter((x): x is FaqEntry => Boolean(x) && typeof x === 'object' && !Array.isArray(x)).slice(0, 12) : [];

export function ManagedPageSection({ slug, children }: { slug: 'company' | 'capabilities' | 'solutions' | 'work'; children: ReactNode }) {
  const [record, setRecord] = useState<RecordData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    void supabase.from('website_content').select('title,content').eq('slug', slug).eq('status', 'published').maybeSingle()
      .then(({ data, error }: { data: any; error: any }) => {
        if (!active) return;
        if (!error && data && data.content && typeof data.content === 'object' && !Array.isArray(data.content)) {
          const content = data.content as PageContent;
          if (text(content.heading) || text(content.intro) || entries(content.items).length || entries(content.principles).length) {
            setRecord({ title: data.title, content });
          }
        }
        setLoaded(true);
      });
    return () => { active = false; };
  }, [slug]);

  if (!loaded || !record) return <>{children}</>;

  const content = record.content;
  const principles = entries(content.principles);
  const items = entries(content.items);
  const steps = processes(content.process);
  const questions = faqs(content.faqs);
  const visibleQuestions = isCompany && questions.length === 0 ? COMPANY_FAQS : questions;
  const isCompany = slug === 'company';
  const href = text(content.ctaHref);
  const safeHref = href.startsWith('mailto:') || href.startsWith('https://') || href.startsWith('#') ? href : '#contact';

  return (
    <section id={slug} className="relative overflow-hidden scroll-mt-20 py-24 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)] transition-colors duration-200">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-75" />
      <div className="relative z-10 max-w-[1440px] mx-auto">
        <div className={isCompany ? 'grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16' : 'flex flex-wrap items-end justify-between gap-5 mb-12'}>
          <div className={isCompany ? 'lg:col-span-6' : 'max-w-3xl'}>
            <p className="font-mono text-xs text-[var(--mq-accent-soft)] mb-3">{text(content.eyebrow) || `0${['company','capabilities','solutions','work'].indexOf(slug)+1} · ${slug}`}</p>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.04] tracking-[-0.03em] text-[var(--mq-text)] text-balance">{text(content.heading) || record.title}</h2>
            {text(content.intro) && <p className="mt-6 text-[var(--mq-text-secondary)] text-base sm:text-lg leading-relaxed max-w-[64ch]">{text(content.intro)}</p>}
            {text(content.secondaryIntro) && <p className="mt-4 text-[var(--mq-muted)] text-sm sm:text-base leading-relaxed max-w-[64ch]">{text(content.secondaryIntro)}</p>}
          </div>
          {!isCompany && text(content.note) && <p className="font-mono text-xs text-[var(--mq-muted)] max-w-sm">{text(content.note)}</p>}
          {isCompany && principles.length > 0 && <div className="lg:col-span-6 border-t border-[var(--mq-border)]">{principles.map((item, index) => (
            <motion.article key={index} initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .4, delay: index * .06 }} className="py-6 border-b border-[var(--mq-border)] grid grid-cols-1 sm:grid-cols-[72px_1fr] gap-2 sm:gap-5">
              <span className="font-mono text-xs text-[var(--mq-accent-soft)]">{text(item.eyebrow) || String(index+1).padStart(2,'0')}</span>
              <div>{text(item.title) && <h3 className="text-lg font-bold text-[var(--mq-text)] mb-1.5">{text(item.title)}</h3>}{text(item.description) && <p className="text-sm text-[var(--mq-muted)] leading-relaxed">{text(item.description)}</p>}</div>
            </motion.article>
          ))}</div>}
        </div>

        {!isCompany && items.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item, index) => <motion.article key={index} initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .42, delay: index * .045 }} whileHover={reduceMotion ? undefined : { y: -4 }} className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-7 flex flex-col">
            {text(item.eyebrow) && <p className="font-mono text-[10px] uppercase tracking-[.14em] text-[var(--mq-accent-soft)] mb-3">{text(item.eyebrow)}</p>}
            {text(item.title) && <h3 className="text-xl font-bold text-[var(--mq-text)] tracking-tight">{text(item.title)}</h3>}
            {text(item.description) && <p className="mt-3 text-sm text-[var(--mq-muted)] leading-relaxed">{text(item.description)}</p>}
            {list(item.details).length > 0 && <ul className="mt-5 space-y-2.5">{list(item.details).map((detail, i) => <li key={i} className="flex gap-2.5 text-xs leading-relaxed text-[var(--mq-text-secondary)]"><Check size={14} className="mt-0.5 shrink-0 text-[var(--mq-accent-soft)]"/><span>{detail}</span></li>)}</ul>}
            {list(item.tags).length > 0 && <div className="flex flex-wrap gap-2 mt-auto pt-6">{list(item.tags).map((tag, i) => <span key={i} className="rounded-full border border-[var(--mq-border)] px-2.5 py-1 text-[10px] font-mono text-[var(--mq-muted)]">{tag}</span>)}</div>}
            {text(item.meta) && <p className="mt-5 pt-4 border-t border-[var(--mq-border)] font-mono text-[10px] text-[var(--mq-accent-soft)]">{text(item.meta)}</p>}
          </motion.article>)}
        </div>}

        {isCompany && steps.length > 0 && <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {steps.map((step, index) => <motion.article key={index} initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .4, delay: index * .06 }} className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-7">
            {text(step.step) && <p className="font-mono text-xs text-[var(--mq-accent-soft)] mb-3">{text(step.step)}</p>}
            {text(step.title) && <h3 className="text-xl font-bold text-[var(--mq-text)] mb-2.5">{text(step.title)}</h3>}
            {text(step.description) && <p className="text-sm text-[var(--mq-muted)] leading-relaxed">{text(step.description)}</p>}
          </motion.article>)}
        </div>}

        {visibleQuestions.length > 0 && <div className="pt-12 border-t border-[var(--mq-border)] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5"><p className="font-mono text-xs text-[var(--mq-accent-soft)] mb-3">ENGINEERING PROCESS · FAQ</p><h3 className="font-display font-extrabold text-3xl text-[var(--mq-text)]">Clear answers. No hidden layers.</h3></div>
          <div className="lg:col-span-7 border-t border-[var(--mq-border)]">{visibleQuestions.map((faq,index) => <div key={index} className="border-b border-[var(--mq-border)]">
            <button type="button" aria-expanded={openFaq===index} onClick={()=>setOpenFaq(openFaq===index?-1:index)} className="w-full py-5 text-left flex justify-between items-center gap-4 text-sm sm:text-base font-semibold text-[var(--mq-text)]">{text(faq.question)}<ChevronDown size={18} className={openFaq===index?'rotate-180 transition-transform':'transition-transform'}/></button>
            {openFaq===index && <p className="pb-5 pr-8 text-sm text-[var(--mq-muted)] leading-relaxed">{text(faq.answer)}</p>}
          </div>)}</div>
        </div>}

        {text(content.ctaLabel) && <div className="mt-12 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-6 sm:p-8"><p className="text-lg font-semibold text-[var(--mq-text)]">{text(content.ctaLabel)}</p><a href={safeHref} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#a100ff] to-[#2a00c8] px-5 py-3 text-xs font-semibold text-white">Start a conversation <ArrowUpRight size={15}/></a></div>}
      </div>
    </section>
  );
}
