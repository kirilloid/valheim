import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import '../../css/Creature.css';

import { Creature as TCreature, NormalAttackProfile, SpawnAttackProfile, TOLERATE } from '../../types';
import { dmgBonus, hpBonus, multiplyDamage } from '../../model/combat';
import { timeI2S } from '../../model/utils';

import { data } from '../../data/itemDB';
import { getSummon } from '../../data/resources';
import { area, objectLocationMap } from '../../data/location';
import { maxLvl } from '../../data/creatures';

import { TranslationContext, useGlobalState } from '../../effects';
import { Area, InlineObjectWithIcon, rangeBy, Resistances, shortCreatureDamage, yesNo } from '../helpers';
import { ItemIcon } from '../parts/Icon';
import { ItemHeader } from '../parts/ItemHeader';

function NormalAttack({ attack: a, dmgScale }: { attack: NormalAttackProfile, dmgScale: number }) {
  const dmg = multiplyDamage(a.dmg, dmgScale);
  return <>
    <dt key={`atk-key-${a.name}`}>{a.name}</dt>
    <dd key={`atk-val-${a.name}`}>
      {shortCreatureDamage(dmg)}
      {a.burst ? `×${a.burst}` : ''}
      {a.unblockable ? ', unblockable' : ''}
      {a.undodgeable ? ', undodgeable' : ''}
      {a.stagger ? ', stagger=' + a.stagger : ', no stagger'}
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
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const { id, tame, pregnancy, stagger } = creature;
  const scale = { stars: level - 1 };
  const dmgScale = dmgBonus(scale);
  const dropGlobalScale = 2 ** (level - 1);
  const [sid, snr] = getSummon(id) ?? ['', 0];
  const totalVarietyRates = creature.attacks.reduce((t, a) => t + a.rate, 0);
  const locations = [
    ...new Set(creature.spawners.flatMap(s => s.biomes)),
    ...(objectLocationMap[creature.id] ?? [])
  ];
  return (<>
    <ItemHeader item={creature} >
      {maxLvl(creature) > 1
      ? <div className="Switch Creature__Stars">
          {Array.from({ length: maxLvl(creature) }).map((_, stars) => 
            level === stars + 1
              ? <span key={stars} className="Switch__Option Creature__Star Switch__Option--selected Creature__Star--selected">{stars}⭐</span>
              : <Link key={stars} className="Switch__Option Creature__Star" to={`/obj/${id}/${stars + 1}`} replace={true}>{stars}⭐</Link>
          )}
        </div>
      : null}
    </ItemHeader>
    <section>
      <h2>{translate('ui.creature')}</h2>
      <dl>
        <dt>areal</dt>
        <dd>
          <ul style={{ padding: 0 }}>
            {locations
              .filter(loc => (area(loc)?.tier ?? 1000) <= spoiler)
              .map(loc => <li key={loc}><Area area={loc} /></li>)}
          </ul>
        </dd>
        <dt>{translate('ui.faction')}</dt>
        <dd>{translate(`ui.faction.${creature.faction}`)}</dd>
      {sid ? <>
        <dt>{translate('ui.summonedWith')}</dt>
        <dd><InlineObjectWithIcon id={sid} size={16} /> ×{snr}</dd>
      </> : null}
      <dt>{translate('ui.speed')}</dt>
      <dd>{creature.speed.run}</dd>
      <dt>{translate('ui.health')}</dt>
      <dd>{creature.hp * hpBonus(scale)}</dd>
      <dt>{translate('ui.stagger')}</dt>
      <dd>{stagger
        ? creature.hp * hpBonus(scale) * stagger.factor
        : translate('ui.damageModifier.immune')}</dd>
      </dl>
      <h3>{translate('ui.damageModifiers')}</h3>
      <dl>
        <Resistances mods={creature.damageModifiers} />
        {creature.tolerate & TOLERATE.WATER ? null : <><dt>water</dt><dd>vulnerable</dd></>}
        {creature.tolerate & TOLERATE.SMOKE ? null : <><dt>smoke</dt><dd>vulnerable</dd></>}
        {creature.tolerate & TOLERATE.TAR ? <>
          <dt><Link to="/effect/Tarred">{translate('Tar')}</Link></dt>
          <dd>immune</dd>
        </> : null}
      </dl>
      {creature.attacks.length ? <div className="Creature__Attacks">
        <h3>{translate('ui.attacks')}</h3>
        {creature.attacks.map(a => <div className="Creature__Attack" key={`${id}_${a.variety}`}>
          {creature.attacks.length > 1 ? <h4>{a.variety} ({Math.round(100 * a.rate / totalVarietyRates)}%)</h4> : null}
          <dl key={a.variety}>
          {a.attacks.map(a => 'spawn' in a
            ? <SpawnAttack key={'spawn'} attack={a} />
            : <NormalAttack key={a.name} attack={a} dmgScale={dmgScale} />)}
          </dl>
        </div>)}
      </div> : null}
    </section>
    <section>
      <h2>{translate('ui.drops')}</h2>
      <ul>
        {creature.drop.map(({ item, min, max, scale, chance }) => {
          const dropScale = scale ? dropGlobalScale : 1;
          return <li key={item}>
            <InlineObjectWithIcon id={item} />
            {min >= max - 1
              ? `${min * dropScale}`
              : `${rangeBy([min * dropScale, (max - 1) * dropScale], String)}`}
            {' '}
            {Math.min(chance * dropScale, 1) * 100}%
          </li>
        })}
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
        <dd>{yesNo(tame.commandable)}</dd>
        <dt>{translate('ui.tamed.breeds')}</dt>
        <dd>{yesNo(!!pregnancy)}</dd>
        {pregnancy ? <>
          <dt>{translate('ui.growTime.animal')}</dt>
          <dd>{timeI2S(pregnancy.grow)}</dd>
        </> : null}
      </dl>
    </section> : null}
  </>);
}