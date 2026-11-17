import { ArrowRight, ArrowUpRight, ExternalLink, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { ServiceOption } from '../data/maveriqodeData';
import { EditorialSerifAccent } from './EditorialSerifAccent';

interface WorkSectionProps {
  onRequestSimilar: (service: ServiceOption, contextNote: string) => void;
}

const builds = [
  {
    number: '01',
    name: 'Sanskriti Coaching Institute',
    type: 'Education · Institute website & system',
    description: 'A demonstration build exploring a digital presence and connected institute experience for a coaching environment.',
    url: 'https://coaching-institute-system-pi.vercel.app/',
    label: 'Explore demo',
    visual: 'education',
    tags: ['Education', 'Web Experience', 'Institute System'],
  },
  {
    number: '02',
    name: 'Luminary Institute of Technology & Sciences',
    type: 'Education · Institute website & system',
    description: 'A concept implementation presenting an institute-focused web experience and structured information architecture.',
    url: 'https://institute-demo-v1-maveriqode.vercel.app/',
    label: 'Explore demo',
    visual: 'institute',
    tags: ['Institutional', 'Information Architecture', 'Web'],
  },
  {
    number: '03',
    name: 'Warrior Fitness',
    type: 'Fitness · Membership management system',
    description: 'A gym operations demonstration focused on membership-oriented workflows and a digital management experience.',
    url: 'https://gymmanagementsystem-six.vercel.app/',
    label: 'Explore demo',
    visual: 'fitness',
    tags: ['Fitness', 'Memberships', 'Operations'],
  },
  {
    number: '04',
    name: 'BrightSmile Dental Studio',
    type: 'Healthcare · Website & operations portal',
    description: 'A dental studio demonstration combining a public-facing web presence with an operations-portal concept.',
    url: 'https://brightsmile-dental-studio-zeta.vercel.app/',
    label: 'Explore demo',
    visual: 'health',
    tags: ['Healthcare', 'Web Experience', 'Operations Portal'],
  },
];

const principles = [
  { n: '01', title: 'Understand the system', body: 'Map the users, workflows, data and constraints before choosing an implementation.' },
  { n: '02', title: 'Build with clear boundaries', body: 'Keep interfaces, permissions, integrations and responsibilities explicit.' },
  { n: '03', title: 'Make it ready to evolve', body: 'Prioritise maintainability, security and a handover the team can actually own.' },
];

const visualStyles: Record<string, string> = {
  education: 'from-[#24123d] via-[#30205b] to-[#15152b]',
  institute: 'from-[#142b40] via-[#1b3152] to-[#17172f]',
  fitness: 'from-[#332018] via-[#38243a] to-[#171321]',
  health: 'from-[#153632] via-[#1b3544] to-[#171b2d]',
};

export function WorkSection({ onRequestSimilar }: WorkSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="work" className="relative isolate overflow-hidden scroll-mt-20 bg-[var(--mq-bg)] px-5 py-24 transition-colors duration-200 sm:px-8 lg:px-12 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-60" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-24 h-[480px] w-[480px] rounded-full bg-[#7c2cff]/10 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-[38%] h-[520px] w-[520px] rounded-full bg-[#3158d8]/10 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .2 }}
          transition={{ duration: .65, ease: [0.22, 1, .36, 1] }}
          className="mb-14 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end"
        >
          <div>
            <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[.24em] text-[var(--mq-accent-soft)]"><span className="h-px w-8 bg-[#9b55ff]" />04 / SELECTED WORK</p>
            <h2 className="max-w-4xl text-balance font-display text-[clamp(2.8rem,6vw,5.7rem)] font-extrabold leading-[.96] tracking-[-.065em] text-[var(--mq-text)]">
              Ideas made <EditorialSerifAccent targetTracking="-0.025em">tangible.</EditorialSerifAccent>
            </h2>
          </div>
          <div className="lg:justify-self-end lg:max-w-[470px]">
            <p className="text-sm leading-7 text-[var(--mq-text-secondary)] sm:text-base">A look at selected demonstration builds across education, fitness and healthcare. Each one explores how thoughtful software can shape a clearer digital experience.</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--mq-border)] bg-[var(--mq-surface)] px-3.5 py-2 font-mono text-[9px] tracking-[.14em] text-[var(--mq-muted)]"><span className="h-1.5 w-1.5 rounded-full bg-[#a66bff]" />4 DEMONSTRATION BUILDS</div>
          </div>
        </motion.div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--mq-border)] pb-4">
          <p className="font-mono text-[10px] tracking-[.18em] text-[var(--mq-muted)]">SELECTED DEMONSTRATION BUILDS</p>
          <p className="font-mono text-[9px] tracking-[.12em] text-[var(--mq-muted)]">CONCEPT & PRODUCT EXPLORATIONS · NOT CLIENT CASE STUDIES</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {builds.map((build, index) => (
            <motion.article
              key={build.number}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .12 }}
              transition={{ duration: .58, delay: index * .07, ease: [0.22, 1, .36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="group relative overflow-hidden rounded-[24px] border border-[var(--mq-border)] bg-[var(--mq-surface-card)]"
            >
              <div className={`relative h-[230px] overflow-hidden bg-gradient-to-br sm:h-[270px] ${visualStyles[build.visual]}`}>
                <div aria-hidden="true" className="absolute inset-0 opacity-[.18]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.24) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.24) 1px,transparent 1px)', backgroundSize: '34px 34px' }} />
                <div aria-hidden="true" className="absolute -right-14 -top-28 h-80 w-80 rounded-full border border-white/15 shadow-[0_0_0_28px_rgba(255,255,255,.025),0_0_0_58px_rgba(255,255,255,.02)] transition-transform duration-700 group-hover:rotate-12 group-hover:scale-105" />
                <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c18aff]" />
                  <span className="font-mono text-[8px] tracking-[.16em] text-white/80">DEMONSTRATION BUILD</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div className="max-w-[75%]">
                    <p className="font-mono text-[9px] tracking-[.18em] text-white/55">MAVERIQODE / BUILD {build.number}</p>
                    <p className="mt-2 text-2xl font-bold leading-tight tracking-[-.045em] text-white sm:text-3xl">{build.name}</p>
                  </div>
                  <span className="font-mono text-4xl font-light tracking-[-.08em] text-white/35">{build.number}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
              </div>
              <div className="p-6 sm:p-7">
                <p className="font-mono text-[9px] uppercase tracking-[.16em] text-[var(--mq-accent-soft)]">{build.type}</p>
                <p className="mt-3 min-h-[48px] max-w-[58ch] text-sm leading-6 text-[var(--mq-text-secondary)]">{build.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {build.tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--mq-border)] px-2.5 py-1.5 font-mono text-[9px] text-[var(--mq-muted)]">{tag}</span>)}
                </div>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--mq-border)] pt-5">
                  <span className="font-mono text-[8px] tracking-[.12em] text-[var(--mq-muted)]">INDEPENDENT DEMO / CONCEPT</span>
                  <a href={build.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--mq-border-strong)] bg-[var(--mq-surface)] px-4 py-2.5 text-[10px] font-semibold text-[var(--mq-text)] transition hover:border-[#a66bff]/50 hover:bg-[#7627bd]/10">
                    {build.label}<ExternalLink size={13}/>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-20 grid gap-10 border-y border-[var(--mq-border)] py-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16 lg:py-16">
          <div>
            <p className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[.18em] text-[var(--mq-accent-soft)]"><Layers3 size={14}/> HOW WE APPROACH THE BUILD</p>
            <h3 className="max-w-md font-display text-3xl font-bold leading-tight tracking-[-.045em] text-[var(--mq-text)] sm:text-4xl">Good software starts before the first line of code.</h3>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--mq-muted)]">The work is not just the interface. It is the structure underneath it — clear workflows, considered architecture and security built into the process.</p>
          </div>
          <div className="grid gap-0 sm:grid-cols-3">
            {principles.map((item, index) => (
              <motion.div key={item.n} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .45, delay: index * .07 }} className="border-t border-[var(--mq-border)] py-5 sm:border-l sm:border-t-0 sm:px-5 sm:first:border-l-0 sm:first:pl-0">
                <p className="font-mono text-xs text-[var(--mq-accent-soft)]">{item.n}</p>
                <h4 className="mt-4 text-base font-bold text-[var(--mq-text)]">{item.title}</h4>
                <p className="mt-3 text-xs leading-6 text-[var(--mq-muted)]">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative mt-16 overflow-hidden rounded-[26px] border border-[#a66bff]/20 bg-[linear-gradient(115deg,rgba(118,39,189,.16),rgba(49,88,216,.10)_55%,rgba(12,12,20,.2))] p-7 sm:p-10 lg:p-12">
          <div aria-hidden="true" className="absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10 shadow-[0_0_0_30px_rgba(255,255,255,.02),0_0_0_65px_rgba(255,255,255,.015)]" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[.18em] text-[var(--mq-accent-soft)]"><Sparkles size={13}/> HAVE A PROJECT IN MIND?</p>
              <h3 className="text-balance font-display text-3xl font-bold leading-tight tracking-[-.045em] text-[var(--mq-text)] sm:text-4xl">Let’s make the next build <EditorialSerifAccent>meaningful.</EditorialSerifAccent></h3>
              <p className="mt-4 text-sm leading-6 text-[var(--mq-text-secondary)]">Tell us what you are trying to build. We’ll start with the problem, map the scope and discuss a practical next step.</p>
            </div>
            <button type="button" onClick={() => onRequestSimilar('Software Engineering', 'I viewed the MAVERIQODE demonstration builds and would like to discuss a project.')} className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#7627bd] to-[#3548b8] px-6 py-3.5 text-xs font-semibold text-white shadow-[0_10px_32px_rgba(106,48,190,.22)] transition hover:-translate-y-1 hover:shadow-[0_14px_38px_rgba(106,48,190,.32)]">
              Start a conversation <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 text-[10px] leading-5 text-[var(--mq-muted)]"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--mq-accent-soft)]"/><p>Transparency note: The projects above are independent demonstration builds created to explore product and system experiences. They are not presented as paid client engagements, endorsements or measured business outcomes.</p></div>
      </div>
    </section>
  );
}
