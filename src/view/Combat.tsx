import React, { useCallback, useContext, useState } from 'react';
import { groupBy, map, mapValues } from 'lodash-es';

import { Arrow, Attack, Biome, Creature, DamageProfile, DamageType, EntityId, GameObject, Shield, Weapon } from '../types';

import { creatures } from '../model/creatures';
import { items } from '../model/weapons';
import { arrows } from '../model/arrows';
import { damage as damageIcon } from '../model/emoji';
import { hpBonus, getPhysicalDamage, dmgBonus, multiplyDamage, addDamage, applyDamageModifier, attack, getTotalDamage } from '../model/combat';
import { TranslationContext } from '../translation.effect';
import { Icon, ItemIcon, SkillIcon } from './Icon';
import { Resistances, showNumber } from './helpers';

const weapons = items.filter(i => !i.disabled && i.type === 'weapon') as Weapon[]; 
// const shields = items.filter(i => !i.disabled && i.type === 'shield') as Shield[]; 

function Damage(dmg: DamageProfile) {
  return Object.entries(dmg).map(([type, val]) => `${damageIcon[type as any as DamageType]}${showNumber(val!)}`).join(' ');
}

function showPair(first: number, second?: number): string {
  return second ? `${first}+${second}` : String(first);
}

function PlayerAttack(props: { title: string; weapon: Weapon; attack: Attack }) {
  const translate = useContext(TranslationContext);
  const [damageBase, damageGrowth] = props.weapon.damage;
  const { stamina, mul: { damage = 1, force = 1, stagger = 1 } = {} } = props.attack;
  const chain = props.attack.type === 'proj' ? 0 : props.attack.chain;
  const chainCombo = props.attack.type === 'proj' ? 1 : props.attack.chainCombo;
  return (<div>
    <h4>{props.title}</h4>
    {translate('ui.damage')}: {map(damageBase, (val, type) => `${damageIcon[type as any as DamageType]}${showPair(val! * damage, (damageGrowth[type as any as DamageType] ?? 0) * damage)}`).join(' ')}<br />
    {translate('ui.stamina')}: {stamina}<br />
    knockback: {props.weapon.knockback * force}<br />
    stagger: {getPhysicalDamage(damageBase) * stagger}<br />
    {chain ? 'combo: ' +Array.from({ length: chain }, (_, i) => i ? 1 : chainCombo).reverse().join('+') : ''}
  </div>);
}

function useStateInputEffect<Value, InputElement extends HTMLElement & { value: string }>(
  initialValue: Value,
  reader: (value: string) => Value | undefined,
) {
  const [value, setValue] = useState<Value>(initialValue);
  const onInputChange = useCallback((e: React.ChangeEvent<InputElement>) => {
    const targetValue = reader(e.target.value);
    if (targetValue != null) {
      setValue(targetValue);
    }
  }, [reader]);
  return [value, onInputChange] as const;
}

function useStateSelectEffect<T extends GameObject>(items: T[]) {
  return useStateInputEffect(items[0]!, id => items.find(i => i.id === id));
}

function attackCreature(weapon: Weapon, level: number, arrow: Arrow, creature: Creature) {
  const weaponDamage = addDamage(weapon.damage[0], multiplyDamage(weapon.damage[1], level - 1));
  const totalDamage = weapon.slot === 'bow'
    ? addDamage(weaponDamage, arrow.damage)
    : weaponDamage;
  const { damage, overTime } = attack(totalDamage, creature.damageModifiers, 0, false);
  const singleHit = getTotalDamage(addDamage(damage, mapValues(overTime, d => d?.[0])));
  const stagger = getPhysicalDamage(damage);
  return { singleHit, stagger };
}

export function Combat() {
  const [weapon, onWeaponChange] = useStateSelectEffect(weapons);
  const [arrow, onArrowChange] = useStateSelectEffect(arrows);
  // const [shield, onShieldChange] = useStateSelectEffect(shields);
  const [armor, onArmorChange] = useStateInputEffect<number, HTMLElement & { value: string }>(0, Number);
  const [skill, onSkillChange] = useStateInputEffect(0, Number);
  const [players, onPlayersChange] = useStateInputEffect(1, Number);
  
  const [creature, onCreatureChange] = useStateInputEffect(creatures[0]!, id => creatures.find(c => c.id === id));
  const [stars, onStarsChange] = useStateInputEffect(0, Number);
  
  const translate = useContext(TranslationContext);
  
  const [primary, secondary] = weapon.attacks;
  const scale = { players, stars: Math.min(stars, creature.maxLvl - 1) };

  const attack = attackCreature(weapon, 1, arrow, creature);

  return (<>
    <h1>Combat calculator</h1>
    <div className="CombatCalc">
      <div className="Player">
        <h2>Player</h2>
        <label className="InputBlock">
          {translate('ui.itemType.weapon')}
          <span className="InputBlock__Gap" />
          <ItemIcon item={weapon} size={24} />
          <select className="BigInput" onChange={onWeaponChange}>
            {map(groupBy(weapons, w => w.tier), (group, tier) => (<optgroup label={`tier ${tier}`}>
              {group.map(w => <option key={w.id} value={w.id}>{w.emoji} {translate(w.id)}</option>)}
            </optgroup>))}
          </select>
        </label>
        {weapon.slot === 'bow' && <label className="InputBlock">
          {translate('ui.itemType.arrow')}
          <span className="InputBlock__Gap" />
          <ItemIcon item={arrow} size={24} />
          <select className="BigInput" onChange={onArrowChange}>
            {arrows.map(a => <option key={a.id} value={a.id}>{translate(a.id)}</option>)}
          </select>
        </label>}
        <label className="InputBlock">
          <span className="col-xs-6 col-sm-3">{translate('ui.skill')}</span>
          <span className="InputBlock__Gap" />
          <SkillIcon skill={weapon.skill} useAlt size={24} />
          <input type="number" pattern="[0-9]+" min="0" max="100" onChange={onSkillChange} value={skill} style={{ width: '3em' }} />
          <input type="range" min="0" max="100" onChange={onSkillChange} value={skill} className="BigInput" />
        </label>
        {/*weapon.slot === 'primary' && <label className="InputBlock">
          {translate('ui.itemType.shield')}
          <span className="InputBlock__Gap" />
          <ItemIcon item={shield} size={24} />
          <select className="BigInput" onChange={onShieldChange}>
            {shields.map(s => <option key={s.id} value={s.id}>{translate(s.id)}</option>)}
          </select>
        </label>*/}
        <label className="InputBlock">
          {translate('ui.armor')}
          <span className="InputBlock__Gap" />
          <Icon id="ac_bkg" alt="" size={24} />
          <input type="number" pattern="[0-9]+" min="0" max="100" onChange={onArmorChange} value={armor} style={{ width: '3em' }} />
          <input type="range" min="0" max="100" onChange={onArmorChange} value={armor} className="BigInput" list="armor" />
          <datalist id="armor">
            <option value="2" />{/* Rag */}
            <option value="7" />{/* Leather 1 */}
            <option value="14" />{/* Leather 2 */}
            <option value="21" />{/* Leather 3 */}
            <option value="28" label="Leather" />
            <option value="33" label="Troll" />
            <option value="46" label="Bronze" />
            <option value="64" label="Iron" />
            <option value="82" label="Silver" />
            <option value="100" label="Padded" />
          </datalist>
        </label>
        <label className="InputBlock">
          players
          <span className="InputBlock__Gap" />
          <Icon id="player_32" alt="" size={24} />
          <input type="number" pattern="[0-9]+" min="1" max="10" onChange={onPlayersChange} value={players} style={{ width: '3em' }} />
          <input type="range" min="1" max="10" onChange={onPlayersChange} value={players} className="BigInput" />
        </label>
      </div>
      <div>
        <h2>Creature</h2>
        <select onChange={onCreatureChange}>
          {map(
            groupBy(creatures, c => c.tier),
            (group, tier) => (
              <optgroup label={Biome[Number(tier) - 1]}>
                {group.map(c => <option value={c.id}>{c.emoji}{translate(c.id)}</option>)}
              </optgroup>
            )
          )}
        </select>
        {creature.maxLvl > 1 ?
          <>
            <br />
            <input id="star-0" type="radio" name="stars" value="0" checked={stars === 0} onChange={onStarsChange} /><label htmlFor="star-0">0⭐</label>
            <input id="star-1" type="radio" name="stars" value="1" checked={stars === 1} onChange={onStarsChange} /><label htmlFor="star-1">1⭐</label>
            <input id="star-2" type="radio" name="stars" value="2" checked={stars === 2} onChange={onStarsChange} /><label htmlFor="star-2">2⭐</label>
          </> : null}
      </div>
    </div>
    <div>
      <h2>{translate('ui.damage')}</h2>
      {attack.singleHit}
    </div>
  </>);
}