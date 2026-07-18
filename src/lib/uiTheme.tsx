'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const UI_THEME_STORAGE_KEY = 'japanese-super-words-dark-mode';

type UiThemeContextValue = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

const UiThemeContext = createContext<UiThemeContextValue>({
  darkMode: false,
  setDarkMode: () => {},
});

function applyDarkClass(enabled: boolean) {
  document.documentElement.classList.toggle('dark', enabled);
}

export function UiThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);

  useEffect(() => {
    const enabled = localStorage.getItem(UI_THEME_STORAGE_KEY) === 'true';
    setDarkModeState(enabled);
    applyDarkClass(enabled);
  }, []);

  const setDarkMode = useCallback((value: boolean) => {
    setDarkModeState(value);
    localStorage.setItem(UI_THEME_STORAGE_KEY, value ? 'true' : 'false');
    applyDarkClass(value);
  }, []);

  const value = useMemo(() => ({ darkMode, setDarkMode }), [darkMode, setDarkMode]);

  return <UiThemeContext.Provider value={value}>{children}</UiThemeContext.Provider>;
}

export function useUiTheme() {
  return useContext(UiThemeContext);
}
