import React, { useContext } from 'react';

import type { GameObject } from '../types';
import { groups } from '../data/itemDB';
import { TranslationContext, useRuneTranslate } from '../effects';
import { InlineObject, List } from './helpers';
import { ItemIcon } from './Icon';

export function ItemHeader({ item, children }: { item: GameObject, children?: React.ReactNode }) {
  const translate = useContext(TranslationContext);
  const runeTranslate = useRuneTranslate();
  const group = item.group && groups[item.group];
  return <>
    {item.disabled && <div className="info" role="banner">{translate('ui.onlyWithCheats')}</div>}
    {item.season && <div className="info" role="banner">{translate('ui.onlyInSeason', translate(`ui.onlyInSeason.${item.season}`))}</div>}
    {item.dlc ? <div className="info" role="banner">{translate('ui.onlyInDLC', item.dlc)}</div> : null}
    <h1>
      <ItemIcon item={item} />
      {' '}
      {runeTranslate(item)}
      {children}
    </h1>
    {group ? <div>See also: <List>{
      group
        .filter(e => e !== item)
        .map(e => <InlineObject key={e.id} id={e.id} />)
    }</List></div> : null}
  </>;
}