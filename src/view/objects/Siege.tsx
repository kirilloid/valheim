import React, { useContext } from 'react';
import { data } from '../../data/itemDB';

import { TranslationContext } from '../../effects';

import { Siege as SiegePiece } from '../../types';
import { List, Resistances } from '../helpers';
import { ItemIcon } from '../parts/Icon';
import { ItemHeader } from '../parts/ItemHeader';

function SiegeMachine({ component }: { component: Exclude<SiegePiece['SiegeMachine'], undefined> }) {
  return (<>
    <dt>fuel</dt>
    <dd><List separator="">{component.fuel.map(f => <ItemIcon item={data[f]} />)}</List></dd>
  </>);
}

function Catapult({ component }: { component: Exclude<SiegePiece['Catapult'], undefined> }) {
  return (<>
    <dt>ammo</dt>
    <dd><List separator="">{component.ammo.map(f => <ItemIcon item={data[f]} />)}</List></dd>
  </>);
}

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
        {item.SiegeMachine && <SiegeMachine component={item.SiegeMachine} />}
        {item.Catapult && <Catapult component={item.Catapult} />}
      </dl>
    </section>
  </>);
}
