import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowRight, Layers3, Sparkles, Code2, Workflow, Globe2, Smartphone } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { fallbackBuilds, type WorkBuild } from './WorkSection';

const categories = [
  { id: 'all', name: 'All work', note: 'Every idea, brought to life', icon: Layers3 },
  { id: 'Software Engineering', name: 'Software Engineering', note: 'Web platforms & custom systems', icon: Code2 },
  { id: 'Automation & Integration', name: 'Automation & Integration', note: 'Connected workflows that scale', icon: Workflow },
  { id: 'SaaS & Product Development', name: 'SaaS & Product Development', note: 'Products, portals & platforms', icon: Layers3 },
  { id: 'Website Development', name: 'Website Development', note: 'Brand-led digital experiences', icon: Globe2 },
  { id: 'App Development', name: 'App Development', note: 'Mobile apps & application systems', icon: Smartphone },
];

type PortfolioBuild = WorkBuild & { category?: string };

function inferCategory(item: PortfolioBuild) {
  if (item.category && categories.some((x) => x.id === item.category)) return item.category;
  const value = (item.type + ' ' + item.tags.join(' ')).toLowerCase();
  if (/website|web design|landing page|corporate site|education|institute|coaching|school|college|healthcare|fitness/.test(value)) return 'Website Development';
  if (/automation|integration|workflow/.test(value)) return 'Automation & Integration';
  if (/app|android|ios|mobile/.test(value)) return 'App Development';
  if (/saas|product|membership|portal|management system/.test(value)) return 'SaaS & Product Development';
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

    <main className="relative mx-auto max-w-[1600px] px-5 pb-28 sm:px-8 lg:px-12">
      <section className="relative flex min-h-[780px] flex-col justify-center overflow-hidden border-b border-white/10 py-20 lg:min-h-[860px]">
        <div className="pointer-events-none absolute inset-0 opacity-70" style={{backgroundImage:'radial-gradient(ellipse at 72% 46%,rgba(102,57,194,.22),transparent 36%),radial-gradient(ellipse at 18% 75%,rgba(37,68,156,.15),transparent 32%)'}}/>
        <div className="pointer-events-none absolute -right-24 top-10 h-[620px] w-[620px] rounded-full border border-violet-200/[.08]"/>
        <div className="pointer-events-none absolute -right-8 top-28 h-[480px] w-[480px] rounded-full border border-violet-200/[.08]"/>
        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div {...reveal} transition={{duration:.8,ease:[.16,1,.3,1]}} className="relative">
            <a href="/" className="mb-16 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"><ArrowLeft size={14}/> Back to home</a>
            <div className="mb-6 flex items-center gap-3 text-[10px] font-semibold tracking-[.32em] text-violet-200/75"><span className="h-px w-9 bg-violet-300/70"/> MAVERIQODE / SELECTED WORK</div>
            <h1 className="text-[clamp(4.8rem,10vw,10.8rem)] font-semibold leading-[.78] tracking-[-.09em]">WE MAKE<br/><span className="bg-gradient-to-r from-[#eee5ff] via-[#c29aff] to-[#7891ff] bg-clip-text text-transparent">DIGITAL</span><br/><span className="text-white/90">MATTER<span className="text-violet-300">.</span></span></h1>
            <p className="mt-10 max-w-lg text-base leading-8 text-white/55 sm:text-lg">From ambitious ideas to intelligent platforms. Explore the systems, products and digital experiences we bring to life.</p>
            <div className="mt-9 flex flex-wrap items-center gap-5"><a href="#projects" onClick={()=>setActive('all')} className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black transition hover:bg-violet-100">Explore projects <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/></a><span className="text-[9px] uppercase tracking-[.22em] text-white/35">{items.filter(x=>x.published!==false).length.toString().padStart(2,'0')} published builds <span className="mx-2 text-violet-300">/</span> 05 disciplines</span></div>
          </motion.div>
          <div className="relative mx-auto h-[480px] w-full max-w-[650px] sm:h-[590px]">
            <motion.div initial={reduceMotion?false:{opacity:0,x:70,rotate:8}} animate={{opacity:1,x:0,rotate:5}} transition={{duration:1,ease:[.16,1,.3,1],delay:.15}} className="absolute right-[2%] top-[4%] z-10 w-[76%] overflow-hidden rounded-[26px] border border-white/20 bg-[#15121d] shadow-[0_35px_100px_rgba(0,0,0,.55)]">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-black/35 px-4 py-3"><i className="h-2 w-2 rounded-full bg-white/30"/><i className="h-2 w-2 rounded-full bg-white/20"/><i className="h-2 w-2 rounded-full bg-white/20"/><span className="ml-2 text-[8px] tracking-[.2em] text-white/35">MAVERIQODE / LIVE WORK</span></div>
              <div className="relative aspect-[1.35] overflow-hidden">{items[0]?.imageUrl?<img src={items[0].imageUrl} alt={items[0].name} className="h-full w-full object-cover object-center bg-[#09090d]"/>:<div className="h-full bg-gradient-to-br from-violet-900 to-slate-950"/>}<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/><div className="absolute bottom-4 left-5"><div className="text-[8px] tracking-[.25em] text-white/60">01 / FEATURED BUILD</div><div className="mt-1 text-lg font-semibold">{items[0]?.name||'Digital experiences'}</div></div></div>
            </motion.div>
            <motion.div initial={reduceMotion?false:{opacity:0,x:-60,y:50,rotate:-10}} animate={{opacity:1,x:0,y:0,rotate:-7}} transition={{duration:1.1,ease:[.16,1,.3,1],delay:.35}} className="absolute bottom-[5%] left-[0%] z-20 w-[61%] overflow-hidden rounded-[24px] border border-white/20 bg-[#11121c] shadow-[0_30px_90px_rgba(0,0,0,.6)]">
              <div className="relative aspect-[1.25] overflow-hidden">{items[1]?.imageUrl?<img src={items[1].imageUrl} alt={items[1].name} className="h-full w-full object-contain bg-[#09090d]"/>:<div className="h-full bg-gradient-to-br from-blue-900 to-slate-950"/>}<div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"/><div className="absolute bottom-4 left-4"><div className="text-[8px] tracking-[.2em] text-white/55">02 / DIGITAL PLATFORM</div><div className="mt-1 text-sm font-semibold">{items[1]?.name||'Intelligent platforms'}</div></div></div>
            </motion.div>
            <motion.div animate={reduceMotion?{}:{y:[0,-13,0],rotate:[0,2,0]}} transition={{duration:7,repeat:Infinity,ease:'easeInOut'}} className="absolute left-[3%] top-[8%] z-30 rounded-2xl border border-violet-200/20 bg-[#181323]/90 px-4 py-3 shadow-2xl backdrop-blur-xl"><div className="text-[8px] tracking-[.25em] text-violet-200/60">OUR APPROACH</div><div className="mt-1 text-xs font-medium">Think. Build. Evolve.</div></motion.div>
            <div className="absolute bottom-[3%] right-[1%] z-30 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[8px] tracking-[.22em] text-white/60 backdrop-blur-xl">INDEPENDENT DEMONSTRATIONS</div>
            <div className="pointer-events-none absolute inset-[12%] rounded-full border border-dashed border-violet-200/10"/>
          </div>
        </div>
        <div className="relative mt-16 overflow-hidden border-y border-white/10 py-4">
          <motion.div animate={reduceMotion?{}:{x:['0%','-50%']}} transition={{duration:28,repeat:Infinity,ease:'linear'}} className="flex w-max gap-8 whitespace-nowrap text-[10px] font-medium tracking-[.3em] text-white/35"><span>SOFTWARE ENGINEERING ✳ AI SYSTEMS ✳ PRODUCT DEVELOPMENT ✳ AUTOMATION ✳ WEBSITE DEVELOPMENT ✳ APP DEVELOPMENT ✳</span><span>SOFTWARE ENGINEERING ✳ AI SYSTEMS ✳ PRODUCT DEVELOPMENT ✳ AUTOMATION ✳ CYBERSECURITY ✳ DIGITAL INFRASTRUCTURE ✳</span></motion.div>
        </div>
      </section>
      <section className="relative mt-16 overflow-hidden border-y border-white/10 py-12 sm:mt-20 sm:py-16">
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-violet-500/[.08] blur-[100px]"/>
        <div className="relative mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><div className="flex items-center gap-3 text-[10px] font-semibold tracking-[.3em] text-violet-200/65"><span className="h-px w-8 bg-violet-300/60"/> WHAT WE BUILD</div><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] sm:text-6xl">Explore our <span className="bg-gradient-to-r from-violet-200 to-blue-300 bg-clip-text text-transparent">craft.</span></h2></div>
          <p className="max-w-sm text-sm leading-7 text-white/45">Different disciplines. One standard of craft. Choose a field and discover what we can make possible.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((c,i)=>{const Icon=c.icon;const selected=active===c.id;return <motion.button key={c.id} type="button" onClick={()=>setActive(c.id)} initial={reduceMotion?false:{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} whileHover={reduceMotion?{}:{y:-5}} transition={{duration:.5,delay:reduceMotion?0:i*.055,ease:[.16,1,.3,1]}} className={`group relative min-h-[190px] overflow-hidden rounded-[26px] border p-6 text-left transition-colors duration-500 sm:p-7 ${selected?'border-violet-300/50 bg-gradient-to-br from-violet-400/[.16] via-[#17131f] to-blue-400/[.08]':'border-white/[.09] bg-[#0d0d12] hover:border-violet-200/30'}`}>
            <div className={`pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-700 ${selected?'bg-violet-400/20 opacity-100':'bg-violet-400/10 opacity-0 group-hover:opacity-100'}`}/>
            <div className="relative flex items-start justify-between"><div className={`grid h-12 w-12 place-items-center rounded-2xl border transition-all duration-500 ${selected?'border-violet-200/30 bg-violet-300/15 text-violet-100':'border-white/10 bg-white/[.035] text-white/55 group-hover:border-violet-200/25 group-hover:text-violet-100'}`}><Icon size={20}/></div><span className="text-[10px] tracking-[.2em] text-white/35">{String(i).padStart(2,'0')} <span className="mx-2 text-violet-200/40">/</span> {String(categoryCounts[c.id]||0).padStart(2,'0')} BUILDS</span></div>
            <div className="relative mt-8 flex items-end justify-between gap-3"><div><h3 className="text-lg font-semibold tracking-tight text-white/90 sm:text-xl">{c.name}</h3><p className="mt-2 text-xs text-white/40">{c.note}</p></div><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${selected?'rotate-45 border-violet-200/40 bg-violet-200 text-[#09090d]':'border-white/15 text-white/45 group-hover:translate-x-1 group-hover:border-violet-200/40 group-hover:text-violet-100'}`}><ArrowUpRight size={16}/></span></div>
            <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-violet-300 via-blue-300 to-transparent transition-all duration-700 ${selected?'w-full':'w-0 group-hover:w-full'}`}/>
          </motion.button>})}
        </div>
      </section>

      <section id="projects" className="mt-20 scroll-mt-28 sm:mt-28">
        <div className="mb-7 flex items-end justify-between border-b border-white/10 pb-5"><div><div className="text-[10px] tracking-[.25em] text-white/35">PROJECT INDEX</div><h2 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">{categories.find(x=>x.id===active)?.name}</h2></div><span className="text-xs tabular-nums text-white/40">{visible.length.toString().padStart(2,'0')} projects</span></div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={reduceMotion?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={reduceMotion?{opacity:0}:{opacity:0,y:-10}} transition={{duration:.35}} className="grid gap-x-7 gap-y-12 md:grid-cols-2">
            {visible.map((item,i)=><motion.article key={item.number+item.name} initial={reduceMotion?false:{opacity:0,y:28,rotateX:3}} whileInView={{opacity:1,y:0,rotateX:0}} viewport={{once:true,amount:.12}} transition={{duration:.65,delay:reduceMotion?0:i*.08,ease:[.16,1,.3,1]}} className="group">
              <a href={item.url} target="_blank" rel="noreferrer" className="relative block aspect-[16/9] overflow-hidden rounded-[28px] shadow-[0_24px_80px_rgba(0,0,0,.3)] border border-white/10 bg-[#09090d]">
                {item.imageUrl?<img src={item.imageUrl} alt={item.name} className="absolute inset-0 h-full w-full object-cover object-center bg-[#09090d] transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.035]"/>:<VisualFallback item={item}/>}
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
