import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        wood:  { DEFAULT: "#22c55e", light: "#bbf7d0", dark: "#15803d" },
        fire:  { DEFAULT: "#ef4444", light: "#fecaca", dark: "#b91c1c" },
        earth: { DEFAULT: "#eab308", light: "#fef08a", dark: "#a16207" },
        metal: { DEFAULT: "#a1a1aa", light: "#e4e4e7", dark: "#52525b" },
        water: { DEFAULT: "#3b82f6", light: "#bfdbfe", dark: "#1d4ed8" },

        // CSS variable-based semantic tokens (used in globals.css)
        background:    "hsl(var(--background))",
        foreground:    "hsl(var(--foreground))",
        card:          { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover:       { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary:       { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:     { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted:         { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent:        { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive:   { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border:        "hsl(var(--border))",
        input:         "hsl(var(--input))",
        ring:          "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
