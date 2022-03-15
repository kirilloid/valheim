import { useEffect, useState } from 'react';

let id = 0;

export function useAutoId(prefix: string): string {
  useEffect(() => { id++; }, []);
  return useState(`${prefix}${id++}`)[0];
}
