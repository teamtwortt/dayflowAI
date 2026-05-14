import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Warm cream base
        cream: {
          50: "#faf7f0",
          100: "#f2ede4",
          200: "#ece4d4",
          300: "#e0d4c0",
          400: "#d4c4a8",
          500: "#c4a882",
          600: "#b09a82",
        },
        // Earthy dark
        ink: {
          50: "#f0e6d6",
          100: "#c8a878",
          200: "#9e8a77",
          300: "#7a6652",
          400: "#5a4a32",
          500: "#3a2a18",
          600: "#2a1e10",
          700: "#1a1208",
          800: "#0f0a04",
        },
        // Signature orange
        flame: {
          50: "#fdf3ec",
          100: "#fadcc6",
          200: "#f4b88a",
          300: "#eb9457",
          400: "#d68446",
          500: "#c87941",
          600: "#b06a30",
          700: "#8c5424",
          800: "#5f3a1a",
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
        soft: "0 4px 24px -8px rgba(58, 42, 24, 0.15)",
        glow: "0 4px 12px rgba(200, 121, 65, 0.4)",
        "glow-lg": "0 8px 32px rgba(200, 121, 65, 0.35)",
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
