import { useCallback, useState, useContext, createContext, useEffect } from 'react';
import { useGlobalState } from './globalState.effect';

export const languages = {
  en: 'English',
  de: 'Deutsch',
  ru: 'Русский',
} as const;

export function getDefaultUserLanguage(): string {
  const userLanguages = navigator.languages ?? [navigator.language];
  return userLanguages.find(l => l in languages) ?? 'en';
}

type Dictionary<T = string> = Record<string, T>;
const langCache: Dictionary<Promise<Dictionary>> = {};

export type Translator = (key: string, ...extraArgs: (string | number)[]) => string;
export type RuneTranslator = (object: { tier: number, type: string, id: string }, ...extraArgs: (string | number)[]) => string;

export function preloadLanguage(userLang: string): Promise<Dictionary> {
  return langCache[userLang]
     ?? (langCache[userLang] = fetch(`/lang/${userLang}.json`).then(r => r.json()));
}

export function useLanguage() {
  const [lang, setLang] = useGlobalState('language', getDefaultUserLanguage());
  const [dict, setDict] = useState<Dictionary | null>(null);
  useEffect(() => {
    preloadLanguage(lang).then(dict => {
      window.document.documentElement.lang = lang;
      setDict(dict);
    });
  }, [lang]);
  return {
    lang,
    setLang,
    dict,
  };
}

export function useTranslation(): Translator {
  const { dict } = useLanguage();
  return useCallback(
    (key: string, ...extraArgs: (string | number)[]) => (dict?.[key] ?? key).replace(/\{(\d+)\}/g, (_, n: string) => String(extraArgs[+n]))
  , [dict])
}

export const TranslationContext = createContext<Translator>((key: string) => key);

const RUNES = ' ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛇᛈᛉᛊᛋᛌᛎᛏᛐᛑᛒᛓᛔᛕᛖᛗᛘᛙᛚᛛᛜᛝᛞᛟ';
const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const base64Map: Record<string, string> = {};
for (let i = 0; i < 64; i++) {
  base64Map[BASE64[i]!] = RUNES[i]!;
}

export function runeText(str: string): string {
  return [].map.call(btoa(str).replace(/[=]+$/g, ''), c => base64Map[c] ?? '').join('');
}

export function useRuneTranslate(): RuneTranslator {
  const translate = useContext(TranslationContext);
  const [spoiler] = useGlobalState('spoiler');
  return useCallback(({ tier, type, id } : { tier: number, type: string, id: string }) => {
    return tier > spoiler
      ? runeText(id)
      : translate(type === 'effect' ? `ui.effect.${id}` : id);
  }, [translate, spoiler]);
}
