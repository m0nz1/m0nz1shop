import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          yellow: "#FFD700",
          "yellow-dark": "#E6C200",
          purple: "#8B5CF6",
          "purple-dark": "#6D28D9",
          black: "#111111",
          "dark-bg": "#0a0a0a",
          "dark-card": "#1a1a1a",
          "light-bg": "#FAFAFA",
          "light-card": "#FFFFFF",
          border: "#000000",
          "border-dark": "#333333",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #000000",
        "brutal-lg": "6px 6px 0px 0px #000000",
        "brutal-dark": "4px 4px 0px 0px #333333",
        "brutal-hover": "6px 6px 0px 0px #000000",
        "brutal-active": "2px 2px 0px 0px #000000",
      },
      borderRadius: {
        brutal: "6px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;