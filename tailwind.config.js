/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Required for next-themes
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // Legacy colors kept for backward compatibility with existing components
            // New components should use design tokens from globals.css @theme
            colors: {
                foreground: "var(--foreground)",
                background: "var(--background)",
                primary: {
                    DEFAULT: "var(--color-primary-50)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                accent: {
                    DEFAULT: "#06b6d4", // Legacy cyan
                    foreground: "#ffffff",
                },
                "glass-border": "rgba(255, 255, 255, 0.08)",
                "glass-bg": "rgba(255, 255, 255, 0.03)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", "system-ui", "sans-serif"],
                display: ["var(--font-display)", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
