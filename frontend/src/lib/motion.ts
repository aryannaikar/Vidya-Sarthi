import { Variants, Transition } from "framer-motion";

/**
 * Standard cubic-bezier spring-like easing for premium interaction
 */
export const springEase: Transition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

export const gentleEase: Transition = {
  duration: 0.22,
  ease: [0.2, 0, 0, 1],
};

/**
 * Page & container transitions
 */
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: 0.15,
    },
  },
};

/**
 * Stagger children container
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.04,
    },
  },
};

/**
 * Item reveal variant for list/grid items
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Subtle card hover interaction (no excessive lift or glow)
 */
export const cardHoverVariants: Variants = {
  rest: {
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Modal & dialog animations
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: { duration: 0.15 },
  },
};

/**
 * Drawer animation
 */
export const drawerVariants: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: "-100%",
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};
