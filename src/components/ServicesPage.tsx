import { FormEvent, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { supabase } from '../lib/supabase';

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
  const [activeCategory, setActiveCategory] = useState('sales');
  const [selectedPlanId, setSelectedPlanId] = useState('business');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryOrganization, setEnquiryOrganization] = useState('');
  const [enquiryDetails, setEnquiryDetails] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [enquiryError, setEnquiryError] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
  const reduceMotion = useReducedMotion();
  const visibleCategories = useMemo(() => activeCategory === 'all' ? categories : categories.filter((category) => category.id === activeCategory), [activeCategory]);
  const openPlanEnquiry = () => {
    setSelectedWorkflow('');
    setEnquiryDetails('');
    setEnquiryError('');
    setEnquirySuccess(false);
    setEnquiryOpen(true);
  };

  const openWorkflowEnquiry = (workflow: string) => {
    setSelectedPlanId('automation');
    setSelectedWorkflow(workflow);
    setEnquiryDetails('');
    setEnquiryError('');
    setEnquirySuccess(false);
    setEnquiryOpen(true);
  };

  const handleEnquirySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (enquirySubmitting) return;
    const name = enquiryName.trim();
    const email = enquiryEmail.trim();
    if (name.length < 2) { setEnquiryError('Please enter your name or organization.'); return; }
    if (!/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(email)) { setEnquiryError('Please enter a valid email address.'); return; }
    setEnquirySubmitting(true);
    setEnquiryError('');
    const selected = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
    const message = [
      'Service enquiry from the MAVERIQODE Services page.',
      `Selected plan: ${selected.label}`,
      `Displayed pricing: ${selected.price} (${selected.cadence})`,
      selected.monthly ? `Additional management: ${selected.monthly}` : '',
      selectedWorkflow ? `Selected automation workflow: ${selectedWorkflow}` : '',
      enquiryOrganization.trim() ? `Business / organization: ${enquiryOrganization.trim()}` : '',
      enquiryDetails.trim() ? `Project details: ${enquiryDetails.trim()}` : '',
    ].filter(Boolean).join('\n');
    const { error } = await supabase.functions.invoke('website-enquiry', {
      body: { name, email, service: selected.label, message, website: '' },
    });
    setEnquirySubmitting(false);
    if (error) { setEnquiryError('We could not submit your enquiry right now. Please try again or email maveriqode@gmail.com.'); return; }
    setEnquirySuccess(true);
    setEnquiryName(''); setEnquiryEmail(''); setEnquiryOrganization(''); setEnquiryDetails('');
  };


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
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <motion.div initial={reduceMotion ? false : 'hidden'} animate="visible" variants={fadeUp} transition={{ duration: .7 }}>
              <p className="mb-5 font-mono text-xs tracking-[.2em] text-[var(--mq-accent-soft)]">MAVERIQODE / SERVICES & SOLUTIONS</p>
              <h1 className="max-w-4xl text-balance font-display text-[clamp(3rem,7vw,6.8rem)] font-extrabold leading-[.94] tracking-[-.065em]">Build the systems that <span className="mq-serif-accent font-medium text-[var(--mq-accent-soft)]">move business.</span></h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--mq-text-secondary)] sm:text-lg">From high-performing websites to connected business platforms and AI-powered workflows, explore practical services designed around the way your organization works.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#plans" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#a100ff] to-[#2a00c8] px-6 py-3.5 text-sm font-semibold text-white">Explore plans <ArrowDown size={16}/></a>
                <a href="#automation-catalogue" className="inline-flex items-center gap-2 rounded-full border border-[var(--mq-border-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--mq-text)] transition hover:border-[#bd7aff]">Browse 40 automations <ArrowRight size={16}/></a>
              </div>
            </motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, scale: .96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .8, delay: .12 }} className="relative -mt-2 rounded-[28px] border border-[var(--mq-border)] bg-[linear-gradient(145deg,rgba(161,0,255,.16),rgba(255,255,255,.025)_50%,rgba(42,0,200,.14))] p-6 shadow-[0_28px_90px_rgba(81,25,130,.16)] sm:p-8 lg:-translate-y-5">
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
                    variants={{ hidden: { opacity: 0, x: reduceMotion ? 0 : -26, y: reduceMotion ? 0 : 16, scale: reduceMotion ? 1 : .985 }, visible: { opacity: 1, x: 0, y: 0, scale: 1 } }}
                    transition={{ duration: reduceMotion ? 0 : .62, ease: [.22, 1, .36, 1] }}
                    whileHover={reduceMotion?undefined:{x:5,y:-3,scale:1.008}}
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
                    initial={reduceMotion?false:{opacity:0,y:14,filter:'blur(5px)'}}
                    animate={{opacity:1,y:0,filter:'blur(0px)'}}
                    exit={reduceMotion?undefined:{opacity:0,y:-8,filter:'blur(4px)'}}
                    transition={{duration:reduceMotion?0:.46,ease:[.22,1,.36,1]}}
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
                      <button type="button" onClick={openPlanEnquiry} className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-xs font-bold text-[#100d16] transition hover:-translate-y-1 hover:bg-[#e7c9ff]">Discuss this plan <ArrowUpRight size={15}/></button>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-7 text-center font-mono text-[9px] tracking-[.14em] text-[#777080]">CLEAR SCOPE · SECURE DELIVERY · NO SURPRISES</p>
          </div>
        </section>

        <section id="automation-catalogue" className="relative isolate scroll-mt-24 overflow-hidden border-y border-[var(--mq-border)] bg-[#09080f] px-5 py-24 sm:px-8 lg:px-12">
          <div aria-hidden="true" className="mq-pricing-grid pointer-events-none absolute inset-0 opacity-50" />
          <div aria-hidden="true" className="mq-pricing-aurora pointer-events-none absolute -right-48 top-20 h-[480px] w-[480px] rounded-full blur-[120px]" />
          <div className="relative mx-auto max-w-[1440px]">
            <div className="mb-14 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[.24em] text-[#d7a0ff]"><span className="h-px w-8 bg-[#b65cff]" /> 02 / AI & BUSINESS AUTOMATION</p>
                <h2 className="text-balance text-5xl font-bold leading-[.98] tracking-[-.065em] sm:text-6xl lg:text-7xl">Make room for <span className="mq-serif-accent text-[#d7a0ff]">better work.</span></h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#a6a0b2]">Forty practical automation workflows, organized by the way your business operates. Choose a category to explore what can be streamlined.</p>
            </div>

            <div className="grid items-start gap-8 xl:grid-cols-[.82fr_1.18fr]">
              <div className="relative">
                <div className="mb-5 flex items-center justify-between px-1"><span className="font-mono text-[9px] tracking-[.22em] text-[#9d91ac]">EXPLORE BY FUNCTION</span><span className="font-mono text-[9px] tracking-[.18em] text-[#b65cff]">05 CATEGORIES / 40 WORKFLOWS</span></div>
                <div aria-hidden="true" className="pointer-events-none absolute -left-3 top-16 bottom-16 w-px bg-gradient-to-b from-transparent via-[#9b4cce]/50 to-transparent" />
                <motion.div
                  className="mq-plan-stack grid gap-4 sm:grid-cols-2 xl:grid-cols-1"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.16 }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: reduceMotion ? 0 : 0.06 } } }}
                >
                  {categories.map((category,index)=>(
                    <motion.button
                      key={category.id}
                      type="button"
                      onClick={()=>setActiveCategory(category.id)}
                      variants={{ hidden: { opacity: 0, x: reduceMotion ? 0 : -28, y: reduceMotion ? 0 : 14 }, visible: { opacity: 1, x: 0, y: 0 } }}
                      transition={{ duration: reduceMotion ? 0 : .62, ease: [.22,1,.36,1] }}
                      whileHover={reduceMotion ? undefined : { x: 5, y: -2 }}
                      whileTap={reduceMotion ? undefined : { scale: .99 }}
                      style={{ zIndex: activeCategory === category.id ? 2 : 1 }}
                      aria-pressed={activeCategory===category.id}
                      className={`mq-plan-choice mq-category-choice group relative min-h-[126px] w-full overflow-hidden rounded-[22px] border p-5 text-left sm:p-6 ${activeCategory===category.id?'mq-plan-active mq-category-active':'border-white/10'}`}
                    >
                      <span aria-hidden="true" className="mq-plan-sheen pointer-events-none absolute inset-0" />
                      <div className="flex items-start justify-between gap-4">
                        <div><p className={`font-mono text-[9px] tracking-[.2em] ${activeCategory===category.id?'text-[#e2baff]':'text-[#777181]'}`}>{category.number} / AUTOMATION CATEGORY</p><h3 className="mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">{category.title}</h3><p className="mt-2 text-xs text-[#a7a0b2]">{category.services.length} workflows available</p></div>
                        <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${activeCategory===category.id?'border-[#d5a0ff]/60 bg-[#b65cff]/20 text-[#f0d8ff]':'border-white/10 text-[#7d7788] group-hover:text-white'}`}><ArrowUpRight size={15}/></span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
                <div className="mt-5 flex items-center justify-between gap-3 px-1">
                  <span className="font-mono text-[9px] tracking-[.14em] text-[#82788f]">SELECT A CATEGORY TO EXPLORE</span>
                  <button type="button" onClick={()=>setActiveCategory('all')} className={`rounded-full border px-3.5 py-2 font-mono text-[9px] tracking-[.12em] transition-colors duration-300 ${activeCategory==='all'?'border-[#c084fc]/60 bg-[#a100ff]/15 text-white':'border-white/10 text-[#a6a0b2] hover:border-[#c084fc]/50 hover:text-white'}`}>VIEW ALL 40</button>
                </div>
              </div>

              <div className="relative min-h-[620px]">
                <div aria-hidden="true" className="mq-plan-glow pointer-events-none absolute -inset-5 rounded-[38px] blur-2xl" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={reduceMotion?false:{opacity:0,y:16,filter:'blur(7px)'}}
                    animate={{opacity:1,y:0,filter:'blur(0px)'}}
                    exit={reduceMotion?undefined:{opacity:0,y:-10,filter:'blur(5px)'}}
                    transition={{duration:reduceMotion?0:.48,ease:[.22,1,.36,1]}}
                    className="relative overflow-hidden rounded-[30px] border border-white/15 bg-[linear-gradient(145deg,rgba(41,22,55,.94),rgba(13,12,19,.98)_48%,rgba(12,13,23,.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,.34)] sm:p-8 lg:p-9"
                  >
                    {visibleCategories.map(category=>(
                      <section key={category.id} className="relative">
                        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
                          <div><p className="font-mono text-[9px] tracking-[.2em] text-[#c89aff]">{category.number} / CATEGORY</p><h3 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">{category.title}</h3><p className="mt-3 max-w-xl text-sm leading-6 text-[#aaa1b4]">{category.intro}</p></div>
                          <span className="rounded-full border border-[#d5a0ff]/25 bg-[#a100ff]/10 px-3 py-1.5 font-mono text-[9px] tracking-[.12em] text-[#e1b9ff]">{category.services.length} WORKFLOWS</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {category.services.map((service,index)=>(
                            <motion.article
                              key={service.name}
                              initial={reduceMotion?false:{opacity:0,y:10}}
                              animate={{opacity:1,y:0}}
                              transition={{duration:reduceMotion?0:.38,delay:reduceMotion?0:index*.035,ease:[.22,1,.36,1]}}
                              whileHover={reduceMotion?undefined:{y:-3}}
                              className="group rounded-2xl border border-white/[.09] bg-white/[.025] p-4 transition-colors duration-300 hover:border-[#bd7bff]/40 hover:bg-[#a100ff]/[.07] sm:p-5"
                            >
                              <p className="font-mono text-[9px] tracking-[.12em] text-[#c89aff]">{category.number}.{String(index+1).padStart(2,'0')} · {service.group}</p>
                              <h4 className="mt-3 text-sm font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[#e5c8ff]">{service.name}</h4>
                              <p className="mt-2 text-xs leading-relaxed text-[#aaa1b4]">{service.description}</p>
                              <button type="button" onClick={()=>openWorkflowEnquiry(service.name)} className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#d8d1e0] transition-colors duration-300 hover:text-[#e2baff]">Discuss workflow <ArrowUpRight size={13}/></button>
                            </motion.article>
                          ))}
                        </div>
                      </section>
                    ))}
                    {activeCategory==='all'&&<p className="mt-8 border-t border-white/10 pt-5 text-[11px] leading-5 text-[#958da0]">Automation pricing starts at ₹2,000 per automation per month. Final pricing depends on workflow complexity, connected platforms, AI usage and third-party service costs.</p>}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-7 text-center font-mono text-[9px] tracking-[.14em] text-[#777080]">CLEAR SCOPE · CONNECTED WORKFLOWS · HUMAN OVERSIGHT</p>
          </div>
        </section>

        <section className="relative isolate overflow-hidden border-y border-white/10 bg-[#09070f] px-5 py-24 sm:px-8 lg:px-12">
          <div aria-hidden="true" className="mq-pricing-grid pointer-events-none absolute inset-0 opacity-45" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-10 h-[520px] w-[520px] rounded-full bg-[#7025a8]/20 blur-[140px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-[-220px] h-[520px] w-[520px] rounded-full bg-[#3510a0]/15 blur-[140px]" />
          <div className="relative mx-auto max-w-[1440px]">
            <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <motion.div initial={reduceMotion?false:{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{duration:reduceMotion?0:.65,ease:[.22,1,.36,1]}} className="max-w-3xl">
                <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[.24em] text-[#d7a0ff]"><span className="h-px w-8 bg-[#b65cff]"/>03 / SECURITY BY DESIGN</p>
                <h2 className="text-balance text-5xl font-bold leading-[.98] tracking-[-.065em] text-white sm:text-6xl lg:text-7xl">Trust is <span className="mq-serif-accent text-[#d7a0ff]">engineered.</span></h2>
              </motion.div>
              <p className="max-w-md text-sm leading-7 text-[#aaa1b4]">Security is built into the delivery process—not bolted on at the end. Controls are chosen around the application, the data it handles and the agreed scope.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
              <motion.div initial={reduceMotion?false:{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} transition={{duration:reduceMotion?0:.7,ease:[.22,1,.36,1]}} className="relative flex min-h-[330px] flex-col justify-between overflow-hidden rounded-[28px] border border-[#c084fc]/25 bg-[linear-gradient(145deg,rgba(55,24,78,.7),rgba(16,12,24,.96)_65%)] p-7 sm:p-9">
                <div aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-[#d7a0ff]/15 shadow-[0_0_0_28px_rgba(215,160,255,.025),0_0_0_60px_rgba(215,160,255,.018)]"/>
                <div className="relative flex items-center justify-between"><span className="font-mono text-[9px] tracking-[.2em] text-[#cba4e8]">SECURITY PRINCIPLES</span><ShieldCheck size={19} className="text-[#d7a0ff]"/></div>
                <div className="relative"><p className="font-display text-7xl font-bold tracking-[-.07em] text-white sm:text-8xl">06</p><p className="mt-2 max-w-[220px] text-sm leading-6 text-[#bdb2c8]">Core safeguards considered across every engagement.</p></div>
                <div className="relative flex items-center gap-2 border-t border-white/10 pt-5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.8)]"/><span className="font-mono text-[9px] tracking-[.16em] text-[#aaa1b4]">SECURITY-FIRST DELIVERY</span></div>
              </motion.div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['01','Secure deployment','HTTPS, SSL and secure environment configuration.'],
                  ['02','Identity & access','Authentication and role-based access controls.'],
                  ['03','Data boundaries','Database permissions and tenant/data isolation checks.'],
                  ['04','Abuse prevention','Input validation, rate limits and request protections.'],
                  ['05','Resilience','Backup, recovery and operational continuity considerations.'],
                  ['06','Pre-handover review','A scoped security review before the system is handed over.'],
                ].map(([number,title,description],index)=><motion.article key={number} initial={reduceMotion?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:reduceMotion?0:.5,delay:reduceMotion?0:index*.06,ease:[.22,1,.36,1]}} whileHover={reduceMotion?undefined:{y:-3}} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.025] p-5 transition-colors duration-500 hover:border-[#c084fc]/40 hover:bg-[#a100ff]/[.06] sm:p-6">
                    <div className="mb-5 flex items-center justify-between"><span className="font-mono text-[9px] tracking-[.16em] text-[#c89aff]">{number} / CONTROL</span><ShieldCheck size={16} className="text-[#9b7eae] transition-colors group-hover:text-[#e0b4ff]"/></div>
                    <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3><p className="mt-2 text-xs leading-6 text-[#a9a1b2]">{description}</p>
                  </motion.article>)}
              </div>
            </div>
            <p className="mt-7 text-center font-mono text-[9px] tracking-[.14em] text-[#777080]">SECURITY CONTROLS ARE SCOPED TO THE PRODUCT, DATA AND DELIVERY REQUIREMENTS</p>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 rounded-[30px] border border-[#a100ff]/35 bg-[radial-gradient(circle_at_85%_20%,rgba(161,0,255,.18),transparent_35%),var(--mq-surface)] p-8 sm:p-12 lg:flex-row lg:items-end">
            <div className="max-w-3xl"><p className="font-mono text-xs tracking-[.18em] text-[var(--mq-accent-soft)]">LET'S BUILD</p><h2 className="mt-4 text-4xl font-bold tracking-[-.04em] sm:text-5xl">Have a business problem to solve?</h2><p className="mt-5 text-sm leading-relaxed text-[var(--mq-muted)]">Tell us what is slowing your team down. We will help define the right scope, delivery approach and commercial plan.</p></div>
            <button type="button" onClick={openPlanEnquiry} className="inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:bg-[#e6caff]">Start a conversation <ArrowUpRight size={17}/></button>
          </div>
        </section>
      </main>
      <AnimatePresence>
        {enquiryOpen && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md sm:p-6" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={(event)=>{if(event.target===event.currentTarget&&!enquirySubmitting)setEnquiryOpen(false);}}>
            <motion.section role="dialog" aria-modal="true" aria-labelledby="service-enquiry-title" initial={reduceMotion?false:{opacity:0,y:24,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={reduceMotion?undefined:{opacity:0,y:14,scale:.99}} transition={{duration:reduceMotion?0:.32,ease:[.22,1,.36,1]}} className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#c084fc]/25 bg-[linear-gradient(145deg,#21132d,#0d0b13_58%,#10101a)] p-6 shadow-[0_35px_120px_rgba(0,0,0,.65)] sm:p-9">
              <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#a100ff]/15 blur-[90px]"/>
              <div className="relative">
                <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-6">
                  <div><p className="font-mono text-[9px] tracking-[.2em] text-[#d7a0ff]">MAVERIQODE / PROJECT ENQUIRY</p><h2 id="service-enquiry-title" className="mt-3 text-3xl font-bold tracking-[-.04em] text-white sm:text-4xl">Let’s shape your <span className="mq-serif-accent text-[#d7a0ff]">next move.</span></h2><p className="mt-2 text-sm text-[#aaa1b4]">Confirm your selection and tell us a little about what you need.</p></div>
                  <button type="button" onClick={()=>setEnquiryOpen(false)} disabled={enquirySubmitting} aria-label="Close enquiry form" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/30 hover:text-white">×</button>
                </div>
                {enquirySuccess ? (
                  <div role="status" className="py-12 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"><Check size={24}/></span><h3 className="mt-5 text-2xl font-semibold text-white">Enquiry received.</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#aaa1b4]">Thanks for considering MAVERIQODE. Your selected plan and project details have been sent to our team. We’ll get in touch using your email.</p><button type="button" onClick={()=>setEnquiryOpen(false)} className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#100d16] transition hover:bg-[#e7c9ff]">Done</button></div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="relative mt-7 grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-xs font-medium text-[#d8d1e0]">Name / contact person<input required minLength={2} maxLength={120} value={enquiryName} onChange={e=>setEnquiryName(e.target.value)} placeholder="Your name" className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#b65cff]"/></label>
                      <label className="grid gap-2 text-xs font-medium text-[#d8d1e0]">Email address<input required type="email" maxLength={254} value={enquiryEmail} onChange={e=>setEnquiryEmail(e.target.value)} placeholder="you@company.com" className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#b65cff]"/></label>
                    </div>
                    <label className="grid gap-2 text-xs font-medium text-[#d8d1e0]">Business / organization <span className="font-normal text-[#82788f]">Optional</span><input maxLength={180} value={enquiryOrganization} onChange={e=>setEnquiryOrganization(e.target.value)} placeholder="Company or organization name" className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#b65cff]"/></label>
                    <label className="grid gap-2 text-xs font-medium text-[#d8d1e0]">Selected plan<select value={selectedPlanId} onChange={e=>{setSelectedPlanId(e.target.value);if(e.target.value!=='automation')setSelectedWorkflow('');}} className="w-full rounded-xl border border-[#b65cff]/35 bg-[#17111f] px-4 py-3.5 text-sm text-white outline-none focus:border-[#d7a0ff]">{plans.map(plan=><option key={plan.id} value={plan.id}>{plan.label} — {plan.price} ({plan.cadence})</option>)}</select></label>
                    {selectedWorkflow && selectedPlanId==='automation' && <div className="rounded-xl border border-[#b65cff]/25 bg-[#a100ff]/10 px-4 py-3"><p className="font-mono text-[9px] tracking-[.16em] text-[#c89aff]">SELECTED AUTOMATION</p><p className="mt-1 text-sm font-semibold text-white">{selectedWorkflow}</p></div>}
                    <label className="grid gap-2 text-xs font-medium text-[#d8d1e0]">What would you like to build? <span className="font-normal text-[#82788f]">Optional</span><textarea rows={3} maxLength={3000} value={enquiryDetails} onChange={e=>setEnquiryDetails(e.target.value)} placeholder="Share your goals, requirements, preferred timeline or questions..." className="w-full resize-y rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#777181] focus:border-[#b65cff]"/></label>
                    {enquiryError && <p role="alert" className="text-xs text-rose-300">{enquiryError}</p>}
                    <div className="mt-1 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center"><p className="max-w-sm text-[10px] leading-5 text-[#8f879a]">This is a project enquiry, not a payment or confirmed order. We’ll contact you to finalize scope and next steps.</p><button type="submit" disabled={enquirySubmitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a100ff] to-[#5b22d5] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">{enquirySubmitting?'Sending enquiry…':'Submit enquiry'} <ArrowUpRight size={15}/></button></div>
                  </form>
                )}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="border-t border-[var(--mq-border)] px-5 py-7 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 text-xs text-[var(--mq-muted)] sm:flex-row"><span>© 2026 MAVERIQODE. Digital Engineering & Technology.</span><div className="flex gap-5"><a href="/" className="hover:text-white">Home</a><a href="/#company" className="hover:text-white">Company</a><a href="/#contact" className="hover:text-white">Contact</a></div></div></footer>
    </div>
  );
}
