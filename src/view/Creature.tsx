import React from 'react';
import { Link } from 'react-router-dom';
import { dmgBonus, hpBonus, multiplyDamage } from '../model/combat';
import { timeI2S } from '../model/utils';
import { useTranslation } from '../translation.effect';

import { Creature as TCreature, Faction, NormalAttackProfile, SpawnAttackProfile } from '../types';
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

function NormalAttack(a: NormalAttackProfile, dmgScale: number) {
  const dmg = multiplyDamage(a.dmg, dmgScale);
  return <>
    <dt key={`atk-key-${a.name}`}>attack: {a.name}</dt>
    <dd key={`atk-val-${a.name}`}>{shortCreatureDamage(dmg)}</dd>
  </>
}

function SpawnAttack(a: SpawnAttackProfile) {
  return <>
    <dt key='spawn-key'>spawn</dt>
    <dd key='spawn-val'>{a.spawn.map(id => <Icon key='id' type="creatures" id={id} />)}</dd>
  </>
}

export function Creature(creature: TCreature, level: number = 1) {
  const translate = useTranslation();
  const { tame, pregnancy, staggerFactor } = creature;
  const scale = { stars: level - 1 };
  const dmgScale = dmgBonus(1, scale);
  return (<>
    <h2>
      <Icon type="creature" id={creature.id} />
      {' '}
      {translate(creature.id)}
    </h2>
    <section>
      <header>creature</header>
      <dl>
      <dt>faction</dt><dd>{faction(creature.faction)}</dd>
      <dt>{translate('ui.health')}</dt><dd>{hpBonus(creature.hp, scale)}</dd>
      <dt>stagger</dt><dd>{creature.hp * staggerFactor}</dd>
      {Resistances(translate, creature.damageModifiers)}
      {creature.attacks.map(a => 'spawn' in a ? SpawnAttack(a) : NormalAttack(a, dmgScale))}
      </dl>
    </section>
    <section>
      <header>drops</header>
      <ul>
        {creature.drop.map(de => <li key={de.item}><Link to={`/obj/${de.item}`}>{translate(de.item)}</Link> {de.min}–{de.max} {de.chance * 100}%</li>)}
      </ul>
    </section>
    {tame != null ? <section>
      <header>tameable</header>
      <dl>
      <dt>taming time</dt><dd>{timeI2S(tame.tameTime)}</dd>
      <dt>eats</dt><dd>{tame.eats.map(id => <Icon key={id} type="resource" id={id} size={32} />)}</dd>
      <dt>controlled</dt><dd>{tame.commandable ? '✔️' : '❌'}</dd>
      <dt>breedable</dt><dd>{pregnancy ? '✔️' : '❌'}</dd>
      </dl>
    </section> : null}
  </>);
}