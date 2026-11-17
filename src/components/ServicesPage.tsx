import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type Service = { name: string; description: string; group: string };
type Category = { id: string; number: string; title: string; intro: string; services: Service[] };

const categories: Category[] = [
  {
    id: 'sales', number: '01', title: 'Sales & Lead Generation',
    intro: 'Capture enquiries, qualify prospects and keep follow-ups moving without losing opportunities.',
    services: [
      { name: 'AI Lead Capture', group: 'Lead acquisition', description: 'Collect enquiries from supported channels and organize them in one lead pipeline.' },
      { name: 'AI Lead Qualification', group: 'Lead acquisition', description: 'Ask qualification questions and categorize prospects using agreed business rules.' },
      { name: 'AI Lead Follow-up', group: 'Follow-up workflows', description: 'Send timely follow-up messages and reminders based on lead activity.' },
      { name: 'AI Appointment Booking', group: 'Follow-up workflows', description: 'Help prospects request or book available appointments through connected calendars.' },
      { name: 'AI Sales Assistant', group: 'Sales enablement', description: 'Assist the sales team with product information, enquiry context and next-step suggestions.' },
      { name: 'CRM Automation', group: 'Sales enablement', description: 'Automate routine CRM updates, task creation and pipeline movement.' },
      { name: 'AI Proposal Generator', group: 'Sales enablement', description: 'Prepare structured proposal drafts from approved service, pricing and customer details.' },
      { name: 'Lead Scoring System', group: 'Sales intelligence', description: 'Prioritize prospects using configurable fit, intent and engagement signals.' },
    ],
  },
  {
    id: 'support', number: '02', title: 'Customer Support',
    intro: 'Give customers faster answers and help your team handle repetitive support requests consistently.',
    services: [
      { name: 'AI Customer Support Agent', group: 'Conversational support', description: 'Answer common customer questions using approved business information and escalation rules.' },
      { name: 'WhatsApp AI Assistant', group: 'Conversational support', description: 'Handle supported WhatsApp conversations for enquiries, FAQs and service requests.' },
      { name: 'Website AI Chatbot', group: 'Conversational support', description: 'Add a website assistant that guides visitors and captures qualified enquiries.' },
      { name: 'AI Ticket Management', group: 'Support operations', description: 'Categorize incoming support requests, assign queues and track resolution status.' },
      { name: 'AI Email Support', group: 'Support operations', description: 'Classify support emails and prepare response drafts for review or approved workflows.' },
      { name: 'Order Status Assistant', group: 'Support operations', description: 'Respond to order or service-status questions using connected operational data.' },
      { name: 'Multilingual Support Agent', group: 'Customer experience', description: 'Support customer conversations across selected languages and approved knowledge sources.' },
      { name: 'Customer Feedback Analyzer', group: 'Customer experience', description: 'Group customer feedback into themes, sentiment signals and actionable summaries.' },
    ],
  },
  {
    id: 'marketing', number: '03', title: 'Marketing & Content',
    intro: 'Reduce repetitive content work and turn campaign activity into clearer, more consistent workflows.',
    services: [
      { name: 'AI Social Media Content Generator', group: 'Content production', description: 'Create platform-ready content drafts aligned with your brand inputs and content goals.' },
      { name: 'AI Content Calendar', group: 'Content production', description: 'Organize content ideas into a planned publishing calendar with review steps.' },
      { name: 'AI Blog Automation', group: 'Content production', description: 'Support research, outlining and first-draft creation for approved blog topics.' },
      { name: 'AI SEO Assistant', group: 'Search visibility', description: 'Assist with keyword research, metadata drafts, content checks and SEO task planning.' },
      { name: 'AI Email Marketing', group: 'Campaign workflows', description: 'Prepare segmented email drafts and automate approved campaign sequences.' },
      { name: 'AI Campaign Analyzer', group: 'Campaign workflows', description: 'Summarize campaign performance data and highlight trends for review.' },
      { name: 'AI Review Response', group: 'Reputation management', description: 'Draft consistent responses to customer reviews for human approval.' },
      { name: 'AI Video Repurposing Workflow', group: 'Reputation management', description: 'Turn long-form video inputs into short-form content ideas, captions and clips workflow briefs.' },
    ],
  },
  {
    id: 'operations', number: '04', title: 'Business Operations',
    intro: 'Connect everyday operational tasks so information moves reliably between people and systems.',
    services: [
      { name: 'AI Invoice Processing', group: 'Documents & finance', description: 'Extract invoice fields into a structured review workflow with validation steps.' },
      { name: 'Document Processing', group: 'Documents & finance', description: 'Classify documents and extract selected information into searchable records.' },
      { name: 'Employee Onboarding', group: 'People operations', description: 'Coordinate onboarding checklists, document requests and internal notifications.' },
      { name: 'Attendance & Leave Workflow', group: 'People operations', description: 'Route attendance or leave requests through configured approval and notification steps.' },
      { name: 'AI Report Generator', group: 'Business intelligence', description: 'Generate recurring operational summaries from connected and approved data sources.' },
      { name: 'Inventory Alert Automation', group: 'Business intelligence', description: 'Trigger low-stock alerts and replenishment reminders based on configured thresholds.' },
      { name: 'Vendor Management Workflow', group: 'Procurement & vendors', description: 'Organize vendor records, renewal reminders and procurement approval steps.' },
      { name: 'Internal Knowledge Assistant', group: 'Procurement & vendors', description: 'Help staff find answers across approved internal documents and knowledge sources.' },
    ],
  },
  {
    id: 'advanced', number: '05', title: 'Advanced AI & Custom Agents',
    intro: 'Purpose-built AI workflows for research, analysis and specialized tasks with defined controls.',
    services: [
      { name: 'AI Research Agent', group: 'Research & intelligence', description: 'Gather information from approved sources and produce structured research summaries.' },
      { name: 'AI Competitor Monitoring', group: 'Research & intelligence', description: 'Track selected public competitor signals and prepare periodic comparison briefs.' },
      { name: 'AI Business Intelligence Assistant', group: 'Decision support', description: 'Let teams query approved business data and receive grounded analytical summaries.' },
      { name: 'Multi-Agent Workflow', group: 'Decision support', description: 'Coordinate specialized agents through defined handoffs, policies and review checkpoints.' },
      { name: 'AI Recruitment Assistant', group: 'Specialized agents', description: 'Assist with job-description workflows, candidate organization and structured screening support.' },
      { name: 'AI Contract Review Assistant', group: 'Specialized agents', description: 'Highlight clauses and deviations for qualified human review; not a substitute for legal advice.' },
      { name: 'AI Security Alert Triage', group: 'Specialized agents', description: 'Group security alerts, enrich context and prioritize analyst review.' },
      { name: 'Custom AI Workflow Agent', group: 'Specialized agents', description: 'Design a custom agent workflow around a clearly scoped business process and approval model.' },
    ],
  },
];

const plans = [
  {
    id: 'website', label: 'Website Development', price: '₹5,000', cadence: 'one-time',
    summary: 'A complete business website, ready to represent your brand online.',
    features: ['Unlimited content pages', 'Responsive desktop, tablet and mobile design', 'SEO foundation and metadata setup', 'Domain and hosting configuration', 'Custom admin panel for supported content', 'Contact and enquiry forms', 'Performance optimization', 'HTTPS, SSL and security hardening'],
    note: 'Domain registration/renewal and premium third-party services are billed at actual cost where applicable.',
  },
  {
    id: 'business', label: 'Complete Business System', price: '₹10,000', cadence: 'one-time setup',
    monthly: '₹3,000/month',
    summary: 'A connected digital operating system for your day-to-day business.',
    featured: true,
    features: ['Unlimited-page business website', 'SEO foundation and search visibility setup', 'Hosting and domain configuration', 'Custom admin control panel', 'CRM: leads, contacts and sales pipeline', 'ERP and business operations modules', 'Team, task and workflow management', 'Inventory, orders and service tracking where relevant', 'Invoices and expense records where scoped', 'One business automation included', 'Google Business Profile and Meta Business setup assistance', 'Analytics and operational dashboards', 'Role-based access and secure authentication', 'Security hardening and access review', 'Monthly security audit with findings summary'],
    monthlyFeatures: ['System monitoring and routine maintenance', 'Bug fixes and supported technical assistance', 'Database and backup health checks', 'Monthly security audit', 'Regular dependency and configuration updates', 'Minor content and operational changes'],
    note: 'The ₹3,000 monthly plan covers ongoing management. New modules, major redesigns, paid integrations and external usage charges are quoted separately.',
  },
  {
    id: 'starter', label: 'Website + SEO Starter', price: '₹1,000', cadence: 'per month',
    summary: 'A simple managed online presence for businesses getting started.',
    features: ['Business website setup', 'Hosting configuration', 'Basic on-page SEO', 'Search metadata and indexing setup', 'Routine website upkeep', 'Basic security updates'],
    note: 'Final scope, page structure, domain and hosting limits are confirmed before onboarding.',
  },
  {
    id: 'automation', label: 'Business Automation', price: '₹2,000', cadence: 'per automation / month',
    summary: 'Automate one clearly defined repetitive business workflow.',
    features: ['One selected automation workflow', 'Workflow mapping and configuration', 'Supported app/API integrations', 'Testing and deployment', 'Error notifications and basic monitoring', 'Ongoing workflow maintenance'],
    note: 'Third-party platform subscriptions, API credits and AI usage are separate unless explicitly included in the proposal.',
  },
  {
    id: 'app', label: 'Mobile App Development', price: '₹5,000', cadence: 'one-time development',
    monthly: '₹1,000/month after 3 free months',
    summary: 'A custom mobile app delivered against an agreed feature scope.',
    features: ['Custom app UI and user flows', 'Frontend and backend implementation', 'Database and API integration', 'Admin panel where required by scope', 'Testing and deployment assistance', 'Security-conscious authentication and data handling', 'First 3 months of management included'],
    note: 'After the first 3 months, optional ongoing management is ₹1,000/month. Store accounts, paid services and third-party charges are separate.',
  },
];

const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPlanId, setSelectedPlanId] = useState('business');
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const reduceMotion = useReducedMotion();
  const visibleCategories = useMemo(() => activeCategory === 'all' ? categories : categories.filter((category) => category.id === activeCategory), [activeCategory]);

  return (
    <div className="min-h-screen bg-[var(--mq-bg)] text-[var(--mq-text)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--mq-border)] bg-[var(--mq-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <a href="/" className="inline-flex items-center gap-3 text-sm font-extrabold tracking-[.16em]">
            <img src="/assets/aistudio/MAVERIQODE_symbol_only_transparent_149367a9.png" alt="MAVERIQODE symbol" className="h-6 w-auto" />
            MAVERIQODE
          </a>
          <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Main navigation">
            <a href="/" className="text-[var(--mq-muted)] transition hover:text-white">Home</a>
            <a href="/#company" className="text-[var(--mq-muted)] transition hover:text-white">Company</a>
            <a href="/#capabilities" className="text-[var(--mq-muted)] transition hover:text-white">Capabilities</a>
            <a href="/services" aria-current="page" className="text-white">Solutions</a>
            <a href="/#work" className="text-[var(--mq-muted)] transition hover:text-white">Work</a>
            <a href="/#contact" className="text-[var(--mq-muted)] transition hover:text-white">Contact</a>
          </nav>
          <a href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-black transition hover:bg-[#d8b7ff]">Talk to us <ArrowUpRight size={15}/></a>
        </div>
      </header>

      <main className="overflow-hidden pt-[70px]">
        <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-80"/>
          <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-[#6b21a8]/15 blur-[120px]"/>
          <div className="relative mx-auto grid max-w-[1440px] items-end gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <motion.div initial={reduceMotion ? false : 'hidden'} animate="visible" variants={fadeUp} transition={{ duration: .7 }}>
              <p className="mb-5 font-mono text-xs tracking-[.2em] text-[var(--mq-accent-soft)]">MAVERIQODE / SERVICES & SOLUTIONS</p>
              <h1 className="max-w-4xl text-balance font-display text-[clamp(3rem,7vw,6.8rem)] font-extrabold leading-[.94] tracking-[-.065em]">Build the systems that <span className="mq-serif-accent font-medium text-[var(--mq-accent-soft)]">move business.</span></h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--mq-text-secondary)] sm:text-lg">From high-performing websites to connected business platforms and AI-powered workflows, explore practical services designed around the way your organization works.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#plans" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a100ff] to-[#2a00c8] px-6 py-3.5 text-sm font-semibold text-white">Explore plans <ArrowDown size={16}/></a>
                <a href="#automation-catalogue" className="inline-flex items-center gap-2 rounded-full border border-[var(--mq-border-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--mq-text)] transition hover:border-[#bd7aff]">Browse 40 automations <ArrowRight size={16}/></a>
              </div>
            </motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, scale: .96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .8, delay: .12 }} className="rounded-[28px] border border-[var(--mq-border)] bg-[linear-gradient(145deg,rgba(161,0,255,.12),rgba(255,255,255,.025)_50%,rgba(42,0,200,.12))] p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-[var(--mq-border)] pb-5"><span className="font-mono text-[10px] tracking-[.18em] text-[var(--mq-muted)]">SERVICE FRAMEWORK</span><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,.8)]"/></div>
              <div className="grid grid-cols-2 gap-4 py-7">
                {[['05','Automation categories'],['40','AI workflow options'],['05','Commercial plans'],['01','Security-first approach']].map(([value,label])=><div key={label} className="rounded-2xl border border-[var(--mq-border)] bg-black/20 p-4"><p className="font-display text-4xl font-bold tracking-tight">{value}</p><p className="mt-2 text-xs text-[var(--mq-muted)]">{label}</p></div>)}
              </div>
              <p className="text-sm leading-relaxed text-[var(--mq-text-secondary)]">Every engagement starts with a defined scope, a clear delivery plan and security considerations built into implementation.</p>
            </motion.div>
          </div>
        </section>

        <section id="plans" className="relative isolate scroll-mt-24 overflow-hidden border-y border-[var(--mq-border)] bg-[#08070d] px-5 py-24 sm:px-8 lg:px-12">
          <div aria-hidden="true" className="mq-pricing-grid pointer-events-none absolute inset-0 opacity-70" />
          <div aria-hidden="true" className="mq-pricing-aurora pointer-events-none absolute -left-40 top-10 h-[440px] w-[440px] rounded-full blur-[110px]" />
          <div aria-hidden="true" className="mq-pricing-orbit pointer-events-none absolute -right-40 top-24 h-[620px] w-[620px] rounded-full" />
          <div className="relative mx-auto max-w-[1440px]">
            <div className="mb-14 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[.24em] text-[#d7a0ff]"><span className="h-px w-8 bg-[#b65cff]" /> 01 / INVESTMENT & ENGAGEMENT</p>
                <h2 className="text-balance text-5xl font-bold leading-[.98] tracking-[-.065em] sm:text-6xl lg:text-7xl">Choose your next <span className="mq-serif-accent text-[#d7a0ff]">unfair advantage.</span></h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#a6a0b2]">Five ways to move forward. Select a plan to explore what is included, how it is managed and what happens after launch.</p>
            </div>

            <div className="grid items-start gap-8 xl:grid-cols-[.82fr_1.18fr]">
              <div className="relative">
                <div className="mb-5 flex items-center justify-between px-1"><span className="font-mono text-[9px] tracking-[.22em] text-[#9d91ac]">SELECT YOUR PACKAGE</span><span className="font-mono text-[9px] tracking-[.18em] text-[#b65cff]">05 OPTIONS / 01 CHOICE</span></div>
                <div aria-hidden="true" className="pointer-events-none absolute -left-3 top-16 bottom-4 w-px bg-gradient-to-b from-transparent via-[#9b4cce]/50 to-transparent" />
              <motion.div
                className="mq-plan-stack grid gap-4 sm:grid-cols-2 xl:grid-cols-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: reduceMotion ? 0 : 0.08 } } }}
              >
                {plans.map((plan,index)=>(
                  <motion.button
                    key={plan.id}
                    type="button"
                    onClick={()=>setSelectedPlanId(plan.id)}
                    variants={{ hidden: { opacity: 0, x: reduceMotion ? 0 : -42, y: reduceMotion ? 0 : 24, rotateY: reduceMotion ? 0 : -13, scale: reduceMotion ? 1 : .94 }, visible: { opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1 } }}
                    transition={{ duration: reduceMotion ? 0 : .72, ease: [.2, .75, .25, 1] }}
                    whileHover={reduceMotion?undefined:{x:8,y:-5,rotateY:2,scale:1.015}}
                    whileTap={reduceMotion?undefined:{scale:.985}}
                    style={{ transformStyle: 'preserve-3d', perspective: 900, zIndex: selectedPlanId === plan.id ? 2 : 1 }}
                    className={`mq-plan-choice group relative w-full overflow-hidden rounded-[22px] border p-5 text-left transition-colors duration-300 sm:p-6 ${selectedPlanId===plan.id?'mq-plan-active border-[#b65cff]/80 bg-[#24132f] shadow-[0_12px_45px_rgba(145,42,210,.17)]':'border-white/10 bg-white/[.025] hover:border-white/25 hover:bg-white/[.055]'}`}
                    aria-pressed={selectedPlanId===plan.id}
                  >
                    <span aria-hidden="true" className="mq-plan-sheen pointer-events-none absolute inset-0" />
                    {selectedPlanId===plan.id&&<motion.span layoutId="plan-active-rail" className="absolute inset-y-4 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#f0c8ff] to-[#8b3dff]" />}
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className={`font-mono text-[9px] tracking-[.2em] ${selectedPlanId===plan.id?'text-[#e2baff]':'text-[#777181]'}`}>{String(index+1).padStart(2,'0')} / MAVERIQODE PLAN</p>
                        <h3 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-xl">{plan.label}</h3>
                      </div>
                      <span className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full border transition ${selectedPlanId===plan.id?'border-[#d5a0ff]/60 bg-[#b65cff]/20 text-[#f0d8ff]':'border-white/10 text-[#7d7788] group-hover:text-white'}`}><ArrowUpRight size={15}/></span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-3xl font-bold tracking-[-.06em] text-white sm:text-[2.15rem]">{plan.price}</span>
                      <span className="text-[10px] text-[#a7a0b2]">{plan.cadence}</span>
                    </div>
                    {plan.monthly&&<p className="mt-2 text-xs font-semibold text-[#d7a0ff]">{plan.monthly}</p>}
                    {plan.featured&&<span className="mt-4 inline-flex rounded-full border border-[#c084fc]/30 bg-[#a100ff]/10 px-3 py-1 font-mono text-[9px] tracking-[.14em] text-[#e2baff]">MOST COMPLETE</span>}
                  </motion.button>
                ))}
              </motion.div>
              <div className="mt-5 flex items-center gap-3 px-1 text-[10px] tracking-[.08em] text-[#82788f]"><span className="h-px flex-1 bg-white/10" /> TAP A PLAN TO PREVIEW <span className="h-px flex-1 bg-white/10" /></div>
              </div>

              <div className="relative min-h-[650px]">
                <div aria-hidden="true" className="mq-plan-glow pointer-events-none absolute -inset-5 rounded-[38px] blur-2xl" />
                <AnimatePresence mode="wait">
                  <motion.article
                    key={selectedPlan.id}
                    initial={reduceMotion?false:{opacity:0,y:18,filter:'blur(8px)'}}
                    animate={{opacity:1,y:0,filter:'blur(0px)'}}
                    exit={reduceMotion?undefined:{opacity:0,y:-12,filter:'blur(6px)'}}
                    transition={{duration:reduceMotion?0:.32,ease:'easeOut'}}
                    className="relative h-full overflow-hidden rounded-[30px] border border-white/15 bg-[linear-gradient(145deg,rgba(41,22,55,.96),rgba(13,12,19,.98)_44%,rgba(12,13,23,.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,.38)] sm:p-9 lg:p-10"
                  >
                    <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-[#d5a0ff]/15 shadow-[0_0_0_28px_rgba(180,100,255,.025),0_0_0_64px_rgba(180,100,255,.018)]" />
                    <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                      <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d5a0ff]/25 bg-[#a100ff]/15 text-[#e2baff]"><Sparkles size={18}/></span><div><p className="font-mono text-[9px] tracking-[.2em] text-[#bda8ca]">YOUR SELECTED PLAN</p><p className="mt-1 text-xs text-white/60">MAVERIQODE / {selectedPlan.id.toUpperCase()}</p></div></div>
                      {selectedPlan.featured&&<span className="rounded-full border border-[#d5a0ff]/35 bg-[#a100ff]/15 px-4 py-2 font-mono text-[9px] tracking-[.16em] text-[#e8caff]">RECOMMENDED</span>}
                    </div>

                    <div className="relative grid gap-7 border-b border-white/10 py-8 md:grid-cols-[1fr_auto] md:items-end">
                      <div>
                        <p className="text-sm text-[#bcb3c8]">A focused solution for your business.</p>
                        <h3 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-[-.045em] text-white sm:text-4xl">{selectedPlan.label}</h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#a9a2b5]">{selectedPlan.summary}</p>
                      </div>
                      <div className="md:text-right">
                        <p className="font-mono text-[9px] tracking-[.18em] text-[#9e91ad]">INVESTMENT</p>
                        <p className="mt-2 whitespace-nowrap text-5xl font-bold tracking-[-.07em] text-white sm:text-6xl">{selectedPlan.price}</p>
                        <p className="mt-2 text-xs text-[#bca9ca]">{selectedPlan.cadence}</p>
                        {selectedPlan.monthly&&<p className="mt-2 text-sm font-semibold text-[#dfb5ff]">{selectedPlan.monthly}</p>}
                      </div>
                    </div>

                    <div className="relative pt-7">
                      <div className="mb-5 flex items-center justify-between gap-3"><h4 className="text-sm font-semibold text-white">What's included</h4><span className="font-mono text-[9px] tracking-[.14em] text-[#8e849a]">{String(selectedPlan.features.length).padStart(2,'0')} FEATURES</span></div>
                      <ul className="grid gap-x-7 gap-y-3 sm:grid-cols-2">
                        {selectedPlan.features.map((feature,index)=><motion.li key={feature} initial={reduceMotion?false:{opacity:0,x:8}} animate={{opacity:1,x:0}} transition={{duration:.24,delay:reduceMotion?0:index*.025}} className="flex gap-3 text-sm leading-6 text-[#d8d1e0]"><span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#b65cff]/15 text-[#dfb5ff]"><Check size={10}/></span><span>{feature}</span></motion.li>)}
                      </ul>
                    </div>

                    {selectedPlan.monthlyFeatures&&<div className="relative mt-8 rounded-2xl border border-[#bd7bff]/25 bg-[linear-gradient(110deg,rgba(126,47,169,.18),rgba(255,255,255,.025))] p-5 sm:p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h4 className="text-sm font-semibold text-white">Ongoing management</h4><span className="rounded-full border border-[#d5a0ff]/25 px-3 py-1 font-mono text-[9px] tracking-[.12em] text-[#e1b9ff]">₹3,000 / MONTH</span></div>
                      <ul className="grid gap-3 sm:grid-cols-2">{selectedPlan.monthlyFeatures.map(feature=><li key={feature} className="flex gap-2.5 text-xs leading-5 text-[#c9bfd3]"><Check size={14} className="mt-0.5 shrink-0 text-[#d7a0ff]"/>{feature}</li>)}</ul>
                    </div>}

                    <div className="relative mt-8 flex flex-col justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-end">
                      <p className="max-w-xl text-[11px] leading-5 text-[#958da0]">{selectedPlan.note}</p>
                      <a href="/#contact" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-bold text-[#100d16] transition hover:-translate-y-1 hover:bg-[#e7c9ff]">Discuss this plan <ArrowUpRight size={15}/></a>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-7 text-center font-mono text-[9px] tracking-[.14em] text-[#777080]">CLEAR SCOPE · SECURE DELIVERY · NO SURPRISES</p>
          </div>
        </section>

        <section id="automation-catalogue" className="scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 max-w-3xl"><p className="font-mono text-xs tracking-[.18em] text-[var(--mq-accent-soft)]">02 / AI & BUSINESS AUTOMATION</p><h2 className="mt-4 text-4xl font-bold tracking-[-.04em] sm:text-5xl">Forty ways to remove repetitive work.</h2><p className="mt-5 text-base leading-relaxed text-[var(--mq-muted)]">Explore the automation catalogue by business function. Each workflow is scoped around your tools, data, approvals and operating requirements.</p></div>
            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">{[{id:'all',title:'All services'},...categories.map(category=>({id:category.id,title:category.title}))].map(item=><button key={item.id} type="button" onClick={()=>setActiveCategory(item.id)} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition ${activeCategory===item.id?'border-[#c084fc] bg-[#a100ff]/15 text-white':'border-[var(--mq-border)] text-[var(--mq-muted)] hover:text-white'}`}>{item.title}</button>)}</div>
            <div className="space-y-4">
              {visibleCategories.map(category=>(
                <motion.section key={category.id} layout className="overflow-hidden rounded-3xl border border-[var(--mq-border)] bg-[var(--mq-surface)]">
                  <div className="grid gap-5 border-b border-[var(--mq-border)] p-6 sm:p-8 md:grid-cols-[.75fr_1.25fr]">
                    <div><p className="font-mono text-xs text-[var(--mq-accent-soft)]">{category.number} / CATEGORY</p><h3 className="mt-3 text-2xl font-bold tracking-tight">{category.title}</h3></div>
                    <p className="max-w-2xl text-sm leading-relaxed text-[var(--mq-muted)] md:pt-5">{category.intro}</p>
                  </div>
                  <div className="grid gap-px bg-[var(--mq-border)] sm:grid-cols-2 xl:grid-cols-4">
                    {category.services.map((service,index)=><article key={service.name} className="group bg-[var(--mq-surface)] p-5 transition duration-300 hover:-translate-y-1 hover:bg-[#1c1724] sm:p-6">
                      <p className="font-mono text-[9px] tracking-[.14em] text-[var(--mq-accent-soft)]">{category.number}.{String(index+1).padStart(2,'0')} · {service.group}</p>
                      <h4 className="mt-3 text-base font-semibold transition-colors group-hover:text-[#e2baff]">{service.name}</h4>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--mq-muted)]">{service.description}</p>
                      <a href="/#contact" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--mq-text-secondary)] transition hover:text-[#d8a9ff]">Discuss workflow <ArrowUpRight size={13}/></a>
                    </article>)}
                  </div>
                </motion.section>
              ))}
            </div>
            <p className="mt-7 text-xs leading-relaxed text-[var(--mq-muted)]">Automation pricing starts at ₹2,000 per automation per month. Final pricing depends on workflow complexity, connected platforms, AI usage and third-party service costs.</p>
          </div>
        </section>

        <section className="border-y border-[var(--mq-border)] bg-[var(--mq-bg-elevated)] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="font-mono text-xs tracking-[.18em] text-[var(--mq-accent-soft)]">03 / SECURITY BY DESIGN</p><h2 className="mt-4 text-4xl font-bold tracking-[-.04em]">Built with security in mind.</h2><p className="mt-5 text-sm leading-relaxed text-[var(--mq-muted)]">Security is part of the delivery process, not an afterthought. Controls are selected according to the application, data and agreed scope.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['HTTPS and secure deployment configuration','Authentication and role-based access controls','Database permissions and data-boundary checks','Input validation and abuse protections','Backup and recovery considerations','Security review before handover'].map(item=><div key={item} className="flex items-start gap-3 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-5"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--mq-accent-soft)]"/><p className="text-sm leading-relaxed text-[var(--mq-text-secondary)]">{item}</p></div>)}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 rounded-[30px] border border-[#a100ff]/35 bg-[radial-gradient(circle_at_85%_20%,rgba(161,0,255,.18),transparent_35%),var(--mq-surface)] p-8 sm:p-12 lg:flex-row lg:items-end">
            <div className="max-w-3xl"><p className="font-mono text-xs tracking-[.18em] text-[var(--mq-accent-soft)]">LET'S BUILD</p><h2 className="mt-4 text-4xl font-bold tracking-[-.04em] sm:text-5xl">Have a business problem to solve?</h2><p className="mt-5 text-sm leading-relaxed text-[var(--mq-muted)]">Tell us what is slowing your team down. We will help define the right scope, delivery approach and commercial plan.</p></div>
            <a href="/#contact" className="inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:bg-[#e6caff]">Start a conversation <ArrowUpRight size={17}/></a>
          </div>
        </section>
      </main>
      <footer className="border-t border-[var(--mq-border)] px-5 py-7 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 text-xs text-[var(--mq-muted)] sm:flex-row"><span>© 2026 MAVERIQODE. Digital Engineering & Technology.</span><div className="flex gap-5"><a href="/" className="hover:text-white">Home</a><a href="/#company" className="hover:text-white">Company</a><a href="/#contact" className="hover:text-white">Contact</a></div></div></footer>
    </div>
  );
}
