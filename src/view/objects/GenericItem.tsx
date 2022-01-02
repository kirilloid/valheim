import React, { useContext } from 'react';

import type { Resource } from '../../types';

import { timeI2S } from '../../model/utils';

import { TranslationContext } from '../../effects';
import { yesNo } from '../helpers';
import { Icon } from '../parts/Icon';
import { Source } from '../parts/Source';
import { ItemHeader } from '../parts/ItemHeader';

export function GenericItem({ item }: { item: Resource }) {
  const translate = useContext(TranslationContext);
  const { Food, Potion } = item;
  return (<>
    <ItemHeader item={item} />
    {Food != null && <section>
      <h2>{translate('ui.itemType.food')}</h2>
      <dl>
        <dt>{translate('ui.health')}</dt><dd><Icon id="health" alt="" size={16} />{' '}{Food.health}</dd>
        <dt>{translate('ui.stamina')}</dt><dd><Icon id="walknut" alt="" size={16} />{' '}{Food.stamina}</dd>
        <dt>{translate('ui.duration')}</dt><dd>{timeI2S(Food.duration)}</dd>
        <dt>{translate('ui.regen')}</dt><dd>{Food.regen}</dd>
      </dl>
    </section>}
    {Potion != null && <section>
      <h2>{translate('ui.itemType.potion')}</h2>
      <dl>
        {Potion.health ? <><dt>{translate('ui.health')}</dt><dd>+{Potion.health[0]} over {timeI2S(Potion.health[1])}</dd></> : null}
        {Potion.stamina ? <><dt>{translate('ui.stamina')}</dt><dd>+{Potion.stamina[0]} over {timeI2S(Potion.stamina[1])}</dd></> : null}
        {Potion.healthRegen ? <><dt>health regen</dt><dd>{Potion.healthRegen * 100}%</dd></> : null}
        {Potion.staminaRegen ? <><dt>stamina regen</dt><dd>{Potion.staminaRegen * 100}%</dd></> : null}
        {Potion.damageModifiers ? <><dt>resistance</dt><dd>{Object.keys(Potion.damageModifiers).map(type => translate(`ui.damageType.${type}`)).join(', ')}</dd></> : null}
        <dt>cooldown</dt><dd>{timeI2S(Potion.cooldown)}</dd>
      </dl>
    </section>}
    <section>
      <h2>{translate('ui.itemType.resource')}</h2>
      <dl>
        <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" alt="" size={16} />{' '}{item.weight}</dd>
        <dt>{translate('ui.stack')}</dt><dd>{item.stack}</dd>
        {item.Value != null && <>
          <dt>{translate('ui.value')}</dt><dd><Icon id="coin" alt="" size={16} />{' '}{item.Value}</dd>
        </>}
        <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
        {item.teleportable === false
          ? <><dt>{translate('ui.nonTeleportable')}</dt><dd><Icon id="noteleport" alt="" size={24} /></dd></>
          : null}
      </dl>
      {item.Value != null && item.id !== 'Coins' && <>Have no other use rather than to be sold to trader</>}
      </section>
    <Source id={item.id} />
  </>);
}
