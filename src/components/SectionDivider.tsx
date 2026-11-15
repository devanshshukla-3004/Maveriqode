import { motion, useReducedMotion } from 'motion/react';

export function SectionDivider() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        aria-hidden="true"
        className="relative w-full h-px bg-[var(--mq-border)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a100ff]/55 to-transparent" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-px bg-[var(--mq-border)] overflow-hidden"
    >
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 'some' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 origin-center bg-gradient-to-r from-transparent via-[#a100ff]/55 to-transparent"
      />
    </div>
  );
}
