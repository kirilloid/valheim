import { useEffect, useState } from 'react';

type GlobalKeys =
  | 'aggregate' // to sum total resources for item levels or not
  | 'spoiler' // spoiler levels
  | 'language' // currently selected & loaded language
;

export function read<T>(name: string, defaultValue: T): T {
  try {
    const val = localStorage.getItem(name);
    if (val == null) return defaultValue;
    return JSON.parse(val);
  } catch {
    return defaultValue;
  }
}

function write<T>(name: string, value: T): void {
  try {
    localStorage.setItem(name, JSON.stringify(value));
  } catch {}
}

const globalKeysDefaultValue = {
  aggregate: false as boolean,
  spoiler: 0 as number,
  language: undefined as string | undefined,
} as const;

const listeners: Record<GlobalKeys, Function[]> = {
  aggregate: [],
  spoiler: [],
  language: [],
};

type GK = typeof globalKeysDefaultValue;

export function useGlobalState<K extends GlobalKeys, T = GK[K]>(name: K, initialValue?: T): [T, (val: T) => void] {
  const defaultValue = initialValue ?? globalKeysDefaultValue[name] as any as T;
  const value = read<T>(name, defaultValue);
  const [, setModel] = useState(value);
  const setValue = (val: T) => {
    write<T>(name, val);
    listeners[name].forEach(cb => cb(val))
  }
  useEffect(() => {
    listeners[name].push(setModel);
    return () => {
      listeners[name] = listeners[name].filter(cb => cb !== setModel);
    };
  }, [name, setModel]);
  return [value, setValue];
}