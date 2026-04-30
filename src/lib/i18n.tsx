"use client";

import { createContext, useContext, useEffect, useState } from "react";
import t, { Lang, LANGUAGES, Translations } from "./translations";

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  T: Translations;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  T: t.en,
  dir: "ltr",
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("artemis_lang") as Lang | null;
    if (stored && t[stored]) setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("artemis_lang", l);
    const dir = LANGUAGES.find((x) => x.code === l)?.dir ?? "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", l);
  }

  useEffect(() => {
    const dir = LANGUAGES.find((x) => x.code === lang)?.dir ?? "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const dir = LANGUAGES.find((x) => x.code === lang)?.dir ?? "ltr";

  return (
    <I18nContext.Provider value={{ lang, setLang, T: t[lang], dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
