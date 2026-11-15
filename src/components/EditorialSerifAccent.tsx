import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface EditorialSerifAccentProps {
  children: ReactNode;
  className?: string;
  targetTracking?: string;
  initialTracking?: string;
  trigger?: 'mount' | 'inView';
  delay?: number;
}

export function EditorialSerifAccent({
  children,
  className = '',
  targetTracking = '-0.015em',
  initialTracking = '0.02em',
  trigger = 'inView',
  delay = 0.08,
}: EditorialSerifAccentProps) {
  const shouldReduceMotion = useReducedMotion();
  const classes = `mq-serif-accent font-medium text-[var(--mq-accent-soft)] ${className}`.trim();

  if (shouldReduceMotion) {
    return (
      <span className={classes} style={{ letterSpacing: targetTracking }}>
        {children}
      </span>
    );
  }

  const targetState = {
    opacity: 1,
    letterSpacing: targetTracking,
  };

  const initialState = {
    opacity: 0.72,
    letterSpacing: initialTracking,
  };

  const transition = {
    duration: 0.65,
    delay,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  if (trigger === 'mount') {
    return (
      <motion.span
        initial={initialState}
        animate={targetState}
        transition={transition}
        className={classes}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={initialState}
      whileInView={targetState}
      viewport={{ once: true, amount: 'some', margin: '0px 0px -24px 0px' }}
      transition={transition}
      className={classes}
    >
      {children}
    </motion.span>
  );
}
