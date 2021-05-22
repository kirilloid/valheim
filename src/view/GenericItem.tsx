import React from 'react';
import { Link } from 'react-router-dom';

import type { Item } from '../types';
import { Icon } from './Icon';
import { resourceMap } from '../model/resource-usage';
import { useTranslation } from '../translation.effect';
import { Source } from './Source';

export function GenericItem({ item }: { item: Item }) {
  const translate = useTranslation();
  const craftables = resourceMap[item.id];
  return (
    <>
      <h1>
        <Icon type="resource" id={item.id} />
        {' '}
        {translate(item.id)}
      </h1>
      <section>
        <h2>{translate('ui.itemType.resource')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
          {item.teleportable === false
            ? <>{translate('ui.nonTeleportable')} <Icon type="icon" id="noteleport" size={24} /></>
            : null}
        </dl>
      </section>
      {craftables?.length
        ? <section>
            <h2>crafting</h2>
            {translate('ui.usedToCraft')}:
            <ul>
              {craftables.map(item => <li><Link to={`/obj/${item.id}`}>{translate(item.id)}</Link></li>)}
            </ul>
          </section>
        : null
      }
      <Source id={item.id} />
    </>
  );
}
