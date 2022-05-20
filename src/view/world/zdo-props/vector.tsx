import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';

export const vectorComp = (key: string) => {
  const hash = stableHashCode(key);
  return ({ value: zdo, onChange }: ValueProps<ZDO>) => {
    const vector = zdo.vec3.get(hash);
    return <React.Fragment key={key}>
      <dt>{key}</dt>
      <dd>
        {vector != null && <>
          <label>x: <input type="number" inputMode="numeric" style={{ width: '5em' }} value={vector.x}
            onChange={e => {
              vector.x = +e.target.value;
              zdo.vec3.set(hash, vector);
              onChange(zdo);
            }} /></label>
          <label>y: <input type="number" inputMode="numeric" style={{ width: '5em' }} value={vector.y}
            onChange={e => {
              vector.y = +e.target.value;
              zdo.vec3.set(hash, vector);
              onChange(zdo);
            }} /></label>
          <label>z: <input type="number" inputMode="numeric" style={{ width: '5em' }} value={vector.z}
            onChange={e => {
              vector.z = +e.target.value;
              zdo.vec3.set(hash, vector);
              onChange(zdo);
            }} /></label>
        </>}
      </dd>
    </React.Fragment>;
  };
};
