import type { Config } from "tailwindcss";

// CineStar Design System — "Cinematic Immersive Noir"
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-variant": "rgb(var(--color-surface-variant) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        onSurface: "rgb(var(--color-onSurface) / <alpha-value>)",
        onSurfaceVariant: "rgb(var(--color-onSurfaceVariant) / <alpha-value>)",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-lg": ["64px", { fontWeight: "900", lineHeight: "1.05" }],
        "headline-md": ["24px", { fontWeight: "600", lineHeight: "1.3" }],
        "body-lg": ["18px", { fontWeight: "400", lineHeight: "1.6" }],
        "body-md": ["16px", { fontWeight: "400", lineHeight: "1.5" }],
        "label-mono": ["12px", { fontWeight: "500", letterSpacing: "0.05em" }],
      },
      borderRadius: {
        DEFAULT: "8px", // ROUND_FOUR
      },
      backdropBlur: {
        glass: "20px",
      },
      borderColor: {
        glass: "rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;