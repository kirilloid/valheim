import React, { useContext } from 'react';

import type { GameObject } from '../../types';
import { groups } from '../../data/itemDB';
import { modLinks } from '../../mods';

import { TranslationContext, useGlobalState, useRuneTranslate } from '../../effects';
import { InlineObjectWithIcon, List, markdown, ModLinks } from '../helpers';
import { ItemIcon } from './Icon';

export const ItemHeader = React.memo(({ item, noIcon = false, children }: { item: GameObject, noIcon?: boolean, children?: React.ReactNode }) => {
  const translate = useContext(TranslationContext);
  const runeTranslate = useRuneTranslate();
  const [showDisabled] = useGlobalState('searchInDisabled');
  
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
      {!noIcon && <>
        <ItemIcon item={item} />
        {' '}
      </>}
      {runeTranslate(item)}
      <span className="entity-type"> &ndash; {
        translate(item.type === 'object'
          ? `ui.itemSubtype.${item.subtype}`
          : item.type === 'armor'
          ? `ui.armorSlot.${item.slot}`
          : 'Food' in item
          ? `ui.itemType.food`
          : `ui.itemType.${item.type}`
        )
      }</span>
      {children}
    </h1>
    {group ? <div>See also: <List separator=" | ">{
      (showDisabled ? group : group.filter(e => !e.disabled))
        .filter(e => e !== item)
        .map(e => <InlineObjectWithIcon key={e.id} id={e.id} nobr />)
    }</List></div> : null}
  </>;
});
