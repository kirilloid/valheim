import React from 'react';

import '../css/Color.css';
import { useAutoId } from '../effects/auto-id.effect';

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

/*
   x | /500 | **2 | exp | -1 |/(e-1)
   0 |    0 |   0 |  1  |  0 |  0
 500 |    1 |   1 |  2.7| 1.7|  1
1000 |    2 |   4 | 54.6|53.6| 31
*/
function hdFromLinear(linear: number): number {
  return linear >= 500
    ? (Math.exp((linear / 500) ** 2) - 1) / (Math.E - 1)
    : linear / 500;
}

/*
 x |*(e-1)|  +1  | log | sqrt | *500
 0 |  0   |  1.0 |  0  |   0  |    0
 1 |  1.7 |  2.7 |  1  |   1  |  500
31 | 53.6 | 54.6 |  4  |   2  | 1000
*/
function linearFromHd(hd: number): number {
  return hd >= 1
    ? Math.sqrt(Math.log(hd * (Math.E - 1) + 1)) * 500
    : hd * 500;
}

export const hdColorDatalist = <datalist id="color-max">
  <option value="0" />
  <option value="500" />
</datalist>;

export function HDColor({ value, onChange }: ValueProps<Vector3>) {
  const { x, y, z } = value;

  const bgColor = [x, y, z]
    .map(c => Math.round(Math.min(c, 1) * 255))
    .map(c => c.toString(16).padStart(2, '0'))
    .join('');

  const glowStrength = [x, y, z].map(c => Math.max(c - 1, 0));
  const glowMax = Math.max(...glowStrength);
  const glowColor = glowStrength
    .map(c => Math.round(c / glowMax * 255))
    .map(c => c.toString(16).padStart(2, '0'))
    .join('');

  const autoId = useAutoId('HDColor');

  return <div className="HDColor">
    <div className="HDColor__box">
      <div className="HDColor__color" style={{
        backgroundColor: `#${bgColor}`,
        boxShadow: glowMax > 0 ? `0 0 ${glowMax}px ${glowMax}px #${glowColor}` : '',
      }} />
    </div>
    <div className="HDColor__tracks">
      <label htmlFor={autoId + '__r'}>red</label>
      <input id={autoId + '__r'} type="range" className="HDColor__track"
        value={linearFromHd(x)} min="0" max="1000" list="color-max"
        onChange={e => onChange({ x: hdFromLinear(Number(e.target.value)), y, z })} />
      <label htmlFor={autoId + '__g'}>green</label>
      <input id={autoId + '__g'} type="range" className="HDColor__track"
        value={linearFromHd(y)} min="0" max="1000" list="color-max"
        onChange={e => onChange({ x, y: hdFromLinear(Number(e.target.value)), z })} />
      <label htmlFor={autoId + '__b'}>blue</label>
      <input id={autoId + '__b'} type="range" className="HDColor__track"
        value={linearFromHd(z)} min="0" max="1000" list="color-max"
        onChange={e => onChange({ x, y, z: hdFromLinear(Number(e.target.value)) })} />
    </div>
  </div>;
}
