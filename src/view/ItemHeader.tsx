import React, { useContext } from 'react';

import { TranslationContext } from '../effects';
import { GameObject } from "../types";
import { ItemIcon } from './Icon';

export function ItemHeader({ item, children }: { item: GameObject, children?: React.ReactNode }) {
  const translate = useContext(TranslationContext);
  return <>
    {item.disabled && <div className="info">This item is currently disabled and could be obtained only via dev.commands, which are technically cheats.</div>}
    {item.dlc ? <div className="info">This item is available only in DLC "{item.dlc}"</div> : null}
    <h1>
      <ItemIcon item={item} />
      {' '}
      {translate(item.id)}
      {children}
    </h1>
  </>;
}