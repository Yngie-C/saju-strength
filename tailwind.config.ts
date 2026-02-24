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

        // TDS color tokens (토스 디자인 시스템)
        tds: {
          blue: {
            50: '#e8f3ff', 100: '#c9e2ff', 200: '#90c2ff',
            300: '#64a8ff', 400: '#4593fc', 500: '#3182f6',
            600: '#2272eb', 700: '#1b64da', 800: '#1957c2', 900: '#194aa6',
          },
          grey: {
            50: '#f9fafb', 100: '#f2f4f6', 200: '#e5e8eb',
            300: '#d1d6db', 400: '#b0b8c1', 500: '#8b95a1',
            600: '#6b7684', 700: '#4e5968', 800: '#333d4b', 900: '#191f28',
          },
          red: { 500: '#f04452' },
          green: { 500: '#03b26c' },
          orange: { 500: '#fe9800' },
        },

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
      fontSize: {
        // TDS Title scale
        't1': ['30px', { lineHeight: '1.33', fontWeight: '700' }],
        't2': ['26px', { lineHeight: '1.35', fontWeight: '700' }],
        't3': ['22px', { lineHeight: '1.41', fontWeight: '700' }],
        't4': ['20px', { lineHeight: '1.45', fontWeight: '700' }],
        't5': ['17px', { lineHeight: '1.5', fontWeight: '600' }],
        't6': ['15px', { lineHeight: '1.5', fontWeight: '600' }],
        't7': ['13px', { lineHeight: '1.5', fontWeight: '600' }],
        // TDS Subtitle scale
        'st8':  ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'st9':  ['15px', { lineHeight: '1.5', fontWeight: '400' }],
        'st10': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'st11': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'st12': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'st13': ['11px', { lineHeight: '1.5', fontWeight: '400' }],
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
