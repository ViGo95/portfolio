module.exports = {
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    mode: 'all',
    content: ['./**/**/*.html', './**/**/*.svelte'],
    options: {
      whitelistPatterns: [/svelte-/],
      defaultExtractor: content => [
        [...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(([_match, group, ..._rest]) => group),
      ],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        light: '#F9FAFB',
        dark: '#2F3640',
        secondary: '#5E687E',
        good: '#4CD137',
        medium: '#E1B12C',
        decorate: '#0097E6',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}