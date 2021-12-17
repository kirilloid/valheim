import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import * as LiquidData from '../../../file/LiquidData';

const LiquidDataHash = stableHashCode('LiquidData');

export function LiquidComp({ value }: ValueProps<ZDO>) {
  const bytes = value.byteArrays.get(LiquidDataHash);
  if (!bytes) return <><dt>total volume</dt><dd><em>unknown</em></dd></>;
  const data = LiquidData.read(bytes);
  return <><dt>total volume</dt><dd>{Math.round(data.total)} m<sup>3</sup></dd></>;
}
