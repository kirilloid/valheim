import { useCallback, useEffect, useState } from 'react';

import type { GameObject } from '../types';
import { mapValues } from '../model/utils';

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
  // to sum total resources for item levels or not
  aggregate: false,
  // spoiler levels
  spoiler: 999,
  // currently selected & loaded language
  language: undefined as string | undefined,
  // theme
  theme: 'system' as 'system' | 'light' | 'dark',
  searchInMods: false,
  searchInDisabled: false,
};

type GlobalKeys = keyof typeof globalKeysDefaultValue;

const listeners: Record<GlobalKeys, Function[]> = mapValues(globalKeysDefaultValue, () => []);

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

export function useSettingsFilter() {
  const [spoiler] = useGlobalState('spoiler');
  const [mods] = useGlobalState('searchInMods');
  const [disabled] = useGlobalState('searchInDisabled');
  return useCallback((item: GameObject) => {
    return item.tier <= spoiler
        && (mods || item.mod == null)
        && (disabled || !item.disabled);
  }, [spoiler, mods, disabled]);
}
