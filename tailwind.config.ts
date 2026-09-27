import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#102018",
        sand: "#f5f2e8",
        mist: "#e9f1eb",
        whatsapp: "#25D366",
        pine: "#123524",
        moss: "#5f8b6d",
        coral: "#f27b6a"
      },
      boxShadow: {
        soft: "0 20px 70px rgba(16, 32, 24, 0.12)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at center, rgba(16, 32, 24, 0.07) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
