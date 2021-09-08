import { useCallback, useState, createContext } from 'react';

function getUserLanguage(): string {
  const lang = navigator.language;
  if (lang === 'ru' || lang === 'uk') return 'ru';
  if (lang === 'de') return 'de';
  return 'en';  
}

type Dictionary<T = string> = Record<string, T>;
const langCache: Dictionary<Promise<Dictionary>> = {};

export type Translator = (key: string, ...extraArgs: (string | number)[]) => string;

export function preloadLanguage(userLang: string = getUserLanguage()): Promise<Dictionary> {
  return langCache[userLang] ?? (langCache[userLang] = fetch(`/lang/${userLang}.json`).then(r => r.json()));
}

export function useTranslation(): Translator {
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [, setLang] = useState('');
  const userLang = getUserLanguage();
  preloadLanguage(userLang).then((dict) => {
    setLang(userLang);
    setDict(dict);
  });
  return useCallback(
    (key: string, ...extraArgs: (string | number)[]) => (dict?.[key] ?? key).replace(/\{(\d+)\}/g, (_, n: string) => String(extraArgs[+n]))
  , [dict])
}

export const TranslationContext = createContext<Translator>((key: string) => key);