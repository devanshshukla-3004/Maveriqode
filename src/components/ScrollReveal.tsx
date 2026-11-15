import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  yOffset = 18,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some', margin: '0px 0px -32px 0px' }}
      transition={{
        duration: 0.48,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
