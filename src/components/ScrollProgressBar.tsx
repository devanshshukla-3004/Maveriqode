import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none bg-transparent"
    >
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-[#a100ff] to-[#2a00c8]"
        style={{
          scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress,
        }}
      />
    </div>
  );
}
