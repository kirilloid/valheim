import React, { useContext, useReducer } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { map } from 'lodash-es';

import '../css/Combat.css';

import type { Biome } from '../types';

import { locationToBiome } from '../model/location';
import { groupedCreatures } from '../model/combat_creatures';
import { TranslationContext } from '../effects/translation.effect';
import { useDebounceEffect } from '../effects/debounce.effect';
import { Icon, ItemIcon, SkillIcon } from './Icon';
import { actionCreators, defaultCreature, reducer, shields, State } from '../model/def_calc.reducer';

function getInitialState(params?: string): State {
  return {
    creature: defaultCreature,
    biome: locationToBiome(defaultCreature.locations[0]!),
    stars: 0,

    isWet: false,
    shield: shields[0]!,
    level: 3,
    blocking: 0,
    armor: 0,
    players: 1,
  };
}

export function DefenseCalc() {
  const translate = useContext(TranslationContext);
  const history = useHistory();
  const { params } = useParams<{ params?: string }>();
  const [state, dispatch] = useReducer(reducer, getInitialState(params));
  const {
    creature,
    biome,
    stars,

    isWet,
    players,
    shield,
    level,
    blocking,
    armor,
  } = state;

  // const onArmorChange = useStateNumberUpdate(updateGeneric(statePair, 'armor'));
  // const onPlayersChange = useStateNumberUpdate(updateGeneric(statePair, 'players'));
  const {
    changeCreature,
    changeStars,
    changeShield,
    changeLevel,
    changeSkill,
    changeArmor,
    changeIsWet,
  } = actionCreators;
  
  const onCreatureChange = (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(changeCreature(e.target.value, (e.target.selectedOptions[0]?.parentElement as HTMLOptGroupElement).label as Biome));
  const onStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeStars(Number(e.target.value)));

  const onShieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(changeShield(e.target.value));
  const onLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeLevel(Number(e.target.value)));
  const onSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeSkill(Number(e.target.value)));
  const onArmorChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeArmor(Number(e.target.value)));
  const onWetChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeIsWet(e.target.checked));
  const scale = { players, stars: Math.min(stars, creature.maxLvl - 1) };

return (<>
    <h1>{translate('ui.page.defense')}</h1>
    <div className="CombatCalc">
      <div className="CombatCalc__Creature">
        <h2>Creature</h2>
        <div className="row">
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
          {creature.maxLvl > 1 &&
            <>
              {Array.from({ length: creature.maxLvl }).map((_, s) => {
                return <>
                  <input id={`star-${s}`} key={`i${s}`}
                    type="radio" name="stars" value={s}
                    checked={stars === s} onChange={onStarsChange} />
                  <label key={`l${s}`} htmlFor={`star-${s}`}>{s}⭐</label>
                </>
              })}
            </>
          }
        </div>
        <div className="row">
          <input id="wet" type="checkbox" checked={isWet} onChange={onWetChange} />
          <label htmlFor="wet">
            {' '}
            wet
          </label>
        </div>
      </div>
      <div className="CombatCalc__Player">
        <div className="row PlayerHeader">
          <h2 className="PlayerHeader__text">
            {translate('ui.player')}
          </h2>
        </div>
        <div className="Weapon">
          <div className="row weapon">
            <div className="weapon__label">
              <label htmlFor="shield">
                {translate('ui.itemType.weapon')}
              </label>
              <ItemIcon item={shield} size={24} />
            </div>
            <div className={'weapon__input-primary'}>
              <select id="shield"
                className="BigInput"
                onChange={onShieldChange}
                value={shield.id}>
                {shields.map(s => <option key={s.id} value={s.id}>{translate(s.id)}</option>)}
              </select>
            </div>
            {shield.maxLvl > 1 && <div className="weapon__input-secondary">
              <input type="number" inputMode="numeric" pattern="[0-9]*"
                min="1" max={shield.maxLvl} value={level}
                onChange={onLevelChange}
                style={{ width: '3em' }} />
              <Icon id="star" alt="level" size={16} />
            </div>}
          </div>
          <div className="row weapon">
            <div className="weapon__label">
              <label htmlFor="skill">{translate('ui.skill')}</label>
              <SkillIcon skill={shield.skill} useAlt size={24} />
            </div>
            <div className="weapon__input-primary">
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
              <input type="range" id="skill"
                className="BigInput"
                min="0" max="100" value={blocking}
                onChange={onSkillChange}
                list="skill" />
            </div>
            <div className="weapon__input-secondary">
              <input type="number" inputMode="numeric" pattern="[0-9]*"
                min="0" max="100" value={blocking}
                onChange={onSkillChange}
                style={{ width: '3em' }} />
            </div>
          </div>
          <div className="row weapon">
            <div className="weapon__label">
              <label htmlFor="armor">{translate('ui.armor')}</label>
              <Icon id="armor" alt="" size={24} />
            </div>
            <div className="weapon__input-primary">
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
              <input type="range" id="skill"
                className="BigInput" list="armor"
                min="0" max="100" value={armor}
                onChange={onArmorChange} />
            </div>
            <div className="weapon__input-secondary">
              <input type="number" inputMode="numeric" pattern="[0-9]*"
                min="0" max="100" value={armor}
                onChange={onArmorChange}
                style={{ width: '3em' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}
