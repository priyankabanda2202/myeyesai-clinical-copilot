/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#050810",
        panel: "#0c1422",
        "panel-hover": "#121d30",
        border: "#1a2d4a",
        accent: "#3b82f6",
        "accent-glow": "#60a5fa",
        live: "#10b981",
        "live-glow": "#34d399",
        critical: "#ef4444",
        urgent: "#f59e0b",
        routine: "#22c55e",
        gold: "#d4a853",
      },
      boxShadow: {
        glow: "0 0 40px rgba(59, 130, 246, 0.15)",
        "glow-live": "0 0 30px rgba(16, 185, 129, 0.2)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        shimmer: "shimmer 2s infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(16, 185, 129, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(16, 185, 129, 0)" },
        },
      },
    },
  },
  plugins: [],
};
