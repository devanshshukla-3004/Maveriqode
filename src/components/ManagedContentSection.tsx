import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { supabase } from '../lib/supabase';

type ManagedItem = { title?: string; description?: string; eyebrow?: string };
type ManagedContent = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  items?: ManagedItem[];
};

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function ManagedContentSection({ slug }: { slug: 'company' | 'capabilities' | 'solutions' | 'work' }) {
  const [record, setRecord] = useState<{ title: string; content: ManagedContent } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    void supabase
      .from('website_content')
      .select('title, content')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()
      .then(({ data, error }: { data: any; error: any }) => {
        if (!active) return;
        if (!error && data && data.content && typeof data.content === 'object' && !Array.isArray(data.content)) {
          const content = data.content as ManagedContent;
          const hasContent = Boolean(
            asText(content.heading) || asText(content.intro) ||
            (Array.isArray(content.items) && content.items.some((item) => asText(item?.title) || asText(item?.description)))
          );
          if (hasContent) setRecord({ title: data.title, content });
        }
        setLoaded(true);
      });
    return () => { active = false; };
  }, [slug]);

  if (!loaded || !record) return null;
  const items = Array.isArray(record.content.items)
    ? record.content.items.filter((item) => item && (asText(item.title) || asText(item.description))).slice(0, 12)
    : [];

  return (
    <section className="relative py-16 px-5 sm:px-8 lg:px-12 bg-[var(--mq-bg)]">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1440px] mx-auto rounded-3xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-7 sm:p-10 lg:p-12"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--mq-accent-soft)] mb-3">
            {asText(record.content.eyebrow) || 'MAVERIQODE / FIELD NOTES'}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--mq-text)] text-balance">
            {asText(record.content.heading) || record.title}
          </h2>
          {asText(record.content.intro) && (
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--mq-text-secondary)]">
              {asText(record.content.intro)}
            </p>
          )}
        </div>
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-9">
            {items.map((item, index) => (
              <article key={index} className="rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-bg)] p-6">
                {asText(item.eyebrow) && <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--mq-accent-soft)] mb-3">{asText(item.eyebrow)}</p>}
                {asText(item.title) && <h3 className="text-lg font-bold text-[var(--mq-text)]">{asText(item.title)}</h3>}
                {asText(item.description) && <p className="mt-2 text-sm leading-relaxed text-[var(--mq-muted)]">{asText(item.description)}</p>}
                <ArrowUpRight aria-hidden="true" className="w-4 h-4 mt-5 text-[var(--mq-accent-soft)]" />
              </article>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
