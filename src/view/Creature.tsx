import React from 'react';
import { Link } from 'react-router-dom';
import { timeI2S } from '../model/utils';

import { DamageProfile, DamageType, Creature as TCreature, Faction } from '../types';
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

export function Creature(creature: TCreature) {
  const { tame, pregnancy, staggerFactor } = creature;
  return (<>
    <h2>
      <Icon type="creatures" id={creature.id} />
      {' '}
      {creature.id}
    </h2>
    <section>
      <header>creature</header>
      <dl>
      <dt>faction</dt><dd>{faction(creature.faction)}</dd>
      <dt>health</dt><dd>{creature.hp}</dd>
      {creature.attacks.map(a => (
        <><dt>attack</dt><dd>{JSON.stringify(a)}</dd></>
      ))}
      <dt>resistances</dt><dd>{JSON.stringify(creature.damageModifiers).replace(/"\d+":0,/g, '')}</dd>
      </dl>
    </section>
    <section>
      <header>drops</header>
      <ul>
        {creature.drop.map(de => <li><Link to={`/obj/${de.item}`}>{de.item}</Link> {de.min}–{de.max} {de.chance * 100}%</li>)}
      </ul>
    </section>
    {tame != null ? <section>
      <header>tameable</header>
      <dl>
      <dt>taming time</dt><dd>{timeI2S(tame.tameTime)}</dd>
      <dt>eats</dt><dd>{tame.eats.map(id => <Icon type="resources" id={id} size={32} />)}</dd>
      <dt>controlled</dt><dd>{tame.commandable ? '✔️' : '❌'}</dd>
      <dt>breedable</dt><dd>{pregnancy ? '✔️' : '❌'}</dd>
      </dl>
    </section> : null}
  </>);
}