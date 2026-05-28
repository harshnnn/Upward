export const motion = {
  duration: {
    fast: 120,
    normal: 180,
    slow: 240,
    slower: 320
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasis: 'cubic-bezier(0.16, 1, 0.3, 1)',
    linear: 'linear'
  },
  spring: {
    gentle: { damping: 18, stiffness: 180 },
    firm: { damping: 20, stiffness: 220 }
  }
} as const;