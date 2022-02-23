import React, { useContext } from 'react';

import type { GameObject } from '../../types';
import { groups } from '../../data/itemDB';
import { modLinks } from '../../mods';

import { TranslationContext, useRuneTranslate } from '../../effects';
import { InlineObjectWithIcon, List, markdown, ModLinks } from '../helpers';
import { ItemIcon } from './Icon';

export function ItemHeader({ item, children }: { item: GameObject, children?: React.ReactNode }) {
  const translate = useContext(TranslationContext);
  const runeTranslate = useRuneTranslate();
  const group = item.group && groups[item.group];
  return <>
    {item.disabled && <div className="info" role="banner">{
      translate('ui.onlyWithCheats')
    }</div>}
    {item.season && <div className="info" role="banner">{
      markdown(translate('ui.onlyInSeason', translate(`ui.onlyInSeason.${item.season}`)))
    }</div>}
    {item.dlc ? <div className="info" role="banner">{
      markdown(translate('ui.onlyInDLC', item.dlc))
    }</div> : null}
    {item.mod ? <div className="info" role="banner" style={{ whiteSpace: 'pre-line' }}>{
      markdown(translate('ui.onlyInMod', item.mod))}
      <ModLinks {...(modLinks[item.mod] ?? {})} />
    </div> : null}
    <h1>
      <ItemIcon item={item} />
      {' '}
      {runeTranslate(item)}
      {children}
    </h1>
    {group ? <div>See also: <List>{
      group
        .filter(e => e !== item)
        .map(e => <InlineObjectWithIcon key={e.id} id={e.id} nobr />)
    }</List></div> : null}
  </>;
}