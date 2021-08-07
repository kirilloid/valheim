import React, { useContext } from 'react';

import type { GameObject } from '../types';
import { TranslationContext } from '../effects';
import { ItemIcon } from './Icon';

export function ItemHeader({ item, children }: { item: GameObject, children?: React.ReactNode }) {
  const translate = useContext(TranslationContext);
  return <>
    {item.disabled && <div className="info">{translate('ui.onlyWithCheats')}</div>}
    {item.season && <div className="info">{translate('ui.onlyInSeason', translate(`ui.onlyInSeason.${item.season}`))}</div>}
    {item.dlc ? <div className="info">{translate('ui.onlyInDLC', item.dlc)}</div> : null}
    <h1>
      <ItemIcon item={item} />
      {' '}
      {translate(item.id)}
      {children}
    </h1>
  </>;
}