import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import '../css/Creature.css';

import { dmgBonus, hpBonus, multiplyDamage } from '../model/combat';
import { data } from '../model/objects';
import { getSummon } from '../model/resources';
import { timeI2S } from '../model/utils';
import { TranslationContext } from '../translation.effect';

import { Creature as TCreature, Faction, NormalAttackProfile, SpawnAttackProfile } from '../types';
import { Resistances, shortCreatureDamage } from './helpers';
import { ItemIcon } from './Icon';
import { ItemHeader } from './ItemHeader';

function NormalAttack({ attack: a, dmgScale }: { attack: NormalAttackProfile, dmgScale: number }) {
  const dmg = multiplyDamage(a.dmg, dmgScale);
  return <>
    <dt key={`atk-key-${a.name}`}>{a.name}</dt>
    <dd key={`atk-val-${a.name}`}>
      {shortCreatureDamage(dmg)}
      {a.burst ? ` x${a.burst}` : ''}
      {a.unblockable ? ', unblockable' : ''}
      {a.undodgeable ? ', undodgeable' : ''}
    </dd>
  </>
}

function SpawnAttack({ attack }: { attack: SpawnAttackProfile }) {
  return <>
    <dt key='spawn-key'>spawn</dt>
    <dd key='spawn-val'>{attack.spawn.map(id => <ItemIcon key={id} item={data[id]} />)}</dd>
  </>
}

export function Creature({ creature, level = 1 }: { creature: TCreature, level?: number }) {
  const translate = useContext(TranslationContext);
  const { id, tame, pregnancy, staggerFactor } = creature;
  const scale = { stars: level - 1 };
  const dmgScale = dmgBonus(scale);
  const dropScale = 2 ** (level - 1);
  const [sid, snr] = getSummon(id) ?? ['', 0];
  return (<>
    <ItemHeader item={creature} >
      {creature.maxLvl > 1
      ? <div className="Creature_Stars">
          {Array.from({ length: creature.maxLvl }).map((_, stars) => 
            level === stars + 1
              ? <span className="Creature_Star Creature_Star--selected">{stars}⭐</span>
              : <Link className="Creature_Star" to={`/obj/${id}/${stars + 1}`} replace={true}>{stars}⭐</Link>
          )}
        </div>
      : null}
    </ItemHeader>
    <section>
      <h2>creature</h2>
      <dl>
        <dt key="faction-label">{translate('ui.faction')}</dt>
        <dd key="faction-value">{translate(`ui.faction.${Faction[creature.faction]}`)}</dd>
      {sid ? <>
        <dt key="summon-label">{translate('ui.summonedWith')}</dt>
        <dd key="summon-value"><ItemIcon item={data[sid]} size={16} /> <Link to={`/obj/${sid}`}>{translate(sid)}</Link> x{snr}</dd>
      </> : null}
      <dt key="health-label">{translate('ui.health')}</dt>
      <dd key="health-value">{creature.hp * hpBonus(scale)}</dd>
      <dt key="stagger-label">stagger</dt>
      <dd key="stagger-value">{creature.hp * staggerFactor}</dd>
      </dl>
      <h3>resistances</h3>
      <dl>
      <Resistances mods={creature.damageModifiers} />
      </dl>
      {creature.attacks.length ? <>
        <h3>attacks</h3>
        {creature.attacks.map(a => <>
          {creature.attacks.length ? <h4 key={a.variety}>{a.variety}</h4> : null}
          <dl>
          {a.attacks.map(a => 'spawn' in a
            ? <SpawnAttack attack={a} />
            : <NormalAttack key={a.name} attack={a} dmgScale={dmgScale} />)}
          </dl>
        </>)}
      </> : null}
    </section>
    <section>
      <h2>{translate('ui.drops')}</h2>
      <ul>
        {creature.drop.map(({ item, min, max, chance }) => <li key={item}>
          <ItemIcon item={data[item]} />
          <Link to={`/obj/${item}`}>
            {translate(item)}
          </Link>{' '}
          {min >= max - 1
            ? `${min * dropScale}`
            : `${min * dropScale}–${(max - 1) * dropScale}`}
          {' '}
          {Math.min(chance * dropScale, 1) * 100}%
        </li>)}
      </ul>
    </section>
    {tame != null ? <section>
      <h2>{translate('ui.tameable')}</h2>
      <dl>
        <dt>{translate('ui.tamingTime')}</dt>
        <dd>{timeI2S(tame.tameTime)}</dd>
        <dt>{translate('ui.tamed.eat')}</dt>
        <dd>{tame.eats.map(id => <ItemIcon key={id} item={data[id]} size={32} />)}</dd>
        <dt>{translate('ui.tamed.controlled')}</dt>
        <dd>{tame.commandable ? '✔️' : '❌'}</dd>
        <dt>{translate('ui.tamed.breeds')}</dt>
        <dd>{pregnancy ? '✔️' : '❌'}</dd>
      </dl>
    </section> : null}
  </>);
}