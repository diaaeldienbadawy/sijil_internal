/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/auth/login/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        "primary-dark": "var(--color-primary-dark)",
        gold: "var(--color-gold)",
        "gold-light": "var(--color-gold-light)",
        cream: "var(--color-cream)",
        paper: "var(--color-paper)",
        error: "var(--color-error)",
        alert: "var(--color-alert)",
        success: "var(--color-success)"
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const colors = theme("colors");
      const newUtilities = {};

      // لكل لون نولد utilities hover و active تلقائي
      Object.keys(colors).forEach((name) => {
        newUtilities[`.bg-${name}-hover:hover`] = {
          backgroundColor: colors[name],
        };
        newUtilities[`.bg-${name}-active:active`] = {
          backgroundColor: colors[name],
        };
        newUtilities[`.text-${name}-hover:hover`] = {
          color: colors[name],
        };
        newUtilities[`.text-${name}-active:active`] = {
          color: colors[name],
        };
      });

      addUtilities(newUtilities, { variants: ["responsive", "hover", "active"] });
    },],
};
