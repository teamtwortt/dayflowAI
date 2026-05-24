import type { Config } from "tailwindcss";

// DayFlow AI palette
//   Soft Pearl   #F7F7F5   — light text on dark / bright surfaces (modals, popovers)
//   Graphite     #202124   — text on light
//   Platinum     #B9BDC7   — cool neutral / borders
//   Muted Sage   #8F9B8A   — light-mode body background + brand accent
//   Ice Blue     #C9DDF2   — secondary accent / focus / AI badges
//
// Class names (cream / ink / flame) are preserved so existing components keep
// working — only the rendered colors change.
//
// Light mode:  body = Muted Sage,  text = Graphite, surfaces lift via darker sage
// Dark  mode:  body = near-black,  text = Soft Pearl, surfaces sit on graphite

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light surfaces — sage scale (cream-100 = body, lighter above, deeper below)
        cream: {
          50: "#f7f7f5",  // Soft Pearl — modal / popover surface
          100: "#8f9b8a", // Muted Sage — body bg in light mode
          200: "#7c8878", // darker sage — elevated card surface (depth on sage bg)
          300: "#6c7868", // deeper — borders / heavy surface
          400: "#b9bdc7", // Platinum — cool secondary border / divider
          500: "#5a6657",
          600: "#475244",
        },
        // Dark surfaces & text — near-black + graphite
        ink: {
          50: "#f7f7f5",  // Soft Pearl — text on dark
          100: "#d6d8de",
          200: "#a8acb4", // muted text in dark mode
          300: "#4a4d54", // muted text in light mode (on sage)
          400: "#34363a",
          500: "#202124", // Graphite — primary text on light
          600: "#141517", // elevated surface in dark mode
          700: "#050507", // near-black body bg in dark mode
          800: "#000000",
        },
        // Brand accent — darker sage, "pops" on both sage (light) and black (dark)
        flame: {
          50: "#f1f4f0",
          100: "#dfe5dd",
          200: "#c5d0c0",
          300: "#a8b6a2",
          400: "#97a591",
          500: "#76836f", // primary CTA (darker than body sage)
          600: "#5e6957",
          700: "#485040",
          800: "#353c2e",
        },
        // Secondary accent — Ice Blue
        ice: {
          50: "#f4f9fd",
          100: "#e6f0fa",
          200: "#c9ddf2", // Ice Blue
          300: "#a8c7e6",
          400: "#85add6",
          500: "#5f8fc1",
          600: "#4673a3",
        },
      },
      fontFamily: {
        sans: [
          '"Cormorant Garamond"',
          "Garamond",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "serif",
        ],
        display: [
          '"Cormorant Garamond"',
          "Garamond",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "serif",
        ],
        body: [
          '"Cormorant Garamond"',
          "Garamond",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "serif",
        ],
      },
      borderRadius: {
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(5, 5, 7, 0.25)",
        glow: "0 4px 12px rgba(118, 131, 111, 0.45)",
        "glow-lg": "0 8px 32px rgba(118, 131, 111, 0.4)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
