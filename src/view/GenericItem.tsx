import React from 'react';
import { Link } from 'react-router-dom';

import type { Item } from '../types';
import { Icon } from './Icon';
import { resourceMap } from '../model/resource-usage';
import { useTranslation } from '../translation.effect';
import { creatures } from '../model/creatures';
import { Source } from './Source';

export function GenericItem(item: Item) {
  const translate = useTranslation();
  const craftables = resourceMap[item.id];
  return (
    <>
      <h2>
        <Icon type="resources" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      <section>
        <header>resource</header>
        <dl>
          <dt>weight</dt><dd>{item.weight}</dd>
          <dt>stack</dt><dd>{item.stack}</dd>
          {item.teleportable === false
            ? <>non-teleportable <Icon type="icon" id="noteleport" size={24} /></>
            : null}
        </dl>
      </section>
      {craftables?.length
        ? <section>
            <header>crafting</header>
            Used to craft:
            <ul>
              {craftables.map(item => <li><Link to={`/obj/${item.id}`}>{translate(item.id)}</Link></li>)}
            </ul>
          </section>
        : null
      }
      {Source(item.id, translate)}
    </>
  );
}
