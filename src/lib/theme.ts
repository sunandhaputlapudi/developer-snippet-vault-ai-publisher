import { SyntaxTheme } from '../types/snippet';

export interface ThemeMeta {
  id: SyntaxTheme;
  label: string;
  shortLabel: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const SYNTAX_THEMES: Record<SyntaxTheme, ThemeMeta> = {
  dark: {
    id: 'dark',
    label: 'Dark (VS Code)',
    shortLabel: 'Dark',
    description: 'Deep slate backdrop with vibrant pastel tokens',
    badgeBg: '#0f172a',
    badgeText: '#818cf8',
    badgeBorder: '#1e293b',
  },
  light: {
    id: 'light',
    label: 'Light (GitHub)',
    shortLabel: 'Light',
    description: 'Clean bright paper background with crisp readable contrast',
    badgeBg: '#f1f5f9',
    badgeText: '#4f46e5',
    badgeBorder: '#cbd5e1',
  },
  'high-contrast': {
    id: 'high-contrast',
    label: 'High Contrast (Accessible)',
    shortLabel: 'Hi-Contrast',
    description: 'Pure black (#000000) backdrop with electric neon tokens (WCAG AAA)',
    badgeBg: '#000000',
    badgeText: '#00ffff',
    badgeBorder: '#ffffff',
  },
  dracula: {
    id: 'dracula',
    label: 'Dracula (Neon)',
    shortLabel: 'Dracula',
    description: 'Iconic vampire palette with pinks, purples, and yellows',
    badgeBg: '#21222c',
    badgeText: '#ff79c6',
    badgeBorder: '#6272a4',
  },
};

const STORAGE_KEY = 'vault_syntax_theme';

export function getStoredSyntaxTheme(): SyntaxTheme {
  try {
    const val = localStorage.getItem(STORAGE_KEY) as SyntaxTheme;
    if (val && SYNTAX_THEMES[val]) {
      return val;
    }
  } catch (e) {
    // fallback
  }
  return 'dark';
}

export function setStoredSyntaxTheme(theme: SyntaxTheme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    // Dispatch custom event so all open CodeViewer instances sync instantly
    window.dispatchEvent(new CustomEvent('syntax-theme-changed', { detail: theme }));
  } catch (e) {
    // fallback
  }
}
