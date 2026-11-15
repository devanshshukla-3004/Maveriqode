import { ArrowRight, Check } from 'lucide-react';
import { SOLUTIONS, ServiceOption } from '../data/maveriqodeData';
import { ScrollReveal } from './ScrollReveal';

interface SolutionsSectionProps {
  onSelectSolution: (service: ServiceOption, contextNote: string) => void;
}

export function SolutionsSection({ onSelectSolution }: SolutionsSectionProps) {
  return (
    <section
      id="solutions"
      className="scroll-mt-20 py-24 px-5 sm:px-8 lg:px-12 bg-[#070709]"
    >
      <div className="max-w-[1440px] mx-auto">
        <ScrollReveal className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-xs text-[#60A5FA] mb-3">03 · Solutions</p>
            <h2 className="font-display font-extrabold text-[clamp(2rem,4.2vw,3.6rem)] leading-none tracking-[-0.03em] text-white">
              Built For Your Stage
            </h2>
          </div>
          <span className="font-mono text-xs text-[#8E8E98]">
            Tailored Delivery Tracks
          </span>
        </ScrollReveal>

        {/* Asymmetric Bento Grid: Featured 2-column anchor + 2 focused tracks */}
        <ScrollReveal delay={0.08} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SOLUTIONS.map((sol) => (
            <article
              key={sol.id}
              className={`rounded-2xl bg-[#0E0E13] border border-white/10 p-7 sm:p-8 flex flex-col justify-between transition-colors duration-200 hover:border-[#8B5CF6]/55 ${
                sol.featured ? 'lg:col-span-2' : 'lg:col-span-1'
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 font-mono text-xs">
                  <span className="text-[#A78BFA]">{sol.kicker}</span>
                  <span className="text-[#8E8E98]">{sol.deliverableTimeframe}</span>
                </div>

                <h3 className="font-display font-bold text-2xl sm:text-[1.75rem] leading-tight text-white mb-3 text-balance">
                  {sol.title}
                </h3>

                <p className="text-sm sm:text-[15px] text-[#A1A1AA] leading-relaxed mb-6 max-w-[65ch]">
                  {sol.summary}
                </p>

                <ul className="space-y-3 mb-8">
                  {sol.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-2.5 text-sm text-[#D4D4D8] leading-snug"
                    >
                      <Check
                        className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 border-t border-white/10 flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-[#8E8E98]">{sol.serviceOption}</span>
                <button
                  type="button"
                  onClick={() =>
                    onSelectSolution(sol.serviceOption, `${sol.kicker}: ${sol.title}`)
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-semibold text-white hover:bg-gradient-to-r hover:from-[#7C3AED] hover:to-[#2563EB] hover:border-transparent transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
                >
                  <span>Select Solution Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
