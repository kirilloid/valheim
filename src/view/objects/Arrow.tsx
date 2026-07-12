import React, { useContext } from 'react';
import { SkillType } from '../../model/skills';
import { TranslationContext } from '../../effects';

import type { Arrow as TArrow } from '../../types';
import { List, ShortWeaponDamage, yesNo } from '../helpers';
import { Icon, ItemIcon } from '../parts/Icon';
import { ItemHeader } from '../parts/ItemHeader';
import { Source } from '../parts/Source';

import { items } from '../../data/weapons';
import { siege } from '../../data/transport';
import { pieces } from '../../data/building';
import { assertNever } from '../../model/utils';

const bows = items.filter(item => item.type === 'weapon' && item.skill === SkillType.Bows);
const crossbows = items.filter(item => item.type === 'weapon' && item.skill === SkillType.Crossbows);
const turrets = pieces.filter(item => 'Turret' in item);
const catapults = siege.filter(item => item.id === 'Catapult');

function AmmoType({ type }: { type: TArrow['type'] }) {
  switch (type) {
    case 'arrow':
      return <List separator="">{bows.map(item => <ItemIcon item={item} />)}</List>
    case 'bolt':
      return <List separator="">{crossbows.map(item => <ItemIcon item={item} />)}</List>
    case 'missile':
      return <List separator="">{turrets.map(item => <ItemIcon item={item} />)}</List>
    case 'catapult':
      return <List separator="">{catapults.map(item => <ItemIcon item={item} />)}</List>
    default:
      return assertNever(type);
  }
}

export function Arrow({ item }: { item: TArrow }) {
  const translate = useContext(TranslationContext);
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate(`ui.itemType.${item.type}`)}</h2>
        <dl>
          <dt>{translate('ui.damage')}</dt>
          <dd><ShortWeaponDamage damage={item.damage} skill={SkillType.Bows} /></dd>
          <dt>used for</dt>
          <dd><AmmoType type={item.type} /></dd>
        </dl>
      </section>
      <section>
        <h2>{translate('ui.itemType.resource')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" alt="" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
        </dl>
      </section>
      <Source id={item.id} />
    </>
  );
}