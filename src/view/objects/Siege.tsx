import React, { useContext } from 'react';

import { TranslationContext } from '../../effects';

import { Siege as SiegePiece } from '../../types';
import { Resistances } from '../helpers';
import { ItemHeader } from '../parts/ItemHeader';

export function Siege(props: { item: SiegePiece }) {
  const translate = useContext(TranslationContext);
  const { item } = props;

  const { target, size } = item.piece!;
  const { hp, damageModifiers } = item.wear;

  return (<>
    <ItemHeader item={item} />
    <section>
      <h2>{translate('ui.piece')}</h2>
      <dl>
        <dt>{translate('ui.healthStructure')}</dt><dd>{hp}</dd>
        <Resistances mods={damageModifiers} />
        <dt>{translate('ui.pieceTarget')}</dt><dd>{translate(`ui.pieceTarget.${target}`)}</dd>
        {size ? <><dt>size</dt><dd>{size.filter(Boolean).join('×')}</dd></> : null}
      </dl>
    </section>
  </>);
}
