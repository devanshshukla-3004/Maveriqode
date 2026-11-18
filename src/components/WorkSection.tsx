import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, ExternalLink, Layers3, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { ServiceOption } from '../data/maveriqodeData';
import { EditorialSerifAccent } from './EditorialSerifAccent';
import { supabase } from '../lib/supabase';

interface WorkSectionProps {
  onRequestSimilar: (service: ServiceOption, contextNote: string) => void;
}

export type WorkBuild = { number: string; name: string; type: string; description: string; url: string; label: string; visual: string; tags: string[]; imageUrl?: string; imageStoragePath?: string; published?: boolean };

export const fallbackBuilds: WorkBuild[] = [
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

function ProjectThumbnail({ visual }: { visual: string }) {
  const palettes: Record<string, { accent: string; soft: string; title: string; subtitle: string }> = {
    education: { accent: '#b99aff', soft: '#eee8ff', title: 'Learn. Grow. Achieve.', subtitle: 'Your learning journey starts here.' },
    institute: { accent: '#83c8ff', soft: '#e5f4ff', title: 'Shape your future.', subtitle: 'Explore programmes and campus life.' },
    fitness: { accent: '#ffad70', soft: '#fff0e4', title: 'TRAIN WITH PURPOSE', subtitle: 'Your fitness journey, managed.' },
    health: { accent: '#82dfc2', soft: '#e5fff6', title: 'A healthier smile.', subtitle: 'Care designed around you.' },
  };
  const p = palettes[visual] ?? palettes.education;
  return (
    <div className="absolute inset-x-[7%] bottom-[-24%] top-[24%] rotate-[-2deg] overflow-hidden rounded-t-[15px] border border-white/30 bg-[#f8f7fb] shadow-[0_24px_65px_rgba(0,0,0,.42)] transition-transform duration-700 group-hover:rotate-0 group-hover:scale-[1.025]">
      <div className="flex h-7 items-center gap-1.5 border-b border-black/5 bg-white px-3">
        <i className="h-1.5 w-1.5 rounded-full bg-[#ff7777]" /><i className="h-1.5 w-1.5 rounded-full bg-[#f3c45e]" /><i className="h-1.5 w-1.5 rounded-full bg-[#65c98b]" />
        <span className="ml-2 h-1.5 w-24 rounded-full bg-[#e9e7ef]" />
        <span className="ml-auto h-1.5 w-9 rounded-full bg-[#e9e7ef]" />
      </div>
      {visual === 'fitness' ? (
        <div className="grid h-full grid-cols-[30%_1fr]">
          <div className="space-y-3 bg-[#171522] p-3"><div className="h-3 w-16 rounded bg-white/80"/><div className="mt-6 h-2 w-full rounded bg-white/20"/><div className="h-2 w-4/5 rounded bg-white/15"/><div className="h-2 w-5/6 rounded bg-white/15"/><div className="mt-8 h-7 rounded-md bg-[#ff9c5c]"/></div>
          <div className="p-4"><div className="h-3 w-2/5 rounded bg-[#242235]"/><div className="mt-3 grid grid-cols-3 gap-2">{['Active','Plans','Visits'].map((x,i)=><div key={x} className="rounded-lg bg-white p-2 shadow-sm"><div className="h-1.5 w-8 rounded bg-[#d8d5e0]"/><div className="mt-2 text-sm font-bold text-[#262337]">{['128','06','42'][i]}</div></div>)}</div><div className="mt-3 h-20 rounded-lg bg-gradient-to-r from-[#ffe2cc] to-[#fff4eb] p-3"><div className="h-2 w-20 rounded bg-[#eaa16e]"/><div className="mt-4 flex h-7 items-end gap-1">{[30,55,42,75,58,90,66,82].map((v,i)=><i key={i} className="flex-1 rounded-t bg-[#ee9a62]" style={{height:v+'%'}}/>)}</div></div></div>
        </div>
      ) : (
        <div className="h-full p-4 sm:p-5">
          <div className="flex items-center justify-between"><div className="h-2.5 w-16 rounded bg-[#292638]"/><div className="flex gap-2"><i className="h-1.5 w-7 rounded bg-[#d9d6e1]"/><i className="h-1.5 w-7 rounded bg-[#d9d6e1]"/><i className="h-1.5 w-7 rounded bg-[#d9d6e1]"/></div></div>
          <div className="mt-4 grid grid-cols-[1.1fr_.9fr] gap-3">
            <div className="flex min-h-[115px] flex-col justify-center rounded-lg p-3 sm:p-4" style={{background:p.soft}}><div className="text-[8px] font-bold tracking-[.16em]" style={{color:p.accent}}>WELCOME</div><div className="mt-2 max-w-[180px] text-sm font-extrabold leading-tight text-[#242033] sm:text-lg">{p.title}</div><div className="mt-2 h-1.5 w-4/5 rounded bg-black/10"/><div className="mt-1.5 h-1.5 w-3/5 rounded bg-black/10"/><div className="mt-3 h-5 w-16 rounded-full" style={{background:p.accent}}/></div>
            <div className="rounded-lg bg-white p-2 shadow-sm"><div className="h-16 rounded-md" style={{background:'linear-gradient(135deg,'+p.accent+',#d7d4ef)'}}/><div className="mt-2 h-2 w-4/5 rounded bg-[#d9d6e1]"/><div className="mt-1.5 h-1.5 w-3/5 rounded bg-[#eceaf0]"/><div className="mt-3 grid grid-cols-2 gap-1.5"><i className="h-7 rounded bg-[#f0eef5]"/><i className="h-7 rounded bg-[#f0eef5]"/></div></div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">{[0,1,2].map(i=><div key={i} className="rounded-md bg-white p-2 shadow-sm"><div className="h-7 rounded" style={{background:p.soft}}/><div className="mt-2 h-1.5 w-4/5 rounded bg-[#d9d6e1]"/><div className="mt-1 h-1.5 w-3/5 rounded bg-[#eceaf0]"/></div>)}</div>
        </div>
      )}
    </div>
  );
}

export function WorkSection({ onRequestSimilar }: WorkSectionProps) {
  const reduceMotion = useReducedMotion();
  const [builds, setBuilds] = useState<WorkBuild[]>(fallbackBuilds);
  useEffect(() => { let active = true; void supabase.from('website_content').select('content,status').eq('slug','work').eq('status','published').maybeSingle().then((result: { data: { content: unknown } | null; error: unknown }) => { const { data, error } = result; if (!active || error || !data || !data.content || typeof data.content !== 'object' || Array.isArray(data.content)) return; const items = (data.content as {items?: unknown}).items; if (Array.isArray(items)) { const valid = items.filter((item): item is WorkBuild => Boolean(item) && typeof item === 'object' && !Array.isArray(item) && typeof (item as WorkBuild).name === 'string' && typeof (item as WorkBuild).url === 'string' && (item as WorkBuild).published !== false); if (valid.length) setBuilds(valid); } }); return () => { active = false; }; }, []);

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
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--mq-border)] bg-[var(--mq-surface)] px-3.5 py-2 font-mono text-[9px] tracking-[.14em] text-[var(--mq-muted)]"><span className="h-1.5 w-1.5 rounded-full bg-[#a66bff]" />{builds.length} DEMONSTRATION BUILDS</div>
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
              <div className={`relative h-[250px] overflow-hidden bg-gradient-to-br sm:h-[300px] ${visualStyles[build.visual] || visualStyles.education}`}>
                <div aria-hidden="true" className="absolute inset-0 opacity-[.18]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.24) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.24) 1px,transparent 1px)', backgroundSize: '34px 34px' }} />
                <div aria-hidden="true" className="absolute -right-14 -top-28 h-80 w-80 rounded-full border border-white/15 shadow-[0_0_0_28px_rgba(255,255,255,.025),0_0_0_58px_rgba(255,255,255,.02)] transition-transform duration-700 group-hover:rotate-12 group-hover:scale-105" />
                {build.imageUrl ? <img src={build.imageUrl} alt={`${build.name} preview`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /> : <ProjectThumbnail visual={build.visual} />}
                <div className="absolute left-6 top-5 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c18aff]" />
                  <span className="font-mono text-[8px] tracking-[.16em] text-white/80">DEMONSTRATION BUILD</span>
                </div>
                <div className="absolute bottom-5 left-6 right-6 z-10 flex items-end justify-between">
                  <div className="max-w-[75%]">
                    <p className="font-mono text-[9px] tracking-[.18em] text-white/65">MAVERIQODE / BUILD {build.number}</p>
                    <p className="mt-1 text-xl font-bold leading-tight tracking-[-.045em] text-white drop-shadow sm:text-2xl">{build.name}</p>
                  </div>
                  <span className="font-mono text-3xl font-light tracking-[-.08em] text-white/50">{build.number}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
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
