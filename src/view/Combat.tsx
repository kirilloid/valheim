import React, { useCallback, useContext, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { groupBy, map } from 'lodash-es';

import { Attack, Biome, Creature, DamageProfile, DamageType, GameObject, Weapon } from '../types';

import { creatures } from '../model/creatures';
import { items } from '../model/weapons';
import { arrows } from '../model/arrows';
import { locationToBiome } from '../model/location';
import { damage as damageIcon } from '../model/emoji';
import { getPhysicalDamage, attackCreature, WeaponConfig } from '../model/combat';
import { TranslationContext } from '../translation.effect';
import { Icon, ItemIcon, SkillIcon } from './Icon';
import { showNumber } from './helpers';

const weapons = items.filter(i => !i.disabled && i.type === 'weapon') as Weapon[]; 
const weaponGroups = groupBy(weapons, w => w.tier);
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

function useStateInputUpdate<Value, InputElement extends HTMLSelectElement | HTMLInputElement>(
  reader: (el: InputElement) => Value | undefined,
  setValue: (value: Value) => void, 
) {
  const onInputChange = useCallback((e: React.ChangeEvent<InputElement>) => {
    const targetValue = reader(e.target);
    if (targetValue != null) setValue(targetValue);
  }, [reader, setValue]);
  return onInputChange;
}

function numberReader(element: HTMLSelectElement | HTMLInputElement): number {
  return Number(element.value);
}

function useStateSelectUpdate<T extends GameObject>(items: T[], setValue: (value: T) => void) {
  return useStateInputUpdate(el => items.find(i => i.id === el.value), setValue);
}

function useStateNumberUpdate(setValue: (value: number) => void) {
  return useStateInputUpdate<number, HTMLInputElement>(numberReader, setValue);
}

function useStateCheckboxUpdate(setValue: (value: boolean) => void) {
  return useStateInputUpdate<boolean, HTMLInputElement>(el => el.checked, setValue);
}

const groupedCreatures: Record<Biome, Creature[]> = {
  Meadows: [],
  BlackForest: [],
  Swamp: [],
  Ocean: [],
  Mountain: [],
  Plains: [],
  Mistlands: [],
  DeepNorth: [],
  Ashlands: [],
};

for (const creature of creatures) {
  if (creature.hp === 1) continue;
  for (const loc of creature.locations) {
    const biome = locationToBiome(loc);
    const group = groupedCreatures[biome];
    if (!group.includes(creature)) {
      group.push(creature);
    }
  }
}

interface CombatState {
  weapon: WeaponConfig;
  creature: Creature;
  biome: Biome;
  backstab: boolean;
  isWet: boolean;
}

type UseCombatState = [CombatState, React.Dispatch<CombatState>];

function getInitialWeapon(
  id?: string,
  level?: string,
  skill?: string,
  arrow?: string,
): WeaponConfig {
  const weapon = id && weapons.find(w => w.id === id) || weapons[0]!;
  return {
    item: weapon,
    level: Number(level) || weapon.maxLvl,
    skill: Number(skill) || 0,
    arrow: arrow && arrows.find(a => a.id === arrow) || arrows[0]!,
  };
}

const paramsRegex = /(\w+)-vs-(\w+)-(\d+)-(\d+)(?:-(\w+))?/;

function getInitialState(params: string): CombatState {
  const match = params.match(paramsRegex);
  const [, creature, weapon, level, skill, arrow ] = match ?? [];
  return {
    weapon: getInitialWeapon(weapon, level, skill, arrow),
    // shield: shields[0]!
    // armor: 2,
    // players: 1,
    creature: creatures.find(c => c.id === creature) ?? creatures[0]!,
    biome: 'Meadows',
    backstab: false,
    isWet: false,
  };
}

const updateWeapon = ([state, setState]: UseCombatState) =>
  (item: Weapon) =>
  setState({ ...state, weapon: { ...state.weapon, item, level: item.maxLvl } });

const creatureReader = (e: HTMLSelectElement) => {
  const parent = e.selectedOptions.item(0)?.parentElement;
  const biome = parent instanceof HTMLOptGroupElement
    ? parent.label as Biome
    : undefined;
  const creature = creatures.find(c => c.id === e.value);
  return creature ? { creature, biome } : undefined;
};

const updateCreature = ([state, setState]: UseCombatState) =>
  (props : { creature: Creature, biome?: Biome }) => {
    const { creature, biome = locationToBiome(creature.locations[0]!) } = props;
    if (creature.faction === 'SeaMonsters') setState({ ...state, creature, biome, isWet: true });
    // mountain
    else if (creature.tier === 4) setState({ ...state, creature, biome, isWet: false });
    else setState({ ...state, creature, biome });
  };

const updateGeneric = <K extends keyof CombatState>([state, setState]: UseCombatState, key: K) =>
  (value: CombatState[K]): void =>
  setState({ ...state, [key]: value });

const updateInWeapon = <K extends keyof WeaponConfig>([state, setState]: UseCombatState, key: K) =>
  (value: WeaponConfig[K]): void =>
  setState({ ...state, weapon: { ...state.weapon, [key]: value } });

export function Combat() {
  const translate = useContext(TranslationContext);
  const history = useHistory();
  const { params } = useParams<{ params: string }>();
  const statePair = useState(getInitialState(params));
  const [state] = statePair;
  const {
    weapon,
    // armor, players,
    creature, biome, backstab, isWet,
  } = state;
  const { item, level, skill, arrow } = weapon;
  const path = `/combat/${creature.id}-vs-${item.id}-${level}-${skill}`
    + (item.slot === 'bow' ? `-${arrow.id}` : '');
  if (history.location.pathname !== path) {
    history.replace(path);
  }
  const onWeaponChange = useStateSelectUpdate(weapons, updateWeapon(statePair));
  const onWeaponLvlChange = useStateNumberUpdate(updateInWeapon(statePair, 'level'));
  const onSkillChange = useStateNumberUpdate(updateInWeapon(statePair, 'skill'));
  const onArrowChange = useStateSelectUpdate(arrows, updateInWeapon(statePair, 'arrow'));
  // const [shield, onShieldChange] = useStateSelectUpdate(shields, updateGeneric(statePair, 'shield'));
  // const onArmorChange = useStateNumberUpdate(updateGeneric(statePair, 'armor'));
  // const onPlayersChange = useStateNumberUpdate(updateGeneric(statePair, 'players'));
  
  const onCreatureChange = useStateInputUpdate(creatureReader, updateCreature(statePair));
  const onChangeBackstab = useStateCheckboxUpdate(updateGeneric(statePair, 'backstab'));
  const onChangeIsWet = useStateCheckboxUpdate(updateGeneric(statePair, 'isWet'));
  // const [stars, onStarsChange] = useStateInputEffect(0, numberReader);  
  // const scale = { players, stars: Math.min(stars, creature.maxLvl - 1) };

  const attackStats = item.attacks.map(a => attackCreature(weapon, a, creature, isWet, backstab));

  return (<>
    <h1>Combat calculator</h1>
    <div className="CombatCalc">
      <div className="Player">
        <h2>{translate('ui.player')}</h2>
        <label className="InputBlock">
          {translate('ui.itemType.weapon')}
          <span className="InputBlock__Gap" />
          <ItemIcon item={item} size={24} />
          <select className="BigInput" onChange={onWeaponChange} value={item.id}>
            {map(weaponGroups, (group, tier) => (<optgroup label={`tier ${tier}`}>
              {group.map(w => <option key={w.id} value={w.id}>{translate(w.id)}</option>)}
            </optgroup>))}
          </select>
          {item.maxLvl > 1 && <>
            <Icon id="star" alt="level" size={16} />
            <input type="number" min="1" max={item.maxLvl} value={level} onChange={onWeaponLvlChange} style={{ width: '3em' }} />
          </>}
        </label>
        {item.slot === 'bow' && <label className="InputBlock">
          {translate('ui.itemType.arrow')}
          <span className="InputBlock__Gap" />
          <ItemIcon item={arrow} size={24} />
          <select className="BigInput" onChange={onArrowChange} value={arrow.id}>
            {arrows.map(a => <option key={a.id} value={a.id}>{translate(a.id)}</option>)}
          </select>
        </label>}
        {item.skill && <label className="InputBlock">
          <span className="col-xs-6 col-sm-3">{translate('ui.skill')}</span>
          <span className="InputBlock__Gap" />
          <SkillIcon skill={item.skill} useAlt size={24} />
          <datalist id="skill">
            <option value="0" />
            <option value="10" />
            <option value="20" />
            <option value="30" />
            <option value="40" />
            <option value="50" />
            <option value="60" />
            <option value="70" />
            <option value="80" />
            <option value="90" />
            <option value="100"/>
          </datalist>
          <input type="range" min="0" max="100" onChange={onSkillChange} value={skill} className="BigInput" list="skill" />
          <input type="number" pattern="[0-9]+" min="0" max="100" onChange={onSkillChange} value={skill} style={{ width: '3em' }} />
        </label>}
        {/*item.slot === 'primary' && <label className="InputBlock">
          {translate('ui.itemType.shield')}
          <span className="InputBlock__Gap" />
          <ItemIcon item={shield} size={24} />
          <select className="BigInput" onChange={onShieldChange} value={shield.id}>
            {shields.map(s => <option key={s.id} value={s.id}>{translate(s.id)}</option>)}
          </select>
        </label>*/}
        {/*<label className="InputBlock">
          {translate('ui.armor')}
          <span className="InputBlock__Gap" />
          <Icon id="armor" alt="" size={24} />
          <input type="number" pattern="[0-9]+" min="0" max="100" onChange={onArmorChange} value={armor} style={{ width: '3em' }} />
          <input type="range" min="0" max="100" onChange={onArmorChange} value={armor} className="BigInput" list="armor" />
          <datalist id="armor">
            <option value="2" label="Rag" />
            <option value="7" label="Leather 1" />
            <option value="14" label="Leather 2" />
            <option value="21" label="Leather 3"/>
            <option value="28" label="Leather" />
            <option value="33" label="Troll" />
            <option value="46" label="Bronze" />
            <option value="64" label="Iron" />
            <option value="82" label="Silver" />
            <option value="100" label="Padded" />
          </datalist>
        </label>*/}
        {/*<label className="InputBlock">
          players
          <span className="InputBlock__Gap" />
          <Icon id="player" alt="" size={24} />
          <input type="number" pattern="[0-9]+" min="1" max="10" onChange={onPlayersChange} value={players} style={{ width: '3em' }} />
          <input type="range" min="1" max="10" onChange={onPlayersChange} value={players} className="BigInput" />
        </label>*/}
      </div>
      <div>
        <h2>Creature</h2>
        <select onChange={onCreatureChange} value={creature.id}>
          {map(
            groupedCreatures,
            (group, gBiome: Biome) => group.length ? (
              <optgroup key={gBiome} label={gBiome}>
                {group.map(c => <option value={c.id} selected={creature === c && biome === gBiome}>{translate(c.id)}</option>)}
              </optgroup>
            ) : null
          )}
        </select>
        <ItemIcon item={creature} size={24} />
        {/*creature.maxLvl &&
          <>
            <br />
            <input id="star-0" type="radio" name="stars" value="0" checked={stars === 0} onChange={onStarsChange} /><label htmlFor="star-0">0⭐</label>
            <input id="star-1" type="radio" name="stars" value="1" checked={stars === 1} onChange={onStarsChange} /><label htmlFor="star-1">1⭐</label>
            <input id="star-2" type="radio" name="stars" value="2" checked={stars === 2} onChange={onStarsChange} /><label htmlFor="star-2">2⭐</label>
        </>*/}
        <br />
        <label htmlFor="wet">
          <input id="wet" type="checkbox" checked={isWet} onChange={onChangeIsWet} />
          {' '}
          wet
        </label>
        {' '}
        <span style={{ color: 'gray' }}>
          (in water, not in rain)
        </span>
        <br />
        <label htmlFor="backstab">
          <input id="backstab" type="checkbox" checked={backstab} onChange={onChangeBackstab} />
          {' '}
          backstab
        </label>
        {' '}
        <Link to="/info/combat#backatb">(?)</Link>
      </div>
    </div>
    {attackStats.map(stats => (
      <div>
        <h2>{translate('ui.attack')}</h2>
        <dl>
          <dt>single hit</dt><dd>{stats.singleHit.map(showNumber).join('–')}</dd>
          <dt>dmg/second</dt><dd>{showNumber(stats.dpSec)}</dd>
          <dt>dmg/stamina</dt><dd>{showNumber(stats.dpSta)}</dd>
          {!!stats.wasteRatio && <>
            <dt>elemental damage waste</dt>
            <dd>{`${Math.round(stats.wasteRatio * 100)}%`}</dd>
          </>}
        </dl>
      </div>
    ))}
  </>);
}