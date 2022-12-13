import React, { useContext } from 'react';

import type { BaseItem } from '../../types';

import { TranslationContext } from '../../effects';
import { Icon } from './Icon';
import { Light, yesNo } from '../helpers';

export function Resource({ item }: { item: BaseItem }) {
  const translate = useContext(TranslationContext);

  return <section>
    <h2>{translate('ui.itemType.resource')}</h2>
    <dl>
      <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" alt="" size={16} />{' '}{item.weight}</dd>
      <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
      {item.PointLight && <><dt>{translate('ui.tags.light')}</dt><dd><Light {...item.PointLight} /></dd></>}
    </dl>
  </section>
}
