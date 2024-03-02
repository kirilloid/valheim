import React, { useContext, useReducer, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import classNames from 'classnames';

import '../../css/Combat.css';

import type { Arrow, Biome, Creature, Weapon } from '../../types';
import { attackCreature, AttackStats, WeaponConfig } from '../../model/combat';
import { Action, actionCreators, ActionCreators, reducer, enabledItems, CombatStat } from '../../state/off-calc/reducer';
import { parseState, serializeState, pageName } from '../../state/off-calc';
import { groupBy } from '../../model/utils';
import { SkillType } from '../../model/skills';

import { arrows } from '../../data/arrows';
import { biomeTiers } from '../../data/location';
import { groupedCreatures } from '../../data/combat_creatures';

import { TranslationContext, useGlobalState, useDebounceEffect, useRuneTranslate, GameSettingsContext } from '../../effects';
import { showNumber } from '../helpers';
import { Icon, ItemIcon, SkillIcon } from '../parts/Icon';
import { SpoilerAlert } from '../parts/Spoiler';

const weaponGroups = groupBy(enabledItems, w => String(w.tier));

interface SameWeaponConfig {
  item: boolean;
  level: boolean;
  skillType: boolean;
  skillLevel: boolean;
  arrow: boolean;
}

const getArrowFilter = (item: Weapon): ((a: Arrow) => boolean) => {
  switch (item.skill) {
    case SkillType.Bows: return (a: Arrow) => a.type === 'arrow';
    case SkillType.Crossbows: return (a: Arrow) => a.type === 'bolt';
    default: return () => false;
  }
};

function WeaponBlock(props: {
  weapon: WeaponConfig;
  index: number;
  maxTier: number;
  smart: boolean;
  same: SameWeaponConfig;
  actionCreators: ActionCreators;
  dispatch: React.Dispatch<Action>;
  canDelete: boolean;
}) {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const runeTranslate = useRuneTranslate();
  const { weapon, index, maxTier, smart, same, actionCreators, dispatch, canDelete } = props;
  const { item, level, skill, arrow } = weapon;
  const { changeWeapon, changeLevel, changeSkill, changeArrow, removeWeapon } = actionCreators;
  return <div className="Weapon">
    <div className="row weapon">

      <div className={classNames(
        'weapon__label',
        'weapon__item',
        { 'weapon__item--same': same.item && same.level },
      )}>
        <label htmlFor={`weapon${index}`}>
          {translate('ui.itemType.weapon')}
        </label>
        <ItemIcon item={item} size={24} />
      </div>
      <div className={classNames(
        'weapon__input-primary',
        'weapon__item',
        { 'weapon__item--same': same.item },
      )}>
        <select id={`weapon${index}`}
          className="BigInput"
          onChange={e => dispatch(changeWeapon(index, e.target.value, smart))}
          value={item.id}>
          {Object.entries(weaponGroups)
            .filter(([tier]) => Number(tier) <= spoiler)
            .map(([tier, group]) => (<optgroup
              key={tier}
              label={`tier ${tier}`}
              className={Number(tier) > maxTier ? 'disabled' : ''}
            >
              {group.map(w => <option
                key={w.id}
                value={w.id}
              >{runeTranslate(w)}</option>)}
            </optgroup>))}
        </select>
      </div>
      {item.maxLvl > 1 && <div className={classNames(
        'weapon__input-secondary',
        'weapon__item',
        { 'weapon__item--same': same.level },
      )}>
        <input type="number" inputMode="numeric" pattern="[0-9]*"
          min="1" max={item.maxLvl} value={level}
          onChange={e => dispatch(changeLevel(index, Number(e.target.value)))}
          style={{ width: '3em' }} />
        <Icon id="star" alt="level" size={16} />
      </div>}
    </div>
    {item.slot === 'bow' &&
    <div className="row weapon">
      <div className={classNames(
        'weapon__label',
        'weapon__item',
        { 'weapon__item--same': same.arrow },
      )}>
        <label htmlFor={`arrow${index}`}>
          {translate('ui.itemType.ammo')}
        </label>
        <ItemIcon item={arrow} size={24} />
      </div>
      <div className={classNames(
        'weapon__input-primary',
        'weapon__item',
        { 'weapon__item--same': same.arrow },
      )}>
        <select id={`arrow${index}`}
          className="BigInput"
          onChange={e => dispatch(changeArrow(index, e.target.value))} value={arrow.id}>
          {arrows
            .filter(getArrowFilter(item))
            .filter(a => a.tier <= spoiler)
            .map(a => <option key={a.id} value={a.id} className={a.tier > maxTier ? 'disabled' : ''}>
              {runeTranslate(a)}
            </option>)}
        </select>
      </div>
    </div>}
    {item.skill && <div className="row weapon">
      <div className={classNames(
        'weapon__label',
        'weapon__item',
        { 'weapon__item--same': same.skillType },
      )}>
        <label htmlFor={`skill${index}`}>{translate('ui.skill')}</label>
        <SkillIcon skill={SkillType[item.skill]!} useAlt size={24} />
      </div>
      <div className={classNames(
        'weapon__input-primary',
        'weapon__item',
        { 'weapon__item--same': same.skillLevel },
      )}>
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
          className="range BigInput"
          min="0" max="100" value={skill}
          onChange={e => dispatch(changeSkill(index, Number(e.target.value), smart))}
          list="skill" />
      </div>
      <div className={classNames(
        'weapon__input-secondary',
        'weapon__item',
        { 'weapon__item--same': same.skillLevel },
      )}>
        <input type="number" inputMode="numeric" pattern="[0-9]*"
          min="0" max="100" value={skill}
          onChange={e => dispatch(changeSkill(index, Number(e.target.value), smart))}
          style={{ width: '3em' }} />
      </div>
    </div>}
    <input type="button" value="×" title="remove weapon"
      className="weapon-btn weapon-btn--delete btn btn--lg btn--danger"
      disabled={!canDelete}
      onClick={() => dispatch(removeWeapon(index))} />
  </div>
}

function pickStat(stats: AttackStats, stat: CombatStat, creature: Creature): number {
  switch (stat) {
    case 'single':
      return stats.singleHit[1];
    case 'hits':
      return Math.ceil(creature.hp / stats.averageHit[0]);
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
      return [
        creature.hp / stats.averageHit[1],
        creature.hp / stats.averageHit[0],
      ].map(x => showNumber(Math.ceil(x)))
        .join(' – ');
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

export function AttackCalc() {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const { worldlevel } = useContext(GameSettingsContext);

  const runeTranslate = useRuneTranslate();
  const history = useHistory();
  const { params } = useParams<{ params?: string }>();
  const [state, dispatch] = useReducer(reducer, parseState(params));
  const [smart] = useState(true);
  const {
    weapons,
    // armor, players,
    creature, biome, backstab, isWet,
    stat,
  } = state;
  useDebounceEffect(state, (state) => {
    const path = `/${pageName}/${serializeState(state)}`;
    if (history.location.pathname !== path) {
      history.replace(path);
    }
  }, 200);
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
  const attackStats = weapons.map(w => w.item.attacks.map(a => attackCreature(w, a, creature, worldlevel, isWet, backstab)));
  const maxStat = Math.max(...attackStats.flatMap(ws => ws.map(s => pickStat(s, stat, creature))));

  function areTheSame<T>(weapons: WeaponConfig[], reader: (w: WeaponConfig) => T): boolean {
    if (weapons.length < 2) return false;
    const firstValue = reader(weapons[0]!);
    return weapons.every(w => reader(w) === firstValue);
  }

  const sameItem = areTheSame(weapons, w => w.item);
  const sameLevel = areTheSame(weapons, w => w.level);
  const sameSkillLevel = areTheSame(weapons, w => w.skill);
  const sameSkillType = areTheSame(weapons, w => w.item.skill);
  const bows = weapons.filter(w => w.item.slot === 'bow');
  const sameArrow = areTheSame(bows, w => w.arrow);

  const same = {
    item: sameItem,
    level: sameItem && sameLevel,
    skillLevel: sameSkillType && sameSkillLevel,
    skillType: sameSkillType,
    arrow: sameArrow,
  };

  const maxTier = Math.max(creature.tier, ...weapons.map(w => w.item.tier));

  return (<>
    <SpoilerAlert tier={maxTier} />
    <h1>{translate('ui.page.attack')}</h1>
    <div className="CombatCalc">
      <div className="CombatCalc__Creature">
        <h2>{translate('ui.creature')}</h2>
        <div className="row">
          <select onChange={onCreatureChange} value={creature.id}>
            {Object.entries(groupedCreatures)
              .filter(([gBiome]) => (biomeTiers[gBiome] ?? 0) <= spoiler)
              .map(([gBiome, group]) => group.length ? (
                  <optgroup key={gBiome} label={gBiome}>
                    {group.map(c => <option key={c.id}
                      value={c.id}
                      selected={creature === c && biome === gBiome}
                    >{runeTranslate(c)}</option>)}
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
        </div>
        <div className="row">
          <input id="wet" type="checkbox" checked={isWet} onChange={onChangeIsWet} />
          <label htmlFor="wet">
            {' '}
            {translate('ui.wet')}
          </label>
          {' '}
          <span style={{ color: 'gray' }}>
            ({translate('ui.wetOnlyInWater')})
          </span>
        </div>
        <div className="row">
          <input id="backstab" type="checkbox" checked={backstab} onChange={onChangeBackstab} />
          <label htmlFor="backstab">
            {' '}
            {translate('ui.backstab')}
          </label>
          {' '}
          <Link to="/info/combat#backatb">ℹ️</Link>
        </div>
      </div>
      <div className="CombatCalc__Player">
        <div className="row PlayerHeader">
          <h2 className="PlayerHeader__text">
            {translate('ui.player')}
          </h2>
          <div className="PlayerHeader__stat">
            <select value={stat} onChange={onChangeStat}>
              <option value="single">{translate('ui.attackStat.single')}</option>
              <option value="hits">{translate('ui.attackStat.hits')}</option>
              <option value="dps">{translate('ui.attackStat.dps')}</option>
              <option value="dpsta">{translate('ui.attackStat.dpsta')}</option>
            </select>
          </div>
        </div>
        <div role="list">
          {weapons.map((w, i) => {
            return <div className="CompareBlock" role="listitem">
              <WeaponBlock weapon={w} key={i} index={i}
                smart={smart}
                same={same}
                maxTier={creature.tier}
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
        </div>
        <div style={{ position: 'relative' }}>
          <input type="button" value="+" title="add another weapon"
            className="weapon-btn weapon-btn--add btn btn--lg btn--info"
            onClick={() => dispatch(actionCreators.addWeapon())} />
        </div>
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
          <input type="number" inputMode="numeric" pattern="[0-9]*" min="0" max="100" onChange={onArmorChange} value={armor} style={{ width: '3em' }} />
          <input type="range" min="0" max="100" onChange={onArmorChange} value={armor} className="range BigInput" list="armor" />
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
          <input type="number" pattern="[0-9]+" min="1" max={MAX_PLAYERS} onChange={onPlayersChange} value={players} style={{ width: '3em' }} />
          <input type="range" min="1" max={MAX_PLAYERS} onChange={onPlayersChange} value={players} className="range BigInput" />
        </label>*/}
      </div>
    </div>
  </>);
}
