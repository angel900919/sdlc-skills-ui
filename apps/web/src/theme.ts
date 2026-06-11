import { createTheme } from '@mui/material/styles';

/**
 * "Flight Deck" — avionics-inspired instrument panel.
 * Deep blue-black panels, hairline borders, phosphor status accents.
 */
export const palette = {
  bg: '#0A0E14',
  surface: '#0F141C',
  raised: '#141B26',
  hairline: '#1E2733',
  hairlineBright: '#2A3647',
  text: '#D8E0EA',
  muted: '#7E8B9C',
  faint: '#4D5A6B',
  green: '#2EE6A8',
  amber: '#FFB454',
  blue: '#59A7FF',
  red: '#FF5C5C',
  violet: '#B58CFF',
};

export const statusColor: Record<string, string> = {
  done: palette.green,
  'in-progress': palette.amber,
  pending: palette.faint,
  skipped: '#39465A',
  blocked: palette.red,
  running: palette.green,
  starting: palette.amber,
  exited: palette.faint,
  interrupted: palette.red,
  Planned: palette.blue,
  Building: palette.amber,
  'QA-Approved': palette.violet,
  Shipped: palette.green,
  Blocked: palette.red,
  Cut: palette.faint,
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: palette.bg, paper: palette.surface },
    primary: { main: palette.green },
    secondary: { main: palette.amber },
    info: { main: palette.blue },
    error: { main: palette.red },
    divider: palette.hairline,
    text: { primary: palette.text, secondary: palette.muted },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", sans-serif',
    fontSize: 13,
    h1: { fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em' },
    h2: { fontSize: 20, fontWeight: 600 },
    h3: { fontSize: 16, fontWeight: 600 },
    overline: { fontFamily: '"IBM Plex Mono", monospace', letterSpacing: '0.14em', fontSize: 10.5 },
    body2: { fontSize: 12.5 },
    caption: { fontSize: 11.5, color: palette.muted },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(89,167,255,0.06), transparent), radial-gradient(ellipse 60% 40% at 90% 110%, rgba(46,230,168,0.04), transparent)',
          backgroundAttachment: 'fixed',
          scrollbarColor: `${palette.hairlineBright} ${palette.bg}`,
        },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': { background: palette.hairlineBright, borderRadius: 5 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        code: { fontFamily: '"IBM Plex Mono", monospace' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${palette.hairline}`,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, size: 'small' },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, height: 22, borderRadius: 4 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { background: palette.raised, border: `1px solid ${palette.hairline}`, fontSize: 12 },
      },
    },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', minHeight: 40 } } },
    MuiTabs: { styleOverrides: { root: { minHeight: 40 } } },
  },
});

/** Reusable uppercase micro-label style. */
export const microLabel = {
  fontFamily: '"IBM Plex Mono", monospace',
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: palette.muted,
};
