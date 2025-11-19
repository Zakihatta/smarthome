// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // Path ke file source code Anda
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Warna kustom sesuai request
      colors: {
        background: {
          DEFAULT: "#212121",
          light: "#2F2F2F",
        },
        primary: {
          DEFAULT: "#FBCB44",
          dark: "#E0B43D",
        },
        foreground: {
          DEFAULT: "#FFFFFF",
          subtle: "#A0A0A0",
        },
      },
    },
  },
  plugins: [],
};

export default config;