import React, { useContext, useReducer } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { groupBy, map } from 'lodash-es';

import '../css/Combat.css';

import type { Biome, Creature } from '../types';

import { creatures } from '../model/creatures';
import { arrows } from '../model/arrows';
import { locationToBiome } from '../model/location';
import { attackCreature, AttackStats, WeaponConfig } from '../model/combat';
import { TranslationContext } from '../translation.effect';
import { Icon, ItemIcon, SkillIcon } from './Icon';
import { Action, actionCreators, ActionCreators, CombatState, defaultWeapon, reducer, enabledItems, CombatStat } from '../model/combat.reducer';
import { showNumber } from './helpers';

const weaponGroups = groupBy(enabledItems, w => w.tier);
// const shields = items.filter(i => !i.disabled && i.type === 'shield') as Shield[]; 

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

type UseCombatState = [CombatState, React.Dispatch<CombatState>];

const weaponRegex = /(\w+)-(\d+)-(\d+)(?:-(\w+))?/;

function parseWeapon(str: string): WeaponConfig {
  const [, id, level, skill, arrow] = str.match(weaponRegex) ?? [];
  const weapon = id && enabledItems.find(w => w.id === id) || enabledItems[0]!;
  return {
    item: weapon,
    level: Number(level) || weapon.maxLvl,
    skill: Number(skill) || 0,
    arrow: arrow && arrows.find(a => a.id === arrow) || arrows[0]!,
  };
}

function serializeWeapon(weapon: WeaponConfig): string {
  return `${weapon.item.id}-${weapon.level}-${weapon.skill}`
         + (weapon.item.slot === 'bow' ? `-${weapon.arrow.id}` : '')
}

function getInitialState(params: string): CombatState {
  const [creature, stat, weaponsStr] = params.split('-', 3);
  const weapons = weaponsStr?.split('-or-').map(parseWeapon) ?? [];
  if (weapons.length === 0) {
    weapons.push(defaultWeapon);
  }
  return {
    weapons,
    // shield: shields[0]!
    // armor: 2,
    // players: 1,
    creature: creatures.find(c => c.id === creature) ?? creatures[0]!,
    biome: 'Meadows',
    backstab: false,
    isWet: false,
    stat: stat as CombatStat,
  };
}

function WeaponBlock(props: {
  weapon: WeaponConfig
  index: number,
  actionCreators: ActionCreators,
  dispatch: React.Dispatch<Action>,
  canDelete: boolean;
}) {
  const { weapon, index, actionCreators, dispatch, canDelete } = props;
  const { item, level, skill, arrow } = weapon;
  const { changeWeapon, changeLevel, changeSkill, changeArrow, removeWeapon } = actionCreators;
  const translate = useContext(TranslationContext);
  return <div className="Weapon">
    <div className="row">
      <div className="row__label">
        <label htmlFor={`weapon${index}`}>
          {translate('ui.itemType.weapon')}
        </label>
        <ItemIcon item={item} size={24} />
      </div>
      <div className="row__input-primary">
        <select id={`weapon${index}`}
          className="BigInput"
          onChange={e => dispatch(changeWeapon(index, e.target.value))}
          value={item.id}>
          {map(weaponGroups, (group, tier) => (<optgroup label={`tier ${tier}`}>
            {group.map(w => <option key={w.id} value={w.id}>{translate(w.id)}</option>)}
          </optgroup>))}
        </select>
      </div>
      {item.maxLvl > 1 && <div className="row__input-secondary">
        <input type="number"
          min="1" max={item.maxLvl} value={level}
          onChange={e => dispatch(changeLevel(index, Number(e.target.value)))}
          style={{ width: '3em' }} />
        <Icon id="star" alt="level" size={16} />
      </div>}
    </div>
    {item.slot === 'bow' &&
    <div className="row">
      <div className="row__label">
        <label htmlFor={`arrow${index}`}>
          {translate('ui.itemType.arrow')}
        </label>
        <ItemIcon item={arrow} size={24} />
      </div>
      <div className="row__input-primary">
        <select id={`arrow${index}`}
          className="BigInput"
          onChange={e => dispatch(changeArrow(index, e.target.value))} value={arrow.id}>
          {arrows.map(a => <option key={a.id} value={a.id}>{translate(a.id)}</option>)}
        </select>
      </div>
    </div>}
    {item.skill && <div className="row">
      <div className="row__label">
        <label htmlFor={`skill${index}`}>{translate('ui.skill')}</label>
        <SkillIcon skill={item.skill} useAlt size={24} />
      </div>
      <div className="row__input-primary">
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
        <input type="range" id={`skill${index}`}
          className="BigInput"
          min="0" max="100" value={skill}
          onChange={e => dispatch(changeSkill(item.skill!, Number(e.target.value)))}
          list="skill" />
      </div>
      <div className="row__input-secondary">
        <input type="number" pattern="[0-9]+"
          min="0" max="100" value={skill}
          onChange={e => dispatch(changeSkill(item.skill!, Number(e.target.value)))}
          style={{ width: '3em' }} />
      </div>
    </div>}
    {canDelete && <div className="row">
      <input type="button" value="delete" onClick={() => dispatch(removeWeapon(index))} />
    </div>}
  </div>
}

function pickStat(stats: AttackStats, stat: CombatStat, creature: Creature): number {
  switch (stat) {
    case 'single':
      return stats.singleHit[1];
    case 'hits':
      return Math.ceil(creature.hp / stats.singleHit[0]);
    case 'dps':
      return stats.dpSec;
    case 'dpsta':
      return stats.dpSta;
  }
}

function showStat(stats: AttackStats, stat: CombatStat, creature: Creature): string {
  switch (stat) {
    case 'single':
      return stats.singleHit.map(showNumber).join(' – ');
    case 'hits':
      return showNumber(Math.ceil(creature.hp / stats.singleHit[0]));
    case 'dps':
      return showNumber(stats.dpSec);
    case 'dpsta':
      return showNumber(stats.dpSta);
  }
}

function StatBar(props: {
  stats: AttackStats;
  stat: CombatStat;
  creature: Creature;
  max: number;
}) {
  const { stats, stat, creature, max } = props;
  const percent = pickStat(stats, stat, creature) / max * 100;
  return <div className={`StatBar StatBar--${stat}`} style={{ width: `${percent}%` }}>
    {showStat(stats, stat, creature)}
  </div>
}

export function Combat() {
  const translate = useContext(TranslationContext);
  const history = useHistory();
  const { params } = useParams<{ params: string }>();
  const [state, dispatch] = useReducer(reducer, getInitialState(params));
  const {
    weapons,
    // armor, players,
    creature, biome, backstab, isWet,
    stat,
  } = state;
  const path = `/combat/${creature.id}-${stat}-${weapons.map(serializeWeapon).join('-or-')}`;
  if (history.location.pathname !== path) {
    history.replace(path);
  }
  // const [shield, onShieldChange] = useStateSelectUpdate(shields, updateGeneric(statePair, 'shield'));
  // const onArmorChange = useStateNumberUpdate(updateGeneric(statePair, 'armor'));
  // const onPlayersChange = useStateNumberUpdate(updateGeneric(statePair, 'players'));
  const {
    changeCreature,
    changeBackstab,
    changeIsWet,
    changeStat,
  } = actionCreators;
  
  const onCreatureChange = (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(changeCreature(e.target.value, (e.target.selectedOptions[0]?.parentElement as HTMLOptGroupElement).label as Biome));
  const onChangeBackstab = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeBackstab(e.target.checked));
  const onChangeIsWet = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeIsWet(e.target.checked));
  const onChangeStat = (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(changeStat(e.target.value as any));
  // const [stars, onStarsChange] = useStateInputEffect(0, numberReader);  
  // const scale = { players, stars: Math.min(stars, creature.maxLvl - 1) };
  const attackStats = weapons.map(w => w.item.attacks.map(a => attackCreature(w, a, creature, isWet, backstab)));
  const maxStat = Math.max(...attackStats.flatMap(ws => ws.map(s => pickStat(s, stat, creature))));

  return (<>
    <h1>Combat calculator</h1>
    <div className="CombatCalc">
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
      <div className="Player">
        <h2>
          {translate('ui.player')}
          <select style={{ float: 'right' }} value={stat} onChange={onChangeStat}>
            <option value="single">single hit</option>
            <option value="hits">hits to kill</option>
            <option value="dps">dmg/second</option>
            <option value="dpsta">dmg/stamina</option>
          </select>
        </h2>
        {weapons.map((w, i) => {
          return <div className="CompareBlock">
            <WeaponBlock weapon={w} key={i} index={i}
              canDelete={weapons.length > 1}
              actionCreators={actionCreators}
              dispatch={dispatch} />
            <div className="Attack">
              {attackStats[i]!.map((stats, i) =>
                <StatBar key={i} stats={stats} stat={stat} max={maxStat} creature={creature} />
              )}
            </div>
          </div>;
        })}
        {<input type="button" value="add another"
          onClick={() => dispatch(actionCreators.addWeapon())} />}
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
    </div>
  </>);
}