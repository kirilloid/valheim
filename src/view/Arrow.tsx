import React from 'react';
import { useTranslation } from '../translation.effect';

import type { Arrow as TArrow } from '../types';
import { weaponDamage } from './helpers';
import { Icon } from './Icon';
import { Source } from './Source';

export function Arrow(item: TArrow) {
  const translate = useTranslation();
  return (
    <>
      <h2>
        <Icon type="arrow" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      <section>
        <header>{translate('ui.itemType.arrow')}</header>
        <dl>
          <dt>{translate('ui.damage')}</dt>
          <dd>{weaponDamage(item.damage)}</dd>
        </dl>
      </section>
      <section>
        <header>{translate('ui.itemType.resource')}</header>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
      </section>
      <Source id={item.id} />
    </>
  );
}