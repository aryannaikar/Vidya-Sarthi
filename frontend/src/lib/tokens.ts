/**
 * Vidya Sarthi Design Tokens
 * Light-first, warm-white, editorial typography, restrained royal cobalt
 */

export const tokens = {
  brand: {
    name: "Vidya Sarthi",
    tagline: "Discover Opportunities. Unlock Potential.",
    shortDescription: "A student skill-to-opportunity matching platform.",
  },
  colors: {
    ground: "var(--ground)",
    surface: "var(--surface)",
    surfaceSubtle: "var(--surface-subtle)",
    surfaceElevated: "var(--surface-elevated)",
    charcoal: {
      primary: "var(--charcoal)",
      muted: "var(--charcoal-muted)",
      subtle: "var(--charcoal-subtle)",
    },
    cobalt: {
      base: "var(--cobalt)",
      dark: "var(--cobalt-dark)",
      light: "var(--cobalt-light)",
    },
    border: {
      default: "var(--border)",
      subtle: "var(--border-subtle)",
      strong: "var(--border-strong)",
    },
    status: {
      success: "var(--success)",
      successSubtle: "var(--success-subtle)",
      warning: "var(--warning)",
      warningSubtle: "var(--warning-subtle)",
      danger: "var(--danger)",
      dangerSubtle: "var(--danger-subtle)",
      info: "var(--info)",
      infoSubtle: "var(--info-subtle)",
    },
  },
  radii: {
    xs: "3px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.16, 1, 0.3, 1)",
    normal: "250ms cubic-bezier(0.16, 1, 0.3, 1)",
    slow: "350ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
  layout: {
    sidebarWidth: "260px",
    sidebarCollapsedWidth: "76px",
    headerHeight: "68px",
    maxContentWidth: "1280px",
  },
} as const;

export type DesignTokens = typeof tokens;
