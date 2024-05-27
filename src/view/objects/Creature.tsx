import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import '../../css/Creature.css';

import { AttackVariety, CastAttackProfile, Creature as TCreature, NormalAttackProfile, SpawnAttackProfile, TOLERATE } from '../../types';
import { dmgBonus, hpBonus, multiplyDamage } from '../../model/combat';
import { timeI2S } from '../../model/utils';

import { data } from '../../data/itemDB';
import { getSummon } from '../../data/resources';
import { area, objectLocationMap } from '../../data/location';
import { maxLvl } from '../../data/creatures';

import { GameSettingsContext, TranslationContext, useGlobalState } from '../../effects';
import { Area, InlineObjectWithIcon, rangeBy, Resistances, shortCreatureDamage, showPercent, yesNo } from '../helpers';
import { EffectIcon, ItemIcon } from '../parts/Icon';
import { ItemHeader } from '../parts/ItemHeader';
import { spawnedByMap } from '../../data/spawns';
import { Tabs } from '../parts/Tabs';

function NormalAttack({ attack: a, dmgScale }: { attack: NormalAttackProfile, dmgScale: number }) {
  const dmg = multiplyDamage(a.dmg, dmgScale);
  return <>
    <dt>{a.name}</dt>
    <dd>
      {shortCreatureDamage(dmg)}
      {a.burst ? `×${a.burst}` : ''}
      {a.unblockable ? ', unblockable' : ''}
      {a.undodgeable ? ', undodgeable' : ''}
      {a.stagger ? ',\u00A0stagger=' + a.stagger : ', no stagger'}
      {a.aiMinHp != null || a.aiMaxHp != null
        ? ', only with hp within ' + rangeBy([a.aiMinHp ?? 0, a.aiMaxHp ?? 1], showPercent)
        : ''}
    </dd>
  </>
}

function SpawnAttack({ attack }: { attack: SpawnAttackProfile }) {
  return <>
    <dt>spawn</dt>
    <dd>{attack.spawn.map(id => <InlineObjectWithIcon key={id} id={id} size={24} />)}</dd>
  </>
}

function CastAttack({ attack }: { attack: CastAttackProfile }) {
  const translate = useContext(TranslationContext);
  const id = attack.cast;
  return <>
    <dt>cast</dt>
    <dd>
      <EffectIcon id={id} size={24} />
      {' '}
      <Link to={`/effect/${id}`}>{translate(`ui.effect.${id}`)}</Link>
    </dd>
  </>
}

function Attack({ attack, dmgScale }: { attack: AttackVariety; dmgScale: number }) {
  return <dl>
    {attack.attacks.map((a, i) => 'spawn' in a
      ? <SpawnAttack key={i} attack={a} />
      : 'cast' in a
      ? <CastAttack key={i} attack={a} />
      : <NormalAttack key={i} attack={a} dmgScale={dmgScale} />)}
  </dl>
}

function Attacks({ attacks, dmgScale }: { attacks: AttackVariety[]; dmgScale: number }) {
  const translate = useContext(TranslationContext);

  if (attacks.length === 0) return null;
  if (attacks.length === 1) {
    return <div>
      <h3>{translate('ui.attacks')}</h3>
      <Attack attack={attacks[0]!} dmgScale={dmgScale} />
    </div>
  }
  
  const totalVarietyRates = attacks.reduce((t, a) => t + a.rate, 0);
  return <div>
    <h3>{translate('ui.attacks')}</h3>
    <Tabs tabs={attacks.map(a => ({
      title: `${a.variety} (${Math.round(100 * a.rate / totalVarietyRates)}%)`,
      renderer: () => <Attack attack={a} dmgScale={dmgScale} />,
    }))} selected={0} />
  </div>
}

export function Creature({ creature, level = 1 }: { creature: TCreature, level?: number }) {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const { worldlevel } = useContext(GameSettingsContext);

  const { id, tame, pregnancy, stagger } = creature;
  const scale = { stars: level - 1 };
  const dmgScale = dmgBonus(scale);
  const dropGlobalScale = 2 ** (level - 1);
  const [sid, snr] = getSummon(id) ?? ['', 0];
  const locations = [
    ...new Set(creature.spawners.flatMap(s => s.biomes)),
    ...(objectLocationMap[creature.id] ?? [])
  ];
  const spawnedBy = spawnedByMap[id];

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
    <section key="creature">
      <h2>{translate('ui.creature')}</h2>
      <dl>
        <dt>areal</dt>
        <dd>
          {locations.length > 0 &&
            <ul style={{ padding: 0 }}>
              {locations
                .filter(loc => (area(loc)?.tier ?? 1000) <= spoiler)
                .map(loc => <li key={loc}><Area area={loc} /></li>)}
            </ul>}
          {spawnedBy != null && <>Spawned by: <InlineObjectWithIcon id={spawnedBy} /></>}
        </dd>
        <dt>{translate('ui.faction')}</dt>
        <dd>{translate(`ui.faction.${creature.faction}`)}</dd>
      {sid ? <>
        <dt>{translate('ui.summonedWith')}</dt>
        <dd><InlineObjectWithIcon id={sid} size={16} /> ×{snr}</dd>
      </> : null}
      <dt>{translate('ui.moveSpeed')}</dt>
      <dd>{creature.speed.run}</dd>
      <dt>{translate('ui.health')}</dt>
      <dd>{creature.hp * hpBonus(scale, worldlevel)}</dd>
      <dt>{translate('ui.stagger')}</dt>
      <dd>{stagger
        ? creature.hp * hpBonus(scale, worldlevel) * stagger.factor
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
      {creature.weakSpots?.map(({ location, damageModifiers }) => <React.Fragment key={location}>
        <h3>weak spot: {location}</h3>
        <dl>
          <Resistances mods={damageModifiers} />
        </dl>
      </React.Fragment>)}
      <Attacks attacks={creature.attacks} dmgScale={dmgScale} />
    </section>
    {creature.drop.length > 0 && <section key="drop">
      <h2>{translate('ui.drops')}</h2>
      <ul>
        {creature.drop.map(({ item, min, max, scale, chance }) => {
          const dropScale = scale ? dropGlobalScale : 1;
          return <li key={item}>
            <InlineObjectWithIcon id={item} />
            {' '}
            {min >= max - 1
              ? `${min * dropScale}`
              : `${rangeBy([min * dropScale, (max - 1) * dropScale], String)}`}
            {' '}
            {Math.min(chance * dropScale, 1) * 100}%
          </li>
        })}
      </ul>
    </section>}
    {creature.timedDestruction != null && <p>
      Despawns after {rangeBy(creature.timedDestruction, String)}s
    </p>}
    {tame != null ? <section key="tame">
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
          <dt>child</dt>
          <dd><InlineObjectWithIcon id={pregnancy.childId} /></dd>
          <dt>{translate('ui.growTime.animal')}</dt>
          <dd>{timeI2S(pregnancy.grow)}</dd>
        </> : null}
      </dl>
    </section> : null}
  </>);
}