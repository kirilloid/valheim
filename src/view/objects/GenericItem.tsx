import React, { useContext } from 'react';

import type * as T from '../../types';

import { timeI2S } from '../../model/utils';

import { TranslationContext } from '../../effects';
import { Light, rangeBy, ShortWeaponDamage, yesNo } from '../helpers';
import { Icon } from '../parts/Icon';
import { Source } from '../parts/Source';
import { ItemHeader } from '../parts/ItemHeader';
import { DeadSpeak } from '../parts/DeadSpeak';

function Food({ health, stamina, eitr, duration, regen }: T.Food) {
  const translate = useContext(TranslationContext);
  return <section>
    <h2>{translate('ui.itemType.food')}</h2>
    <dl>
      <dt>{translate('ui.health')}</dt><dd><Icon id="health" alt="" size={16} />{' '}{health}</dd>
      <dt>{translate('ui.stamina')}</dt><dd><Icon id="walknut" alt="" size={16} />{' '}{stamina}</dd>
      {eitr != null && <>
        <dt>{translate('ui.eitr')}</dt><dd><Icon id="eitr" alt="" size={16} />{' '}{eitr}</dd>
      </>}
      <dt>{translate('ui.duration')}</dt><dd>{timeI2S(duration)}</dd>
      <dt>{translate('ui.regen')}</dt><dd>{regen}</dd>
    </dl>
  </section>
}

function Potion({ health, stamina, healthRegen, staminaRegen, damageModifiers, cooldown }: T.Potion) {
  const translate = useContext(TranslationContext);
  return <section>
    <h2>{translate('ui.itemType.potion')}</h2>
    <dl>
      {health ? <><dt>{translate('ui.health')}</dt><dd>+{health[0]} / {timeI2S(health[1])}</dd></> : null}
      {stamina ? <><dt>{translate('ui.stamina')}</dt><dd>+{stamina[0]} / {timeI2S(stamina[1])}</dd></> : null}
      {healthRegen ? <><dt>{translate('ui.healthRegen')}</dt><dd>{healthRegen * 100}%</dd></> : null}
      {staminaRegen ? <><dt>{translate('ui.staminaRegen')}</dt><dd>{staminaRegen * 100}%</dd></> : null}
      {damageModifiers ? <><dt>{translate('ui.damageModifier')}</dt><dd>{Object.keys(damageModifiers).map(type => translate(`ui.damageType.${type}`)).join(', ')}</dd></> : null}
      <dt>cooldown</dt><dd>{timeI2S(cooldown)}</dd>
    </dl>
  </section>
}

function Resource({ item }: { item: T.Resource }) {
  const translate = useContext(TranslationContext);
  const { PointLight } = item;
  return <section>
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
      {PointLight != null && <React.Fragment key="light">
        <dt>{translate('ui.tags.light')}</dt>
        <dd><Light {...PointLight} /></dd>
      </React.Fragment>}
    </dl>
    {item.Value != null && item.id !== 'Coins' && <>Could be sold to trader</>}
  </section>
}

export function GenericItem({ item }: { item: T.Resource }) {
  const { Deadspeak, Radiation } = item;
  return (<>
    <ItemHeader item={item} />
    {item.Food != null && <Food {...item.Food} />}
    {item.Potion != null && <Potion {...item.Potion} />}
    {Radiation != null && <section>
      <h2>Radiation hazard ☢️</h2>
      <dl>
        <dt>rate</dt><dd>one per {rangeBy(Radiation.rate, String)} seconds</dd>
        <dt>damage</dt><dd><ShortWeaponDamage damage={Radiation.damage} skill={null} /></dd>
      </dl>
    </section>}
    <Resource item={item} />

    {Deadspeak != null && <DeadSpeak {...Deadspeak} />}
    <Source id={item.id} />
  </>);
}
