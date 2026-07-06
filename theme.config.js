/** @type {const} */
const themeColors = {
  primary: { light: '#0E7490', dark: '#0E7490' }, // Deep retro cyan - passes AA contrast with white text
  background: { light: '#F9FAFB', dark: '#1A1A2E' }, // Dark gray for PS1 feel
  surface: { light: '#FFFFFF', dark: '#16213E' },
  foreground: { light: '#111827', dark: '#F1F5F9' },
  muted: { light: '#6B7280', dark: '#94A3B8' },
  border: { light: '#E5E7EB', dark: '#22D3EE' }, // Cyan borders (decorative only, not used for text)
  success: { light: '#15803D', dark: '#15803D' }, // Deep green - readable with white text
  warning: { light: '#B45309', dark: '#B45309' }, // Deep amber - readable with white text
  error: { light: '#B91C1C', dark: '#B91C1C' }, // Deep red - readable with white text
  accent: { light: '#BE185D', dark: '#BE185D' }, // Deep magenta - readable with white text
};

module.exports = { themeColors };
