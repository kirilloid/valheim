import React, { useContext } from 'react';

import '../../css/Ship.css';
import { TranslationContext } from '../../effects';

import { Cart as CartPiece } from '../../types';
import { Resistances } from '../helpers';
import { ItemHeader } from '../parts/ItemHeader';

export function Cart(props: { item: CartPiece }) {
  const translate = useContext(TranslationContext);
  const { item } = props;

  const { target, size } = item.piece;
  const { hp, damageModifiers } = item.wear;
  const [ cols, rows ] = item.storage;
  const storage = cols * rows;

  return (<>
    <ItemHeader item={item} />
    <section>
      <h2>{translate('ui.piece')}</h2>
      <dl>
        <dt>{translate('ui.healthStructure')}</dt><dd>{hp}</dd>
        <Resistances mods={damageModifiers} />
        <dt>{translate('ui.pieceTarget')}</dt><dd>{translate(`ui.pieceTarget.${target}`)}</dd>
        <dt>storage</dt><dd>{storage}</dd>
        {size ? <><dt>size</dt><dd>{size.filter(Boolean).join('×')}</dd></> : null}
      </dl>
    </section>
  </>);
}
