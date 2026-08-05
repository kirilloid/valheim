import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';
import * as LiquidData from '../../../file/LiquidData';

const LiquidDataHash = stableHashCode('LiquidData');

export function LiquidComp({ value }: ValueProps<ZDO>) {
  const bytes = value.byteArrays.get(LiquidDataHash);
  const [data, setData] = React.useState<LiquidData.Data | null>(null);
  React.useEffect(() => { bytes && LiquidData.read(bytes).then(setData); }, [bytes]);

  if (!bytes) return <><dt>total volume</dt><dd><em>uninitialized</em></dd></>;
  return <>
    <dt>total volume</dt>
    <dd>{data
      ? <>{Math.round(data.total)} m<sup>3</sup></>
      : <em>loading...</em>}</dd></>;
}
