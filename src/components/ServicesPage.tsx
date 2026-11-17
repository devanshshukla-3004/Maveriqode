import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

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

        <section id="plans" className="scroll-mt-24 border-y border-[var(--mq-border)] bg-[var(--mq-bg-elevated)] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div><p className="font-mono text-xs tracking-[.18em] text-[var(--mq-accent-soft)]">01 / COMMERCIAL PLANS</p><h2 className="mt-4 text-4xl font-bold tracking-[-.04em] sm:text-5xl">Clear plans. Defined scope.</h2></div>
              <p className="max-w-lg text-sm leading-relaxed text-[var(--mq-muted)]">Choose a starting point. We confirm requirements, integrations and delivery milestones before work begins.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan,index)=>(
                <motion.article key={plan.id} initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once:true, amount:.12 }} variants={fadeUp} transition={{ duration:.45, delay:index*.05 }} className={`relative flex flex-col rounded-3xl border p-6 sm:p-7 ${plan.featured?'border-[#a100ff]/70 bg-[linear-gradient(155deg,rgba(87,24,132,.28),rgba(18,18,23,.98)_52%)] shadow-[0_18px_70px_rgba(92,20,145,.13)]':'border-[var(--mq-border)] bg-[var(--mq-surface)]'}`}>
                  {plan.featured&&<span className="absolute right-5 top-5 rounded-full border border-[#c084fc]/40 bg-[#a100ff]/15 px-3 py-1 font-mono text-[9px] tracking-wider text-[#e9c7ff]">FLAGSHIP</span>}
                  <p className="font-mono text-[10px] tracking-[.15em] text-[var(--mq-accent-soft)]">{String(index+1).padStart(2,'0')} / PLAN</p>
                  <h3 className="mt-5 max-w-[80%] text-2xl font-bold tracking-tight">{plan.label}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-relaxed text-[var(--mq-muted)]">{plan.summary}</p>
                  <div className="mt-6 border-y border-[var(--mq-border)] py-5">
                    <div className="flex flex-wrap items-baseline gap-x-2"><span className="text-4xl font-bold tracking-tight">{plan.price}</span><span className="text-xs text-[var(--mq-muted)]">{plan.cadence}</span></div>
                    {plan.monthly&&<p className="mt-2 text-sm font-semibold text-[var(--mq-accent-soft)]">{plan.monthly}</p>}
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">{plan.features.map(feature=><li key={feature} className="flex gap-2.5 text-sm leading-relaxed text-[var(--mq-text-secondary)]"><Check size={16} className="mt-0.5 shrink-0 text-[var(--mq-accent-soft)]"/><span>{feature}</span></li>)}</ul>
                  {plan.monthlyFeatures&&<div className="mt-6 rounded-2xl border border-[#a100ff]/25 bg-black/20 p-4"><p className="mb-3 text-xs font-semibold text-[#e9c7ff]">Monthly management includes</p><ul className="space-y-2">{plan.monthlyFeatures.map(feature=><li key={feature} className="flex gap-2 text-xs leading-relaxed text-[var(--mq-text-secondary)]"><Check size={14} className="mt-0.5 shrink-0 text-[#d28cff]"/>{feature}</li>)}</ul></div>}
                  <p className="mt-6 border-t border-[var(--mq-border)] pt-4 text-xs leading-relaxed text-[var(--mq-muted)]">{plan.note}</p>
                  <a href={`/#contact`} className="mt-6 inline-flex items-center justify-between rounded-xl border border-[var(--mq-border-strong)] px-4 py-3.5 text-sm font-semibold transition hover:border-[#c084fc] hover:bg-white/5">Discuss this plan <ArrowUpRight size={16}/></a>
                </motion.article>
              ))}
            </div>
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
                    {category.services.map((service,index)=><article key={service.name} className="bg-[var(--mq-surface)] p-5 sm:p-6">
                      <p className="font-mono text-[9px] tracking-[.14em] text-[var(--mq-accent-soft)]">{category.number}.{String(index+1).padStart(2,'0')} · {service.group}</p>
                      <h4 className="mt-3 text-base font-semibold">{service.name}</h4>
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
