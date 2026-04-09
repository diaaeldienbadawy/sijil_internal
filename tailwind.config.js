/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/radix-ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        "primary-dark": "var(--color-primary-dark)",
        gold: "var(--color-gold)",
        "gold-light": "var(--color-gold-light)",
        muted:"var(--color-text-muted)",
        cream: "var(--color-cream)",
        paper: "var(--color-paper)",
        error: "var(--color-error)",
        alert: "var(--color-alert)",
        success: "var(--color-success)",
        ring:"var(--color-border)"
      },
    },
    fontFamily:{
      tajawal:"var(--tajawal-font-family)",
      amiri: "var(--amiri-font-family)"
    }
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
