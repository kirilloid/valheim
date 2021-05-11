import React, { useCallback, useState } from 'react';
import { groupBy, map } from 'lodash-es';

import { Attack, Biome, DamageModifier, DamageModifiers, DamageProfile, DamageType, DropEntry, Weapon } from '../types';

import { creatures } from '../model/creatures';
import { items } from '../model/weapons';
import { damage as damageIcon } from '../model/emoji';
import { hpBonus, getPhysicalDamage } from '../model/combat';
import { Translator, useTranslation } from '../translation.effect';
import { Icon } from './Icon';
import { Resistances } from './helpers';

function Damage(dmg: DamageProfile) {
  return Object.entries(dmg).map(([type, val]) => `${damageIcon[type as any as DamageType]}${val}`).join(' ');
}

function DropItem(translate: Translator, drop: DropEntry, level: number) {
  const mul = drop.scale ? 2 ** level : 1;
  const chance = `${(Math.min(drop.chance * mul, 1) * 100)}%`;
  const min = drop.min * mul;
  const max = (drop.max - 1) * mul;
  return (<>
    <dt><Icon type="resource" id={drop.item} />{translate(drop.item)}</dt>
    <dd>{min >= max ? `${min}` : `${min}–${max}`}
        {drop.perPlayer ? ' per player' : ''} with {chance} chance</dd>
  </>);
}

function showPair(first: number, second?: number): string {
  return second ? `${first}+${second}` : String(first);
}

function PlayerAttack(props: { title: string; weapon: Weapon; attack: Attack }) {
  const [damageBase, damageGrowth] = props.weapon.damage;
  const { stamina, mul: { damage = 1, force = 1, stagger = 1 } = {} } = props.attack;
  const chain = props.attack.type === 'proj' ? 0 : props.attack.chain;
  const chainCombo = props.attack.type === 'proj' ? 1 : props.attack.chainCombo;
  return (<div>
    <h4>{props.title}</h4>
    damage: {map(damageBase, (val, type) => `${damageIcon[type as any as DamageType]}${showPair(val! * damage, (damageGrowth[type as any as DamageType] ?? 0) * damage)}`).join(' ')}<br />
    stamina: {stamina}<br />
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

export function Combat() {
  const [players, onPlayersChange] = useStateInputEffect(1, Number);
  const [armor, onArmorChange] = useStateInputEffect<number, HTMLElement & { value: string }>(0, Number);
  const [skill, onSkillChange] = useStateInputEffect(0, Number);
  const [weapon, onWeaponChange] = useStateInputEffect(items[0]!, id => items.find(w => w.id === id));
  
  const [creature, onCreatureChange] = useStateInputEffect(creatures[0]!, id => creatures.find(c => c.id === id));
  const [stars, onStarsChange] = useStateInputEffect(0, Number);
  
  const translate = useTranslation();
  
  const [primary, secondary] = weapon.attacks;

  return (<>
    <h2>Combat calculator</h2>
    <div className="CombatCalc">
      <div className="Player">
        <h2>Player</h2>
        <label>
          players
          <input type="number" pattern="[0-9]+" onChange={onPlayersChange} value={players} style={{ width: '3em' }} />
          <input type="range" min="1" max="10" onChange={onPlayersChange} value={players} />
        </label>
        <br />
        <label>
          armor
          <input type="number" pattern="[0-9]+" onChange={onArmorChange} value={armor} style={{ width: '3em' }} />
          <input type="range" min="0" max="100" onChange={onArmorChange} value={armor} list="armor" />
          <datalist id="armor">
            <option value="2" />{/* Rag */}
            <option value="7" />{/* Leather 1 */}
            <option value="14" />{/* Leather 2 */}
            <option value="21" />{/* Leather 3 */}
            <option value="28" label="Leather" />
            <option value="19" />{/* Troll 1 */}
            <option value="26" />{/* Troll 2 */}
            <option value="33" label="Troll" />
            <option value="28" />{/* Bronze 1 */}
            <option value="34" />{/* Bronze 2 */}
            <option value="40" />{/* Bronze 3 */}
            <option value="46" label="Bronze" />
            <option value="52" />{/* Iron 2 */}
            <option value="58" />{/* Iron 3 */}
            <option value="64" label="Iron" />
            <option value="70" />{/* Silver 2 */}
            <option value="76" />{/* Silver 3 */}
            <option value="82" label="Silver" />
            <option value="88" />{/* Padded 2 */}
            <option value="94" />{/* Padded 3 */}
            <option value="100" label="Padded" />
          </datalist>
        </label>
        <br/>
        <label>
          skill
          <input type="number" pattern="[0-9]+" onChange={onSkillChange} value={skill} style={{ width: '3em' }} />
          <input type="range" min="0" max="100" onChange={onSkillChange} value={skill} />
        </label>
        <br />
        <label>
          weapon
          <select onChange={onWeaponChange}>
            {map(groupBy(items, i => i.tier), (group, tier) => (<optgroup label={`tier ${tier}`}>
              {group.map(i => <option value={i.id}>{translate(i.id)}</option>)}
            </optgroup>))}
          </select>
        </label>
        <br />
        <Icon type="weapon" id={weapon.id} />
        <br />
        {primary && <PlayerAttack title="primary attack" weapon={weapon} attack={primary} />}
        {secondary && <PlayerAttack title="secondary attack" weapon={weapon} attack={secondary} />}
      </div>
      <div>
        <h2>Creature</h2>
        <select onChange={onCreatureChange}>
          {map(groupBy(creatures, c => c.tier), (group, tier) => (<optgroup label={Biome[Number(tier) - 1]}>
            {group.map(c => <option value={c.id}>{c.emoji}{translate(c.id)}</option>)}
          </optgroup>))}
        </select><br />
        <input id="star-0" type="radio" name="stars" value="0" checked={stars === 0} onChange={onStarsChange} /><label htmlFor="star-0">0⭐</label>
        <input id="star-1" type="radio" name="stars" value="1" checked={stars === 1} onChange={onStarsChange} /><label htmlFor="star-1">1⭐</label>
        <input id="star-2" type="radio" name="stars" value="2" checked={stars === 2} onChange={onStarsChange} /><label htmlFor="star-2">2⭐</label>
        <h3>Sturdiness</h3>
        <dl>
          <dt>hp</dt><dd>{hpBonus(creature.hp, { players, stars })}</dd>
          {Resistances(translate, creature.damageModifiers)}
        </dl>
        <h3>Attacks</h3>
        <dl>
          {creature.attacks.map(a => {
            if ('dmg' in a) {
              return (<><dt>{a.name}</dt><dd>{Damage(a.dmg)}</dd></>)
            } else {
              return (<><dt>spawn</dt><dd><ul>{a.spawn.map(id => <li>{translate(id)}</li>)}</ul></dd></>)
            }
          })}
        </dl>
        <h3>Drop</h3>
        {creature.drop.length ? <dl>
          {creature.drop.map(e => DropItem(translate, e, stars))}
        </dl> : <em>none</em>}
      </div>
    </div>
  </>);
}