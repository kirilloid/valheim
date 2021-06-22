import React, { useContext } from 'react';

import type { Item } from '../types';
import { Icon } from './Icon';
import { TranslationContext } from '../effects';
import { Source } from './Source';
import { ItemHeader } from './ItemHeader';
import { yesNo } from './helpers';

export function GenericItem({ item }: { item: Item }) {
  const translate = useContext(TranslationContext);
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate('ui.itemType.resource')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" alt="" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
          {item.teleportable === false
            ? <><dt>{translate('ui.nonTeleportable')}</dt><dd><Icon id="noteleport" alt="" size={24} /></dd></>
            : null}
        </dl>
      </section>
      <Source id={item.id} />
    </>
  );
}
