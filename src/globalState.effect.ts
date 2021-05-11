import { useEffect, useState } from "react";

type GlobalKeys = 'aggregate';

function read<T>(name: string, defaultValue: T): T {
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
} as const;

const listeners: Record<GlobalKeys, Function[]> = {
  aggregate: [],
};

type GK = typeof globalKeysDefaultValue;

export function useGlobalState<K extends GlobalKeys, T = GK[K]>(name: GlobalKeys): [T, (val: T) => void] {
  const defaultValue = globalKeysDefaultValue[name] as any as T;
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