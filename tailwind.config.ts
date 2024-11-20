import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {

        pressStart: ['"Press Start 2P"', 'sans-serif'], 
      },
    },
  },
  plugins: [],
} satisfies Config;
