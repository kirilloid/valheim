import React, { useContext } from 'react';
import type * as T from '../../types';

import { TranslationContext } from '../../effects';
import { showNumber } from '../helpers';
import { days } from '../../model/utils';

export function ResourceRoot({ params }: { params: T.ResourceRoot }) {
  const translate = useContext(TranslationContext);
  const regenTime = params.maxLevel / params.regenPerSec;
  return <section>
    <h2>Resource node</h2>
    <dl>
      <dt>max level</dt><dd>{params.maxLevel}</dd>
      <dt>regenerates in</dt><dd>{showNumber(days(regenTime))}</dd>
    </dl>
  </section>
}
