import React from 'react';
import { Link } from 'react-router-dom';
import { dmgBonus, hpBonus, multiplyDamage } from '../model/combat';
import { data } from '../model/objects';
import { getSummon } from '../model/resources';
import { timeI2S } from '../model/utils';
import { useTranslation } from '../translation.effect';

import { Creature as TCreature, Faction, Item, NormalAttackProfile, SpawnAttackProfile } from '../types';
import { Resistances, shortCreatureDamage } from './helpers';
import { Icon } from './Icon';

function faction(faction: Faction): string {
  switch (faction) {
    case Faction.Players: return 'player';
    case Faction.AnimalsVeg: return 'potato';
    case Faction.ForestMonsters: return 'Meadows/Forest';
    case Faction.Undead:
    case Faction.Demon: return 'Cursed';
    case Faction.MountainMonsters: return 'Mountain';
    case Faction.SeaMonsters: return 'Sea';
    case Faction.PlainsMonsters: return 'Plains';
    case Faction.Boss: return 'Boss';
  }
}

function NormalAttack({ attack: a, dmgScale }: { attack: NormalAttackProfile, dmgScale: number }) {
  const dmg = multiplyDamage(a.dmg, dmgScale);
  return <>
    <dt key={`atk-key-${a.name}`}>{a.name}</dt>
    <dd key={`atk-val-${a.name}`}>{shortCreatureDamage(dmg)}{a.burst ? ` x${a.burst}` : ''}</dd>
  </>
}

function SpawnAttack({ attack }: { attack: SpawnAttackProfile }) {
  return <>
    <dt key='spawn-key'>spawn</dt>
    <dd key='spawn-val'>{attack.spawn.map(id => <Icon key={id} type="creature" id={id} />)}</dd>
  </>
}

export function Creature({ creature, level = 1 }: { creature: TCreature, level?: number }) {
  const translate = useTranslation();
  const { tame, pregnancy, staggerFactor } = creature;
  const scale = { stars: level - 1 };
  const dmgScale = dmgBonus(1, scale);
  const [sid, snr] = getSummon(creature.id) ?? ['', 0];
  return (<>
    <h1>
      <Icon type="creature" id={creature.id} />
      {' '}
      {translate(creature.id)}
    </h1>
    <section>
      <h2>creature</h2>
      <dl>
      <dt key="faction-label">faction</dt><dd key="faction-value">{faction(creature.faction)}</dd>
      {sid ? <>
        <dt key="summon-label">summoned with</dt>
        <dd key="summon-value"><Icon type="resource" id={sid} size={16} /> <Link to={`/obj/${sid}`}>{translate(sid)}</Link> x{snr}</dd>
      </> : null}
      <dt key="health-label">{translate('ui.health')}</dt>
      <dd key="health-value">{hpBonus(creature.hp, scale)}</dd>
      <dt key="stagger-label">stagger</dt>
      <dd key="stagger-value">{creature.hp * staggerFactor}</dd>
      </dl>
      <h3>resistances</h3>
      <dl>
      <Resistances mods={creature.damageModifiers} />
      </dl>
      {creature.attacks.length ? <>
        <h3>attacks</h3>
        <dl>
        {creature.attacks.map(a => 'spawn' in a
          ? <SpawnAttack attack={a} />
          : <NormalAttack key={a.name} attack={a} dmgScale={dmgScale} />)}
        </dl>
      </> : null}
    </section>
    <section>
      <h2>drops</h2>
      <ul>
        {creature.drop.map(de => <li key={de.item}>
          <Icon type={data[de.item]?.type === 'armor' ? 'armor' : 'resource'} id={de.item} />
          <Link to={`/obj/${de.item}`}>
            {translate(de.item)}
          </Link>{' '}
          {de.min === de.max ? de.min : `${de.min}–${de.max}`} {de.chance * 100}%
        </li>)}
      </ul>
    </section>
    {tame != null ? <section>
      <h2>tameable</h2>
      <dl>
      <dt>taming time</dt><dd>{timeI2S(tame.tameTime)}</dd>
      <dt>eats</dt><dd>{tame.eats.map(id => <Icon key={id} type="resource" id={id} size={32} />)}</dd>
      <dt>controlled</dt><dd>{tame.commandable ? '✔️' : '❌'}</dd>
      <dt>breedable</dt><dd>{pregnancy ? '✔️' : '❌'}</dd>
      </dl>
    </section> : null}
  </>);
}