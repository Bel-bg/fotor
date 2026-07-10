import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FFF9FA",
        accent: {
          DEFAULT: "#FD1843",
          hover: "#E01038",
          soft: "#FFE3EA",
        },
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#1A1417",
          muted: "#8A7F84",
        },
        border: "#F2E1E5",
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      boxShadow: {
        "accent/20": "0 0 8px rgba(253, 24, 67, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;