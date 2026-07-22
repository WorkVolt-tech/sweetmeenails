import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sweet Mee Nails brand palette
        royal: {
          DEFAULT: "#4A1D5C", // deep royal purple
          light: "#6B3480",
          dark: "#33123F",
        },
        lavender: {
          DEFAULT: "#B497D6",
          light: "#E4D9F2",
          soft: "#F3EDFA",
        },
        blossom: {
          DEFAULT: "#F2C6D8", // soft pink accent
          dark: "#E29CBB",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E2C766",
        },
        ink: "#2D1B36",
        canvas: "#FBF9FD",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(74, 29, 92, 0.25)",
        card: "0 4px 20px -6px rgba(74, 29, 92, 0.15)",
      },
      backgroundImage: {
        "brush-divider": "linear-gradient(90deg, transparent, #C9A227, transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
