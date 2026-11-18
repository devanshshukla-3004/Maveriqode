import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowRight, Layers3, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { fallbackBuilds, type WorkBuild } from './WorkSection';

const categories = [
  { id: 'all', name: 'All work', note: 'Complete portfolio' },
  { id: 'Software Engineering', name: 'Software Engineering', note: 'Web platforms & systems' },
  { id: 'AI & Intelligent Systems', name: 'AI & Intelligent Systems', note: 'Applied AI & RAG' },
  { id: 'Automation & Integration', name: 'Automation & Integration', note: 'Connected workflows' },
  { id: 'SaaS & Product Development', name: 'SaaS & Product Development', note: 'Products & portals' },
  { id: 'Cybersecurity', name: 'Cybersecurity', note: 'Security engineering' },
  { id: 'Digital Infrastructure', name: 'Digital Infrastructure', note: 'Cloud & operations' },
];

type PortfolioBuild = WorkBuild & { category?: string };

function inferCategory(item: PortfolioBuild) {
  if (item.category && categories.some((x) => x.id === item.category)) return item.category;
  const value = (item.type + ' ' + item.tags.join(' ')).toLowerCase();
  if (/education|institute|coaching|school|college/.test(value)) return 'Software Engineering';
  if (/ai|intelligent|rag|machine learning/.test(value)) return 'AI & Intelligent Systems';
  if (/automation|integration|workflow/.test(value)) return 'Automation & Integration';
  if (/saas|product|membership|portal|management system/.test(value)) return 'SaaS & Product Development';
  if (/security|cyber/.test(value)) return 'Cybersecurity';
  if (/cloud|infrastructure|devops/.test(value)) return 'Digital Infrastructure';
  return 'Software Engineering';
}

function VisualFallback({ item }: { item: PortfolioBuild }) {
  const tones: Record<string, string> = {
    education: 'from-violet-950 via-indigo-900 to-slate-950',
    institute: 'from-sky-950 via-blue-900 to-slate-950',
    fitness: 'from-orange-950 via-rose-950 to-slate-950',
    health: 'from-emerald-950 via-teal-900 to-slate-950',
  };
  return <div className={`absolute inset-0 overflow-hidden bg-gradient-to-br ${tones[item.visual] || 'from-[#211333] via-[#101b36] to-[#08090d]'}`}>
    <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/10 shadow-[0_0_90px_rgba(173,91,255,.18)]" />
    <div className="absolute -bottom-24 left-[12%] h-72 w-72 rounded-full border border-white/10" />
    <div className="absolute inset-0 opacity-20" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.16) 1px,transparent 1px)',backgroundSize:'34px 34px',maskImage:'linear-gradient(to bottom,black,transparent)'}} />
    <div className="absolute inset-x-7 bottom-7 rounded-2xl border border-white/15 bg-black/20 p-5 backdrop-blur-md sm:inset-x-10 sm:bottom-10 sm:p-7">
      <span className="text-[9px] font-semibold tracking-[.28em] text-white/50">MAVERIQODE / PROJECT PREVIEW</span>
      <div className="mt-3 max-w-lg text-2xl font-semibold tracking-tight text-white sm:text-4xl">{item.name}</div>
      <div className="mt-4 h-px w-2/3 bg-gradient-to-r from-white/50 to-transparent" />
      <div className="mt-3 text-[10px] uppercase tracking-[.2em] text-white/50">{item.type}</div>
    </div>
  </div>;
}

export default function WorkPage() {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<PortfolioBuild[]>(fallbackBuilds);
  const [active, setActive] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    void supabase.from('website_content').select('content,status').eq('slug','work').eq('status','published').maybeSingle()
      .then(({data}) => {
        if (!alive) return;
        const content = data?.content as {items?: PortfolioBuild[]} | null;
        if (Array.isArray(content?.items)) setItems(content.items.filter((x) => x && x.published !== false));
        setLoading(false);
      })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const visible = useMemo(() => items.filter((x) => x.published !== false && (active === 'all' || inferCategory(x) === active)), [items, active]);
  const categoryCounts = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.id === 'all' ? items.filter((x) => x.published !== false).length : items.filter((x) => x.published !== false && inferCategory(x) === c.id).length])), [items]);
  const reveal = reduceMotion ? {initial:false as const, animate:{opacity:1,y:0}} : {initial:{opacity:0,y:24},animate:{opacity:1,y:0}};

  return <div className="min-h-screen overflow-hidden bg-[#07070a] text-[#f1eff5]">
    <div className="pointer-events-none fixed inset-0 opacity-30" style={{backgroundImage:'radial-gradient(ellipse at 14% 8%,rgba(132,48,195,.2),transparent 34%),radial-gradient(ellipse at 85% 34%,rgba(45,67,150,.16),transparent 38%)'}} />
    <header className="sticky top-0 z-40 border-b border-white/[.08] bg-[#08080c]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="/" className="flex items-center gap-3 text-sm font-extrabold tracking-[.16em]"><img src="/assets/aistudio/MAVERIQODE_symbol_only_transparent_149367a9.png" alt="" className="h-6 w-auto"/><span>MAVERIQODE</span></a>
        <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex"><a href="/#solutions" className="transition hover:text-white">Solutions</a><a href="/#capabilities" className="transition hover:text-white">Capabilities</a><span className="text-white">Work</span><a href="/#company" className="transition hover:text-white">Company</a></nav>
        <a href="/#contact" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold transition hover:border-violet-300/60 hover:bg-white/[.06]">Start a project <ArrowUpRight size={14}/></a>
      </div>
    </header>

    <main className="relative mx-auto max-w-[1440px] px-5 pb-28 pt-16 sm:px-8 sm:pt-24 lg:px-12">
      <motion.div {...reveal} transition={{duration:.75,ease:[.16,1,.3,1]}} className="max-w-4xl">
        <a href="/" className="mb-9 inline-flex items-center gap-2 text-xs text-white/45 transition hover:text-white"><ArrowLeft size={14}/> Back to home</a>
        <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold tracking-[.3em] text-violet-200/70"><span className="h-px w-8 bg-violet-300/70"/><Sparkles size={13}/> SELECTED WORK & DEMONSTRATIONS</div>
        <h1 className="text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-7xl lg:text-[104px]">Built with<br/><span className="bg-gradient-to-r from-[#e7d7ff] via-[#b78bff] to-[#7c91ff] bg-clip-text text-transparent">intent.</span></h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">A growing archive of digital products, platforms and engineering experiments across the systems we build.</p>
        <div className="mt-10 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[.2em] text-white/35"><span className="rounded-full border border-white/10 px-4 py-2">Portfolio archive</span><span className="rounded-full border border-white/10 px-4 py-2">{items.filter(x=>x.published!==false).length.toString().padStart(2,'0')} published builds</span><span className="rounded-full border border-white/10 px-4 py-2">6 engineering categories</span></div>
      </motion.div>

      <section className="mt-20 border-t border-white/10 pt-8 sm:mt-28">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><div className="text-[10px] tracking-[.25em] text-violet-200/60">EXPLORE BY DISCIPLINE</div><h2 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">Browse the work</h2></div><p className="max-w-md text-sm leading-6 text-white/40">Choose a service category to explore related projects and demonstrations.</p></div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c,i)=><motion.button key={c.id} type="button" onClick={()=>setActive(c.id)} initial={reduceMotion?false:{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.45,delay:reduceMotion?0:i*.045}} className={`group relative min-h-[112px] overflow-hidden rounded-2xl border p-4 text-left transition-all duration-500 ${active===c.id?'border-violet-300/50 bg-violet-300/[.11] shadow-[0_12px_50px_rgba(120,65,210,.12)]':'border-white/[.09] bg-white/[.025] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[.055]'}`}>
            <div className="flex items-center justify-between"><span className="text-[9px] tracking-[.22em] text-white/35">{String(i+1).padStart(2,'0')}</span><span className={`text-xs tabular-nums ${active===c.id?'text-violet-200':'text-white/30'}`}>{String(categoryCounts[c.id]||0).padStart(2,'0')}</span></div>
            <div className="mt-4 text-sm font-semibold tracking-tight text-white/90">{c.name}</div><div className="mt-1 text-[11px] text-white/40">{c.note}</div>
            <div className="absolute bottom-0 left-4 right-4 h-px origin-left scale-x-0 bg-gradient-to-r from-violet-300 to-blue-300 transition-transform duration-500 group-hover:scale-x-100"/>
          </motion.button>)}
        </div>
      </section>

      <section className="mt-16 sm:mt-20">
        <div className="mb-7 flex items-end justify-between border-b border-white/10 pb-5"><div><div className="text-[10px] tracking-[.25em] text-white/35">PROJECT INDEX</div><h2 className="mt-2 text-2xl font-medium tracking-tight">{categories.find(x=>x.id===active)?.name}</h2></div><span className="text-xs tabular-nums text-white/40">{visible.length.toString().padStart(2,'0')} projects</span></div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={reduceMotion?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={reduceMotion?{opacity:0}:{opacity:0,y:-10}} transition={{duration:.35}} className="grid gap-7 md:grid-cols-2">
            {visible.map((item,i)=><motion.article key={item.number+item.name} initial={reduceMotion?false:{opacity:0,y:28,rotateX:3}} whileInView={{opacity:1,y:0,rotateX:0}} viewport={{once:true,amount:.12}} transition={{duration:.65,delay:reduceMotion?0:i*.08,ease:[.16,1,.3,1]}} className="group">
              <a href={item.url} target="_blank" rel="noreferrer" className="relative block aspect-[1.38] overflow-hidden rounded-[24px] border border-white/10 bg-[#111018]">
                {item.imageUrl?<img src={item.imageUrl} alt={item.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"/>:<VisualFallback item={item}/>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40"/>
                <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-md transition duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-black"><ArrowUpRight size={17}/></span>
              </a>
              <div className="flex items-start justify-between gap-4 px-1 pt-5"><div><div className="mb-2 text-[9px] tracking-[.23em] text-violet-200/55">{inferCategory(item).toUpperCase()} · {item.number}</div><h3 className="text-xl font-medium tracking-tight sm:text-2xl">{item.name}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-white/45">{item.description}</p><div className="mt-4 flex flex-wrap gap-2">{item.tags.map(tag=><span key={tag} className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] text-white/45">{tag}</span>)}</div></div><a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.name}`} className="mt-1 shrink-0 text-white/45 transition hover:translate-x-1 hover:text-white"><ArrowRight size={19}/></a></div>
              <div className="mt-5 border-b border-white/10 pb-7 text-[9px] tracking-[.2em] text-white/30">DEMONSTRATION BUILD · INDEPENDENT CONCEPT</div>
            </motion.article>)}
          </motion.div>
        </AnimatePresence>
        {!loading && visible.length===0 && <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center"><Layers3 className="mx-auto text-white/30" size={24}/><h3 className="mt-4 text-lg font-medium">More work is on the way</h3><p className="mt-2 text-sm text-white/40">There are no published projects in this category yet.</p></div>}
      </section>
    </main>
    <footer className="relative border-t border-white/10 px-5 py-8 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 text-xs text-white/35 sm:flex-row"><span>© 2026 MAVERIQODE. Digital Engineering & Technology.</span><div className="flex gap-5"><a href="/" className="transition hover:text-white">Home</a><a href="/#company" className="transition hover:text-white">Company</a><a href="/#contact" className="transition hover:text-white">Contact</a></div></div></footer>
  </div>;
}
