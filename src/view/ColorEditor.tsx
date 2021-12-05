import React from 'react';

import type { Vector3 } from '../model/utils';
import type { ValueProps } from './parts/types';

export function Color({ value, onChange }: ValueProps<Vector3>) {
  const { x, y, z } = value;
  const color = '#' + [x, y, z].map(
    r => Math.round(r * 255)
      .toString(16)
      .padStart(2, '0')
  ).join('');
  return <input type="color" value={color} onChange={e => {
    const rgb = e.target.value.match(/[a-f0-9]{2}/g);
    if (!rgb) return;
    const [x, y, z] = rgb.map(v => parseInt(v, 16) / 255);
    onChange({ x: x!, y: y!, z: z! });
  }} />;
}
