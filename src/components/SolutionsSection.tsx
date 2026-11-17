import { ArrowUpRight, Check, Globe2, Layers3, Bot, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { ServiceOption } from '../data/maveriqodeData';
import { EditorialSerifAccent } from './EditorialSerifAccent';

interface SolutionsSectionProps {
  onSelectSolution: (service: ServiceOption, contextNote: string) => void;
}

const plans = [
  {
    id: '01',
    name: 'Website Development',
    price: '₹5,000',
    cadence: 'one-time',
    description: 'A complete, polished business website built to represent your brand online.',
    icon: Globe2,
    tone: 'from-[#a9d8ff] via-[#d9c7ff] to-[#f4d6ff]',
    ink: '#21143c',
    featured: false,
    features: ['Unlimited content pages', 'Responsive design for all screens', 'SEO foundation and metadata', 'Domain & hosting configuration', 'Custom admin panel', 'Enquiry forms and security hardening'],
    note: 'Domain renewals and premium third-party services are charged separately where applicable.',
    service: 'Software Engineering' as ServiceOption,
  },
  {
    id: '02',
    name: 'Complete Business System',
    price: '₹10,000',
    cadence: 'one-time setup',
    monthly: '₹3,000 / month',
    description: 'A connected operating system for your website, customers and daily business operations.',
    icon: Layers3,
    tone: 'from-[#c9a5ff] via-[#a88bff] to-[#7c9cff]',
    ink: '#160c2c',
    featured: true,
    features: ['Website + SEO + hosting setup', 'Custom admin control panel', 'CRM and sales pipeline', 'ERP and operations modules', 'One business automation included', 'Monthly security audit and ongoing management'],
    note: 'Major new modules, paid integrations and external usage charges are quoted separately.',
    service: 'SaaS & Product Development' as ServiceOption,
  },
  {
    id: '03',
    name: 'Website + SEO Starter',
    price: '₹1,000',
    cadence: 'per month',
    description: 'A managed online presence for businesses that want to get started simply.',
    icon: Sparkles,
    tone: 'from-[#b8f0d8] via-[#c8e8d8] to-[#f0f4c8]',
    ink: '#102d25',
    featured: false,
    features: ['Business website setup', 'Hosting configuration', 'Basic on-page SEO', 'Search metadata and indexing', 'Routine website upkeep', 'Basic security updates'],
    note: 'Final page structure, domain and hosting limits are confirmed before onboarding.',
    service: 'Digital Infrastructure' as ServiceOption,
  },
  {
    id: '04',
    name: 'Business Automation',
    price: '₹2,000',
    cadence: 'per automation / month',
    description: 'Automate one clearly defined repetitive workflow across your business.',
    icon: Bot,
    tone: 'from-[#ffd4a8] via-[#ffb9c8] to-[#e3c5ff]',
    ink: '#3b1d2c',
    featured: false,
    features: ['One selected automation workflow', 'Workflow mapping and configuration', 'Supported app/API integrations', 'Testing and deployment', 'Error notifications and monitoring', 'Ongoing workflow maintenance'],
    note: 'Third-party subscriptions, API credits and AI usage are separate unless included in the proposal.',
    service: 'Automation & Integration' as ServiceOption,
  },
  {
    id: '05',
    name: 'Mobile App Development',
    price: '₹5,000',
    cadence: 'one-time development',
    monthly: '₹1,000 / month after 3 free months',
    description: 'A custom mobile app delivered against an agreed feature scope.',
    icon: Smartphone,
    tone: 'from-[#a9d6ff] via-[#b8c6ff] to-[#d8b8ff]',
    ink: '#172344',
    featured: false,
    features: ['Custom app UI and user flows', 'Frontend and backend implementation', 'Database and API integration', 'Admin panel where required', 'Testing and deployment assistance', 'First 3 months management included'],
    note: 'Store accounts, paid services and third-party charges are separate.',
    service: 'SaaS & Product Development' as ServiceOption,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function SolutionsSection({ onSelectSolution }: SolutionsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="solutions" className="relative isolate overflow-hidden scroll-mt-20 bg-[#09070f] px-5 py-24 transition-colors duration-200 sm:px-8 lg:px-12 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-40" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-56 top-20 h-[520px] w-[520px] rounded-full bg-[#7025a8]/15 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-0 h-[520px] w-[520px] rounded-full bg-[#2639a8]/15 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease }}
          className="mb-14 flex flex-col justify-between gap-7 lg:mb-16 lg:flex-row lg:items-end"
        >
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[.24em] text-[#d7a0ff]"><span className="h-px w-8 bg-[#b65cff]" />03 / PLANS & ENGAGEMENTS</p>
            <h2 className="text-balance text-5xl font-bold leading-[.98] tracking-[-.065em] text-white sm:text-6xl lg:text-7xl">
              Pick your next <EditorialSerifAccent targetTracking="-0.02em">move.</EditorialSerifAccent>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#aaa1b4] sm:text-base">
              Clear starting points. Defined scope. Engineering that grows with your business.
              Choose a plan to start a conversation around what you need.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/[.035] px-4 py-2.5 font-mono text-[9px] tracking-[.16em] text-[#c9bfd3] lg:self-end">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
            05 PLANS · BUILT TO SCALE
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.article
                key={plan.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 34, rotateX: 7 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.14 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.68, delay: shouldReduceMotion ? 0 : index * 0.075, ease }}
                whileHover={shouldReduceMotion ? undefined : { y: -9, rotate: index % 2 === 0 ? -0.5 : 0.5, transition: { duration: 0.28, ease } }}
                className={`group relative flex min-h-[560px] flex-col overflow-hidden rounded-[28px] border p-4 shadow-[0_24px_70px_rgba(0,0,0,.25)] transition-colors duration-500 sm:p-5 ${plan.featured ? 'border-[#c084fc]/50 bg-[linear-gradient(160deg,rgba(83,43,125,.38),rgba(17,13,25,.98)_48%)] xl:-translate-y-5 xl:scale-[1.025]' : 'border-white/10 bg-[#111019]/90 hover:border-[#c084fc]/35'}`}
              >
                {plan.featured && <div className="absolute right-5 top-5 z-20 rounded-full border border-[#e5c7ff]/30 bg-[#a100ff]/20 px-3 py-1.5 font-mono text-[8px] tracking-[.16em] text-[#f0dfff]">MOST COMPLETE</div>}
                <div className={`relative mb-5 flex h-[190px] shrink-0 items-center justify-center overflow-hidden rounded-[21px] bg-gradient-to-br ${plan.tone}`}>
                  <div aria-hidden="true" className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(20,10,40,.45) .8px, transparent .8px)', backgroundSize: '12px 12px' }} />
                  <div aria-hidden="true" className="absolute -right-12 -top-20 h-56 w-56 rounded-full border border-black/15 shadow-[0_0_0_22px_rgba(20,10,40,.035),0_0_0_48px_rgba(20,10,40,.025)] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" />
                  <div aria-hidden="true" className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full border border-black/15 shadow-[0_0_0_18px_rgba(20,10,40,.035)]" />
                  <div className="relative z-10 flex w-full items-center justify-between px-7">
                    <div>
                      <p className="font-mono text-[10px] tracking-[.2em]" style={{ color: plan.ink }}>{plan.id} / MAVERIQODE</p>
                      <p className="mt-3 text-5xl font-black tracking-[-.08em]" style={{ color: plan.ink }}>{plan.price}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[.12em]" style={{ color: plan.ink }}>{plan.cadence}</p>
                    </div>
                    <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-black/10 bg-white/35 shadow-[0_14px_35px_rgba(20,10,40,.13)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                      <Icon size={32} strokeWidth={1.5} style={{ color: plan.ink }} />
                    </div>
                  </div>
                  <span className="absolute bottom-4 right-5 font-mono text-[8px] tracking-[.18em]" style={{ color: plan.ink }}>SERVICE COLLECTION / {plan.id}</span>
                </div>

                <div className="flex flex-1 flex-col px-2 pb-2">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold tracking-[-.035em] text-white sm:text-2xl">{plan.name}</h3>
                    <p className="mt-2 min-h-[48px] text-xs leading-6 text-[#aaa1b4]">{plan.description}</p>
                    {plan.monthly && <p className="mt-3 inline-flex rounded-full border border-[#c084fc]/25 bg-[#a100ff]/10 px-3 py-1.5 text-[10px] font-semibold text-[#e1c5ff]">{plan.monthly}</p>}
                  </div>

                  <div className="mb-5 h-px bg-white/10" />
                  <ul className="mb-7 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs leading-relaxed text-[#d4cedb]">
                        <Check size={14} className="mt-0.5 shrink-0 text-[#d5a2ff]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <p className="mb-4 min-h-[38px] text-[10px] leading-5 text-[#81798c]">{plan.note}</p>
                    <motion.button
                      type="button"
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.975 }}
                      onClick={() => onSelectSolution(plan.service, `Selected plan: ${plan.name}. Price: ${plan.price} (${plan.cadence}). ${plan.monthly ? `Ongoing management: ${plan.monthly}. ` : ''}Please discuss the scope and next steps for this plan.`)}
                      className="group/cta flex w-full items-center justify-between rounded-full border border-white/15 bg-white/[.06] px-5 py-3.5 text-xs font-semibold text-white transition-all duration-300 hover:border-transparent hover:bg-gradient-to-r hover:from-[#a100ff] hover:to-[#5524cf]"
                    >
                      <span>Discuss this plan</span>
                      <ArrowUpRight size={16} className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-8 text-center font-mono text-[9px] tracking-[.13em] text-[#777080]">THIRD-PARTY SUBSCRIPTIONS, API CREDITS AND EXTERNAL USAGE ARE SEPARATE WHERE APPLICABLE · FINAL SCOPE CONFIRMED BEFORE WORK BEGINS</p>
      </div>
    </section>
  );
}
