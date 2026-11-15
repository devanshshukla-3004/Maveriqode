import { motion, useReducedMotion } from 'motion/react';

export function SectionDivider() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-px bg-white/[0.07] overflow-hidden"
    >
      {/* Center-out hairline gradient reveal on scroll */}
      <motion.div
        initial={shouldReduceMotion ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 origin-center bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent"
      />

      {/* Subtle ambient light sweep along the hairline */}
      {!shouldReduceMotion && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '400%' }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: 'linear',
          }}
          className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-[#60A5FA]/65 to-transparent"
        />
      )}
    </div>
  );
}
