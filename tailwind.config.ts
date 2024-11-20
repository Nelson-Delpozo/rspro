import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bungee: ['"Bungee Spice"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
