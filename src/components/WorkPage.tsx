import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, ChevronRight, Search, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Navbar } from './Navbar';
import { supabase } from '../lib/supabase';

type WorkCategory = { id: string; title: string; description: string; number?: string; published?: boolean };
type WorkProject = { number?: string; name: string; type?: string; description: string; url: string; label?: string; visual?: string; tags?: string[]; imageUrl?: string; categoryId?: string; published?: boolean };

const defaultCategories: WorkCategory[] = [
  { id: 'web-experiences', number: '01', title: 'Web & Digital Experiences', description: 'Brand-led websites, portals and digital experiences.' },
  { id: 'business-systems', number: '02', title: 'Business & Operations Systems', description: 'Purpose-built platforms that bring everyday operations together.' },
  { id: 'ai-systems', number: '03', title: 'AI & Intelligent Systems', description: 'Grounded AI products, assistants and decision-support tools.' },
  { id: 'automation', number: '04', title: 'Automation & Integrations', description: 'Connected workflows that reduce manual hand-offs.' },
  { id: 'saas-products', number: '05', title: 'SaaS & Product Engineering', description: 'Scalable software products and customer-facing platforms.' },
  { id: 'security-infrastructure', number: '06', title: 'Cybersecurity & Infrastructure', description: 'Secure foundations, cloud engineering and resilient systems.' },
];

const defaultProjects: WorkProject[] = [
  { number: '01', name: 'Sanskriti Coaching Institute', type: 'Education · Institute website & system', description: 'A demonstration build exploring a digital presence and connected institute experience for a coaching environment.', url: 'https://coaching-institute-system-pi.vercel.app/', label: 'Explore demo', visual: 'education', tags: ['Education', 'Web Experience', 'Institute System'], categoryId: 'web-experiences' },
  { number: '02', name: 'Luminary Institute of Technology & Sciences', type: 'Education · Institute website & system', description: 'A concept implementation presenting an institute-focused web experience and structured information architecture.', url: 'https://institute-demo-v1-maveriqode.vercel.app/', label: 'Explore demo', visual: 'institute', tags: ['Institutional', 'Information Architecture', 'Web'], categoryId: 'web-experiences' },
  { number: '03', name: 'Warrior Fitness', type: 'Fitness · Membership management system', description: 'A gym operations demonstration focused on membership-oriented workflows and a digital management experience.', url: 'https://gymmanagementsystem-six.vercel.app/', label: 'Explore demo', visual: 'fitness', tags: ['Fitness', 'Memberships', 'Operations'], categoryId: 'business-systems' },
  { number: '04', name: 'BrightSmile Dental Studio', type: 'Healthcare · Website & operations portal', description: 'A dental studio demonstration combining a public-facing web presence with an operations-portal concept.', url: 'https://brightsmile-dental-studio-zeta.vercel.app/', label: 'Explore demo', visual: 'health', tags: ['Healthcare', 'Web Experience', 'Operations Portal'], categoryId: 'web-experiences' },
];

const palette: Record<string, string> = {
  education: 'from-[#30204b] via-[#242b54] to-[#101522]',
  institute: 'from-[#14364b] via-[#1b3152] to-[#151626]',
  fitness: 'from-[#45281d] via-[#35233c] to-[#171321]',
  health: 'from-[#153b36] via-[#1b3544] to-[#171b2d]',
};

export default function WorkPage() {
  const reduceMotion = useReducedMotion();
  const [categories, setCategories] = useState<WorkCategory[]>(defaultCategories);
  const [projects, setProjects] = useState<WorkProject[]>(defaultProjects);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void supabase.from('website_content').select('content,status').eq('slug', 'work').eq('status', 'published').maybeSingle()
      .then(({ data, error }: { data: { content: unknown } | null; error: unknown }) => {
        if (!active) return;
        if (!error && data?.content && typeof data.content === 'object' && !Array.isArray(data.content)) {
          const content = data.content as { items?: unknown; categories?: unknown };
          if (Array.isArray(content.categories)) {
            const valid = content.categories.filter((x): x is WorkCategory => Boolean(x) && typeof x === 'object' && typeof (x as WorkCategory).id === 'string' && typeof (x as WorkCategory).title === 'string' && (x as WorkCategory).published !== false);
            if (valid.length) setCategories(valid);
          }
          if (Array.isArray(content.items)) {
            const valid = content.items.filter((x): x is WorkProject => Boolean(x) && typeof x === 'object' && typeof (x as WorkProject).name === 'string' && typeof (x as WorkProject).url === 'string' && (x as WorkProject).published !== false);
            if (valid.length) setProjects(valid.map((p) => ({ ...p, categoryId: p.categoryId || (p.visual === 'fitness' ? 'business-systems' : 'web-experiences') })));
          }
        }
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const visibleProjects = useMemo(() => projects.filter((project) => {
    const matchesCategory = activeCategory === 'all' || project.categoryId === activeCategory;
    const haystack = [project.name, project.type || '', project.description, ...(project.tags || [])].join(' ').toLowerCase();
    return matchesCategory && (!query.trim() || haystack.includes(query.toLowerCase()));
  }), [projects, activeCategory, query]);

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--mq-bg)] text-[var(--mq-text)]">
      <Navbar activeSection="work" onNavigate={(id) => { window.location.href = '/#' + id; }} />
      <main className="relative isolate pt-[68px]">
        <div aria-hidden className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-60"/>
        <div aria-hidden className="pointer-events-none absolute -top-48 left-[12%] h-[560px] w-[560px] rounded-full bg-[#862cff]/15 blur-[150px]"/>
        <div aria-hidden className="pointer-events-none absolute top-[32rem] right-[-12rem] h-[520px] w-[520px] rounded-full bg-[#3158d8]/10 blur-[150px]"/>
        <section className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pb-24">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.22,1,.36,1] }}>
            <div className="mb-8 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.28em] text-[#c49aff]"><span className="h-px w-9 bg-[#a76aff]"/> Selected work <span className="text-white/25">/</span> Engineering archive</div>
            <div className="grid gap-10 lg:grid-cols-[1.15fr_.65fr] lg:items-end">
              <div><h1 className="max-w-5xl text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-7xl lg:text-[6.6rem]">Ideas, engineered<br/><span className="font-serif font-normal italic text-[#c9a5ff]">into systems.</span></h1></div>
              <div className="max-w-lg pb-2 lg:justify-self-end"><p className="text-base leading-8 text-white/60 sm:text-lg">A closer look at the digital experiences, products and operational systems we design and build. Explore the work by engineering discipline.</p><div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[.18em] text-white/45"><span className="h-2 w-2 rounded-full bg-[#a78bfa] shadow-[0_0_18px_#a78bfa]"/> A growing engineering archive</div></div>
            </div>
          </motion.div>
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .7 }} className="mt-20 grid gap-3 border-y border-white/10 py-6 sm:grid-cols-3">
            {[['01','Discover the discipline'],['02','Explore selected builds'],['03','Start a conversation']].map(([n,t])=><div key={n} className="flex items-center gap-4"><span className="font-mono text-xs text-[#b98aff]">{n}</span><span className="text-sm text-white/65">{t}</span></div>)}
          </motion.div>
        </section>

        <section className="relative mx-auto max-w-[1440px] px-5 pb-28 sm:px-8 lg:px-12">
          <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><div className="mb-3 text-[10px] uppercase tracking-[.25em] text-[#b98aff]">Browse by capability</div><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Explore our work</h2></div>
            <label className="flex h-12 w-full items-center gap-3 rounded-full border border-white/10 bg-white/[.035] px-5 text-white/45 transition focus-within:border-[#b98aff]/60 lg:max-w-sm"><Search size={16}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search projects, systems, tags…" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"/></label>
          </div>
          <div className="mb-12 flex gap-2 overflow-x-auto pb-3">
            <button onClick={()=>setActiveCategory('all')} className={'shrink-0 rounded-full border px-5 py-3 text-xs transition-all '+(activeCategory==='all'?'border-[#c49aff]/70 bg-[#a66aff]/15 text-white shadow-[0_0_30px_rgba(166,106,255,.12)]':'border-white/10 bg-white/[.025] text-white/55 hover:border-white/25 hover:text-white')}>All work <span className="ml-2 text-white/40">{projects.length}</span></button>
            {categories.map((category,index)=><button key={category.id} onClick={()=>setActiveCategory(category.id)} className={'shrink-0 rounded-full border px-5 py-3 text-xs transition-all '+(activeCategory===category.id?'border-[#c49aff]/70 bg-[#a66aff]/15 text-white shadow-[0_0_30px_rgba(166,106,255,.12)]':'border-white/10 bg-white/[.025] text-white/55 hover:border-white/25 hover:text-white')}><span className="mr-2 font-mono text-[#b98aff]">{category.number || String(index+1).padStart(2,'0')}</span>{category.title}</button>)}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeCategory+query} initial={reduceMotion?false:{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={reduceMotion?{opacity:1}:{opacity:0,y:-8}} transition={{duration:.3}} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project,index)=><motion.article key={project.number || project.name} initial={reduceMotion?false:{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.55,delay:index*.07,ease:[.22,1,.36,1]}} whileHover={reduceMotion?undefined:{y:-7}} className="group overflow-hidden rounded-[1.65rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.018)_58%,rgba(116,63,160,.055))] shadow-[0_24px_70px_rgba(0,0,0,.22)] transition-colors hover:border-[#b98aff]/35">
                <div className={'relative aspect-[1.52] overflow-hidden bg-gradient-to-br '+(palette[project.visual || ''] || 'from-[#28203c] to-[#111522]')}>
                  {project.imageUrl?<img src={project.imageUrl} alt={project.name+' project preview'} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.055]"/>:<div className="absolute inset-0 flex flex-col justify-between p-7"><div className="flex items-center justify-between"><span className="rounded-full border border-white/20 bg-black/15 px-3 py-1.5 text-[9px] uppercase tracking-[.2em] text-white/75">MAVERIQODE / BUILD</span><Sparkles size={17} className="text-white/55"/></div><div><div className="mb-2 text-[10px] uppercase tracking-[.22em] text-white/50">{project.type || 'Digital system'}</div><div className="max-w-xs text-3xl font-semibold leading-tight tracking-tight text-white">{project.name}</div></div></div>}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090d]/65 via-transparent to-white/[.04] opacity-70 transition-opacity duration-500 group-hover:opacity-100"/>
                  <span className="absolute bottom-4 left-5 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-white/75 backdrop-blur">{project.published===false?'Private':'Demonstration build'}</span>
                  <span className="absolute right-5 top-5 font-mono text-xs text-white/65">{project.number || String(index+1).padStart(2,'0')}</span>
                </div>
                <div className="p-6 sm:p-7"><div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-[#c39aff]"><BriefcaseBusiness size={13}/>{categories.find(c=>c.id===project.categoryId)?.title || 'Selected work'}</div><h3 className="text-xl font-semibold tracking-tight text-white">{project.name}</h3><p className="mt-3 min-h-[72px] text-sm leading-6 text-white/55">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{(project.tags||[]).slice(0,4).map(tag=><span key={tag} className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/50">{tag}</span>)}</div><a href={project.url} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-white transition-colors hover:text-[#d3b5ff]">{project.label || 'Explore project'} <ArrowUpRight size={15}/></a></div>
              </motion.article>)}
            </motion.div>
          </AnimatePresence>
          {visibleProjects.length===0&&<div className="rounded-3xl border border-dashed border-white/15 px-6 py-20 text-center"><p className="text-lg text-white/70">No projects in this view yet.</p><p className="mt-2 text-sm text-white/40">Try another category or search term.</p></div>}
          {loading&&<p className="mt-8 text-center text-xs uppercase tracking-[.2em] text-white/35">Syncing the latest portfolio…</p>}
        </section>
        <section className="relative border-t border-white/10 bg-white/[.02] px-5 py-20 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-4 text-[10px] uppercase tracking-[.25em] text-[#bd91ff]">Have a system in mind?</div><h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Let’s build what<br/><span className="font-serif font-normal italic text-[#c9a5ff]">comes next.</span></h2></div><a href="/#contact" className="inline-flex items-center gap-3 self-start rounded-full border border-[#bd91ff]/40 bg-[#9c55e8]/10 px-6 py-4 text-sm text-white transition hover:border-[#d2b0ff] hover:bg-[#9c55e8]/20">Discuss a project <ArrowRight size={16}/></a></div></section>
      </main>
      <footer className="border-t border-white/10 px-5 py-8 text-xs text-white/35 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} MAVERIQODE. Engineering with intent.</span><a href="/" className="inline-flex items-center gap-2 hover:text-white">Back to home <ChevronRight size={13}/></a></div></footer>
    </div>
  );
}
