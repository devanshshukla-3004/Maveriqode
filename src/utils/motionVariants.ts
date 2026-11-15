export const MQ_EASE = [0.16, 1, 0.3, 1] as const;

export const SECTION_VIEWPORT = {
  once: true,
  amount: 'some' as const,
  margin: '0px 0px -32px 0px',
};

export const STAGGER_CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.04,
    },
  },
};

export const TEXT_REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: MQ_EASE,
    },
  },
};

export const CARD_STAGGER_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: MQ_EASE,
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

export const INNER_TEXT_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: MQ_EASE,
    },
  },
};
