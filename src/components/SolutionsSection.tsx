import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Globe2, Layers3, Bot, Smartphone, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
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
    tone: 'from-[#21152f] via-[#171323] to-[#111827]',
    ink: '#f3eaff',
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
    tone: 'from-[#32164d] via-[#21163e] to-[#17294b]',
    ink: '#f6edff',
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
    tone: 'from-[#142d2a] via-[#182b35] to-[#202b35]',
    ink: '#e8fff7',
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
    tone: 'from-[#352018] via-[#2c1a2a] to-[#251a36]',
    ink: '#fff0e8',
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
    tone: 'from-[#17263c] via-[#202044] to-[#2a1c3d]',
    ink: '#eaf2ff',
    features: ['Custom app UI and user flows', 'Frontend and backend implementation', 'Database and API integration', 'Admin panel where required', 'Testing and deployment assistance', 'First 3 months management included'],
    note: 'Store accounts, paid services and third-party charges are separate.',
    service: 'SaaS & Product Development' as ServiceOption,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function SolutionsSection({ onSelectSolution }: SolutionsSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activePlan, setActivePlan] = useState(1);
  const move = (direction: number) => setActivePlan((current) => (current + direction + plans.length) % plans.length);

  return (
    <section id="solutions" className="relative isolate overflow-hidden scroll-mt-20 bg-[#09090f] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mq-blueprint-grid opacity-30" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-24 h-[520px] w-[520px] rounded-full bg-[#7c2cff]/16 blur-[150px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-0 h-[520px] w-[520px] rounded-full bg-[#3158d8]/14 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease }}
          className="mb-10 flex flex-col justify-between gap-7 lg:mb-12 lg:flex-row lg:items-end"
        >
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[.24em] text-[#d7a0ff]"><span className="h-px w-8 bg-[#b65cff]" />03 / PLANS & ENGAGEMENTS</p>
            <h2 className="text-balance text-5xl font-bold leading-[.98] tracking-[-.065em] text-white sm:text-6xl lg:text-7xl">
              Pick your next <EditorialSerifAccent targetTracking="-0.02em">move.</EditorialSerifAccent>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#aaa1b4] sm:text-base">
              Five ways to move your business forward. Find the right starting point, then let’s shape the details together.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/[.035] px-4 py-2.5 font-mono text-[9px] tracking-[.16em] text-[#c9bfd3] lg:self-end">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
            05 PLANS · BUILT TO SCALE
          </div>
        </motion.div>

        <div className="relative mx-auto max-w-[1160px]">
          <div className="relative h-[690px] overflow-hidden [perspective:1600px] sm:h-[650px] lg:h-[630px]">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const raw = index - activePlan;
              const offset = raw > 2 ? raw - plans.length : raw < -2 ? raw + plans.length : raw;
              const isActive = offset === 0;
              const isNear = Math.abs(offset) === 1;
              const x = offset * 66;
              return (
                <motion.article
                  key={plan.id}
                  initial={false}
                  animate={{
                    x: `${x}%`,
                    y: isActive ? 0 : Math.abs(offset) === 1 ? 34 : 66,
                    scale: isActive ? 1 : isNear ? 0.82 : 0.68,
                    rotateY: offset * -13,
                    rotateZ: offset * (isActive ? 0 : 2.2),
                    opacity: isActive ? 1 : isNear ? 0.72 : 0.28,
                    filter: isActive ? 'blur(0px)' : isNear ? 'blur(.4px)' : 'blur(1.5px)',
                    zIndex: 20 - Math.abs(offset) * 5,
                  }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease }}
                  onClick={() => { if (!isActive) setActivePlan(index); }}
                  className={`absolute left-1/2 top-0 flex h-[620px] w-[min(82vw,540px)] -translate-x-1/2 flex-col overflow-hidden rounded-[30px] border shadow-[0_38px_100px_rgba(0,0,0,.5)] sm:h-[600px] ${isActive ? 'cursor-default border-white/50 shadow-[0_42px_110px_rgba(0,0,0,.55)]' : 'cursor-pointer border-white/15'}`}
                  style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 50%' }}
                >
                  <div className={`relative flex h-[220px] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br p-7 sm:p-8 ${plan.tone}`}>
                    <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(rgba(20,10,40,.5) .8px, transparent .8px)', backgroundSize: '12px 12px' }} />
                    <div aria-hidden="true" className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/10 shadow-[0_0_0_24px_rgba(177,105,255,.035),0_0_0_52px_rgba(75,111,255,.025)] transition-transform duration-700 group-hover:rotate-12" />
                    <div className="relative z-10 flex items-start justify-between">
                      <div>
                        <p className="font-mono text-[10px] tracking-[.22em]" style={{ color: plan.ink }}>MAVERIQODE / PLAN {plan.id}</p>
                        <p className="mt-4 text-5xl font-black tracking-[-.085em] sm:text-6xl" style={{ color: plan.ink }}>{plan.price}</p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[.15em]" style={{ color: plan.ink }}>{plan.cadence}</p>
                      </div>
                      <div className="flex h-[70px] w-[70px] items-center justify-center rounded-[22px] border border-white/15 bg-white/[.07] shadow-[0_14px_35px_rgba(0,0,0,.28)] sm:h-[82px] sm:w-[82px]">
                        <Icon size={36} strokeWidth={1.4} style={{ color: plan.ink }} />
                      </div>
                    </div>
                    <div className="relative z-10 flex items-end justify-between">
                      <span className="font-mono text-[9px] tracking-[.2em]" style={{ color: plan.ink }}>SERVICE COLLECTION</span>
                      <span className="font-mono text-3xl font-bold tracking-[-.08em]" style={{ color: plan.ink }}>{plan.id}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col bg-[linear-gradient(155deg,#17151f,#111018_58%,#141321)] px-7 py-6 sm:px-8 sm:py-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[23px] font-bold leading-tight tracking-[-.045em] text-[#f4f0fa] sm:text-[27px]">{plan.name}</h3>
                        <p className="mt-2 max-w-[410px] text-[11px] leading-5 text-[#aaa4b5] sm:text-xs">{plan.description}</p>
                      </div>
                      {plan.featured && <span className="shrink-0 rounded-full bg-white/[.08] border border-white/10 px-3 py-1.5 font-mono text-[8px] tracking-[.12em] text-white">COMPLETE</span>}
                    </div>
                    {plan.monthly && <p className="mt-3 inline-flex self-start rounded-full border border-[#a66bff]/25 bg-[#8d42d8]/15 px-3 py-1.5 text-[10px] font-semibold text-[#d9bcff]">{plan.monthly}</p>}
                    <div className="my-4 h-px bg-white/10" />
                    <ul className="grid grid-cols-1 gap-y-2.5 sm:grid-cols-2 sm:gap-x-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-[10px] leading-[1.45] text-[#d2ccda] sm:text-[11px]">
                          <Check size={13} className="mt-px shrink-0 text-[#b77aff]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                      <p className="max-w-[270px] text-[9px] leading-4 text-[#91899f]">{plan.note}</p>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectSolution(plan.service, `Selected plan: ${plan.name}. Price: ${plan.price} (${plan.cadence}). ${plan.monthly ? `Ongoing management: ${plan.monthly}. ` : ''}Please discuss the scope and next steps for this plan.`);
                        }}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#a56bff]/35 bg-gradient-to-r from-[#7627bd] to-[#3548b8] px-4 py-3 text-[10px] font-semibold text-white shadow-[0_8px_24px_rgba(106,48,190,.24)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(106,48,190,.36)] sm:px-5"
                      >
                        Discuss plan <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="relative z-30 -mt-1 flex items-center justify-center gap-5">
            <button type="button" onClick={() => move(-1)} aria-label="Previous plan" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[.06] text-white transition hover:border-[#d7a0ff]/60 hover:bg-[#8125c5]/25"><ArrowLeft size={17}/></button>
            <div className="flex items-center gap-2.5">
              {plans.map((plan, index) => (
                <button key={plan.id} type="button" onClick={() => setActivePlan(index)} aria-label={`Show plan ${plan.id}: ${plan.name}`} aria-current={activePlan === index ? 'true' : undefined} className={`h-2 rounded-full transition-all duration-500 ${activePlan === index ? 'w-9 bg-[#d7a0ff]' : 'w-2 bg-white/25 hover:bg-white/55'}`} />
              ))}
            </div>
            <button type="button" onClick={() => move(1)} aria-label="Next plan" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[.06] text-white transition hover:border-[#d7a0ff]/60 hover:bg-[#8125c5]/25"><ArrowRight size={17}/></button>
          </div>
          <p className="mt-4 text-center font-mono text-[8px] tracking-[.18em] text-[#82798d]">SELECT A CARD · USE ARROWS TO EXPLORE ALL FIVE PLANS</p>
        </div>

        <p className="mt-10 text-center font-mono text-[9px] leading-5 tracking-[.1em] text-[#777080]">THIRD-PARTY SUBSCRIPTIONS, API CREDITS AND EXTERNAL USAGE ARE SEPARATE WHERE APPLICABLE · FINAL SCOPE CONFIRMED BEFORE WORK BEGINS</p>
      </div>
    </section>
  );
}
