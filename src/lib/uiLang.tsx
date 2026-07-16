'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const UI_LANG_STORAGE_KEY = 'japanese-super-words-ja-only';

type UiLangContextValue = {
  /** 超日本語モード: メニュー等の二重表示を日本語のみにする */
  jaOnly: boolean;
  setJaOnly: (value: boolean) => void;
};

const UiLangContext = createContext<UiLangContextValue>({
  jaOnly: false,
  setJaOnly: () => {},
});

export function UiLangProvider({ children }: { children: React.ReactNode }) {
  const [jaOnly, setJaOnlyState] = useState(false);

  useEffect(() => {
    setJaOnlyState(localStorage.getItem(UI_LANG_STORAGE_KEY) === 'true');
  }, []);

  const setJaOnly = useCallback((value: boolean) => {
    setJaOnlyState(value);
    localStorage.setItem(UI_LANG_STORAGE_KEY, value ? 'true' : 'false');
  }, []);

  const value = useMemo(() => ({ jaOnly, setJaOnly }), [jaOnly, setJaOnly]);

  return (
    <UiLangContext.Provider value={value}>{children}</UiLangContext.Provider>
  );
}

export function useUiLang() {
  return useContext(UiLangContext);
}

/** インライン「英語 / 日本語」用。超日本語モードでは日本語のみ。 */
export function BiLine({
  en,
  ja,
  sep = ' / ',
}: {
  en: string;
  ja: string;
  sep?: string;
}) {
  const { jaOnly } = useUiLang();
  return <>{jaOnly ? ja : `${en}${sep}${ja}`}</>;
}
