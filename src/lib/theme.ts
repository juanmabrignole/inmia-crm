// Preferencia de tema por visitante (localStorage). Si no hay preferencia, sigue al sistema.
export type Theme = 'light' | 'dark';
const KEY = 'inmia-theme';

export function currentTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Modo privado o storage bloqueado: el tema igual se aplica en la sesión actual.
  }
}

export function loadTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
  } catch {
    // Sin storage: queda el tema del sistema.
  }
}
