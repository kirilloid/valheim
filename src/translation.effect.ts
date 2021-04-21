import { useCallback, useState } from 'react';

function getUserLanguage(): string {
  const lang = navigator.language;
  if (lang === 'ru' || lang === 'uk') {
    return 'ru';
  }
  return 'en';  
}

type Dictionary<T = string> = Record<string, T>;
const langCache: Dictionary<Promise<Dictionary>> = {};

export type Translator = (key: string) => string;

export function useTranslation(): Translator {
  const userLang = getUserLanguage();
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [lang, setLang] = useState('');
  if (!(userLang in langCache)) {
    langCache[userLang] = fetch(`lang/${userLang}.json`).then(r => r.json());
  }
  langCache[userLang].then((dict) => {
    setLang(userLang);
    setDict(dict);
  });
  return useCallback(dict === null
    ? (key: string) => key
    : (key: string) => dict[key]
  , [dict])
}