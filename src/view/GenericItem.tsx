import React from 'react';
import { Link } from 'react-router-dom';

import type { Item } from '../types';
import { Icon } from './Icon';
import { resourceMap } from '../model/resource-usage';
import { useTranslation } from '../translation.effect';
import { Recipe } from './Recipe';

export function GenericItem(item: Item) {
  const translate = useTranslation();
  const craftables = resourceMap[item.id];
  const { recipe } = item;
  return (
    <>
      <h2>
        <Icon type="resources" id={item.id} />
        {' '}
        {item.id}
      </h2>
      <section>
        <header>{translate('ui.itemType.resource')}</header>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd>{item.weight}</dd>
          <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
          {item.teleportable === false
            ? <>non-teleportable <Icon type="icon" id="noteleport" size={24} /></>
            : null}
        </dl>
      </section>
      {craftables?.length ? <section>
        <header>crafting</header>
        <>Used to craft:
        <ul>
          {craftables.map(item => <li><Link to={`/obj/${item.id}`}>{translate(item.id)}</Link></li>)}
        </ul></>
      </section> : null}
      {recipe ? (<>
        {translate('ui.recipe')}: <Recipe {...recipe} />
      </>) : null}
    </>
  );
}
