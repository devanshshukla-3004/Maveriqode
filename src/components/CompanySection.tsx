import { EXECUTION_STEPS } from '../data/maveriqodeData';
import { ScrollReveal } from './ScrollReveal';

const COMMITMENTS = [
  { value: '< 4 hrs', label: 'Response SLA on Business Days' },
  { value: '24 hrs', label: 'Architecture & Milestone Blueprint' },
  { value: '100%', label: 'Full Source-Code Handover' },
  { value: 'Weekly', label: 'Live Staging Deployments' },
];

export function CompanySection() {
  return (
    <section
      id="company"
      className="scroll-mt-20 py-24 px-5 sm:px-8 lg:px-12 bg-[#070709]"
    >
      <div className="max-w-[1440px] mx-auto">
        <ScrollReveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs text-[#A78BFA] mb-3">01 · Company</p>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.03em] text-white text-balance mb-6">
              Senior engineering teams, zero outsourced handoffs.
            </h2>
            <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed max-w-[62ch]">
              MAVERIQODE is a digital engineering, AI systems, and security practice built for teams that cannot afford fragile prototypes or opaque timelines. You work directly with the engineers writing your architecture, shipping production code every week.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {COMMITMENTS.map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-2xl bg-[#0E0E13] border border-white/10"
              >
                <div className="font-display font-bold text-2xl sm:text-3xl text-white tabular-nums mb-1.5">
                  {item.value}
                </div>
                <div className="text-xs text-[#8E8E98] leading-snug">{item.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal
          delay={0.08}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {EXECUTION_STEPS.map((item) => (
            <div
              key={item.step}
              className="p-7 rounded-2xl bg-[#0E0E13] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="block font-mono text-xs text-[#A78BFA] mb-3">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[#8E8E98] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
