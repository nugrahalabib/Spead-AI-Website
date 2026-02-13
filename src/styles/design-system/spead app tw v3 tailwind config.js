/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: {
          DEFAULT: "var(--background)",
          muted: "var(--background-muted)",
        },
        foreground: "var(--foreground)",
        warning: "var(--warning)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          30: "var(--primary-30)",
          40: "var(--primary-40)",
          50: "var(--primary-50)",
          60: "var(--primary-60)",
          70: "var(--primary-70)",
          80: "var(--primary-80)",
          90: "var(--primary-90)",
          95: "var(--primary-95)",
          98: "var(--primary-98)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        neutral: {
          10: "var(--neutral-10)",
          20: "var(--neutral-20)",
          30: "var(--neutral-30)",
          40: "var(--neutral-40)",
          50: "var(--neutral-50)",
          60: "var(--neutral-60)",
          70: "var(--neutral-70)",
          80: "var(--neutral-80)",
          90: "var(--neutral-90)",
          98: "var(--neutral-98)",
          100: "var(--neutral-100)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        success: {
          40: "var(--success-40)",
          60: "var(--success-60)",
          80: "var(--success-80)",
        },
        danger: {
          50: "var(--danger-50)",
          60: "var(--danger-60)",
          70: "var(--danger-70)",
          80: "var(--danger-80)",
        },
        info: {
          50: "var(--info-50)",
          60: "var(--info-60)",
          70: "var(--info-70)",
        },
        checkbox: "var(--checkbox)",
      },
      transitionDuration: {
        2500: "2500ms",
        3000: "3000ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
