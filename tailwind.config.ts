import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primaryColor: {
          DEFAULT: "var(--primaryColor)",
        },
        secondaryColor: {
          DEFAULT: "var(--secondaryColor)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
