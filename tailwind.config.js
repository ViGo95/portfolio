const production = !process.env.ROLLUP_WATCH
module.exports = {
  purge: {
    enabled: production,
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
        decorate: '#0097E6',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}