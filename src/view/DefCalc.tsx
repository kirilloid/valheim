import React, { useContext, useReducer } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import '../css/Combat.css';

import type { Biome, Pair, Creature as CreatureT } from '../types';
import { getInitialState, serializeState } from '../model/def_calc.url';
import { actionCreators, reducer } from '../model/def_calc.reducer';
import { allItems, shields } from '../model/def_calc.items';
import { isNotNull, MAX_PLAYERS } from '../model/utils';

import { groupedCreatures } from '../data/combat_creatures';

import { TranslationContext } from '../effects/translation.effect';
import { useDebounceEffect } from '../effects/debounce.effect';
import { Icon, ItemIcon, SkillIcon } from './Icon';
import { addAttackPlayerStats, attackPlayer, AttackPlayerStats, dmgBonus, emptyAttackPlayerStats, isNormalAttackProfile, multiplyDamage, ShieldConfig } from '../model/combat';
import { InlineObjectWithIcon, List, showNumber } from './helpers';
import { useGlobalState } from '../effects';

type OnChange<T extends HTMLElement> = (e: React.ChangeEvent<T>) => void;
type OnChangeI = OnChange<HTMLInputElement>;
type OnChangeS = OnChange<HTMLSelectElement>;

function applyLevel(baseValue: number | Pair<number>, level: number) {
  if (typeof baseValue === 'number') return baseValue;
  return baseValue[0] + baseValue[1] * (level - 1);
}

function statsResult({ min, max, avg }: { min: number; max: number; avg: number }) {
  return `${showNumber(min)}–${showNumber(max)} (${showNumber(avg)})`;
}

function Result({ stats, showBlock }: { stats: AttackPlayerStats; showBlock: boolean }) {
  const translate = useContext(TranslationContext);
  const { instant, overTime } = stats;
  return <dl>
    {showBlock && <>
      <dt>{translate('ui.blockChance')}</dt>
      <dd>{showNumber(stats.blockChance.avg * 100)}%</dd>
    </>}
    {instant.avg ? <>
      <dt>{translate('ui.damage')}</dt>
      <dd>{statsResult(instant)}</dd>
    </> : null}
    {overTime.avg ? <>
      <dt>{translate('ui.damageOverTime')}</dt>
      <dd>{statsResult(overTime)}</dd>
    </> : null}
    {instant.avg && overTime.avg ? <>
      <dt>total</dt>
      <dd>{statsResult({
        min: instant.min + overTime.min,
        avg: instant.avg + overTime.avg,
        max: instant.max + overTime.max,
      })}</dd>
    </> : null}
  </dl>
}

function Creature({ creature, biome, onChange }: { creature: CreatureT; biome: string; onChange: OnChangeS }) {
  const translate = useContext(TranslationContext);
  return <div className="row">
    <select onChange={onChange} value={creature.id}>
      {Object.entries(groupedCreatures).map(([gBiome, group]) =>
        group.length ? (
          <optgroup key={gBiome} label={gBiome}>
            {group.map(c => <option key={`${gBiome}_${c.id}`} value={c.id} selected={creature === c && biome === gBiome}>{translate(c.id)}</option>)}
          </optgroup>
        ) : null
      )}
    </select>
    <ItemIcon item={creature} size={24} />
  </div>
}

function CreatureStars({ stars, max, onChange }: { stars: number; max: number; onChange: OnChangeI }) {
  return <div className="row" key="stars">
    {Array.from({ length: max }).map((_, s) => {
      return <React.Fragment key={s}>
        <input id={`star-${s}`}
          type="radio" name="stars" value={s}
          checked={stars === s} onChange={onChange} />
        <label htmlFor={`star-${s}`}>{s}⭐</label>
      </React.Fragment>
    })}
  </div>;
}

function CreatureAttackVar({ creature, variety, onChange }: { creature: CreatureT, variety: number, onChange: OnChangeI }) {
  return <div className="row" key="variants">
    {creature.attacks.map((a, i) => {
      return <React.Fragment key={a.variety}>
        <input id={`variety-${i}`}
          type="radio" name="variety" value={i}
          checked={variety === i} onChange={onChange} />
        <label htmlFor={`variety-${i}`}>{a.variety}</label>
      </React.Fragment>
    })}
  </div>;
}

function Players({ players, onChange }: { players: number; onChange: OnChangeI }) {
  const translate = useContext(TranslationContext);
  return <div className="row weapon">
    <div className="weapon__label">
      <label htmlFor="players">{translate('ui.players')}</label>
      <Icon id="player" alt="" size={24} />
    </div>
    <div className="weapon__input-primary">
      <input type="range" id="players"
        className="BigInput"
        min="1" max={MAX_PLAYERS} value={players}
        onChange={onChange} />
    </div>
    <div className="weapon__input-secondary">
      <input type="number" inputMode="numeric" pattern="[0-9]*"
        min="1" max={MAX_PLAYERS} value={players}
        onChange={onChange}
        style={{ width: '3em' }} />
    </div>
  </div>;
}

function Wet({ wet, onChange }: { wet: boolean; onChange: OnChangeI }) {
  const translate = useContext(TranslationContext);
  return <div className="row">
    <input id="wet" type="checkbox" checked={wet} onChange={onChange} />
    <label htmlFor="wet">
      {' '}
      {translate('ui.wet')}
    </label>
  </div>
}

function Shield({ shield, onShieldChange, onLevelChange } : {
  shield: ShieldConfig | undefined;
  onShieldChange: OnChangeS;
  onLevelChange: OnChangeI;
}) {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  return <div className="row weapon">
    <div className="weapon__label">
      <label htmlFor="shield">
        {translate('ui.itemType.shield')}
      </label>
      {shield ? <ItemIcon item={shield.item} size={24} /> : null}
    </div>
    <div className={'weapon__input-primary'}>
      <select id="shield"
        className="BigInput"
        onChange={onShieldChange}
        value={shield?.item.id ?? ''}>
        <option value="">—</option>
        {shields
          .filter(s => s.tier <= spoiler)
          .map(s => <option key={s.id} value={s.id}>{translate(s.id)}</option>)}
      </select>
    </div>
    {!!shield && shield.item.maxLvl > 1 && <div className="weapon__input-secondary">
      <input type="number" inputMode="numeric" pattern="[0-9]*"
        min="1" max={shield.item.maxLvl} value={shield.level}
        onChange={onLevelChange}
        style={{ width: '3em' }} />
      <Icon id="star" alt="level" size={16} />
    </div>}
  </div>;
}

function Skill({ shield, onChange }: { shield: ShieldConfig | undefined; onChange: OnChangeI; }) {
  const translate = useContext(TranslationContext);
  if (!shield) return null;
  return <div className="row weapon">
    <div className="weapon__label">
      <label htmlFor="skill">{translate('ui.skill')}</label>
      <SkillIcon skill={shield.item.skill} useAlt size={24} />
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
        min="0" max="100" value={shield.skill}
        onChange={onChange}
        list="skill" />
    </div>
    <div className="weapon__input-secondary">
      <input type="number" inputMode="numeric" pattern="[0-9]*"
        min="0" max="100" value={shield.skill}
        onChange={onChange}
        style={{ width: '3em' }} />
    </div>
  </div>;
}

function Armor({ armor, onChange }: { armor: number; onChange: OnChangeI; }) {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const spoilerArmor = [2, 21, 46, 64, 82, 100];
  return <div className="row weapon">
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
        min="0" max={spoilerArmor[spoiler] ?? 100} value={armor}
        onChange={onChange} />
    </div>
    <div className="weapon__input-secondary">
      <input type="number" inputMode="numeric" pattern="[0-9]*"
        min="0" max={spoilerArmor[spoiler] ?? 100} value={armor}
        onChange={onChange}
        style={{ width: '3em' }} />
    </div>
  </div>
}

function Items({ resTypes, onChange }: { resTypes: string[], onChange: (item: string) => OnChangeI }) {
  const [spoiler] = useGlobalState('spoiler');
  return <>
    {[...allItems.entries()]
      .filter(([, { items }]) => items.some(i => i.tier <= spoiler))
      .map(([hash, { items }]) => <div className="ItemGroup" key={hash}>
        <input type="checkbox" id={hash}
          className="ItemGroup__input"
          checked={resTypes.includes(hash)}
          onChange={onChange(hash)} />
        <label htmlFor={hash}
          className="ItemGroup__label">
          <List separator=" / ">
            {items
              .filter(item => item.tier <= spoiler)
              .map(item => <InlineObjectWithIcon key={item.id} id={item.id} nobr />)}
          </List>
        </label>
      </div>)}
  </>;
}

export function DefenseCalc() {
  const translate = useContext(TranslationContext);
  const history = useHistory();
  const { params } = useParams<{ params?: string }>();
  const [state, dispatch] = useReducer(reducer, getInitialState(params));
  const {
    enemy: { creature, biome, stars, variety },
    shield,
  } = state;

  useDebounceEffect(state, (state) => {
    const path = `/defense/${serializeState(state)}`;
    if (history.location.pathname !== path) {
      history.replace(path);
    }
  }, 200);

  const {
    changeCreature,
    changeStars,
    changeVariety,
    changePlayers,
    changeShield,
    changeLevel,
    changeSkill,
    changeArmor,
    changeIsWet,
    changeResType,
  } = actionCreators;
  
  const onCreatureChange = (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(changeCreature(e.target.value, (e.target.selectedOptions[0]?.parentElement as HTMLOptGroupElement).label as Biome));
  const onStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeStars(Number(e.target.value)));
  const onVarietyChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeVariety(Number(e.target.value)));
  
  const onPlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changePlayers(Number(e.target.value)));
  const onShieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(changeShield(e.target.value));
  const onLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeLevel(Number(e.target.value)));
  const onSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeSkill(Number(e.target.value)));
  const onArmorChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeArmor(Number(e.target.value)));
  const onWetChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeIsWet(e.target.checked));
  const onItemChange = (resType: string) => (e: React.ChangeEvent<HTMLInputElement>) => dispatch(changeResType(resType, e.target.checked));
  const scale = {
    players: state.players,
    stars: Math.min(stars, creature.maxLvl - 1),
  };
  const bonus = dmgBonus(scale);

  const block = shield?.item
    ? applyLevel(shield.item.block, shield.level) * (1 + 0.005 * shield.skill)
    : 0;
  const perfectBlock = block * (shield?.item.parryBonus ?? 1);
  const attacks = creature.attacks[variety]!.attacks.filter(isNormalAttackProfile);
  const resistItems = state.resTypes
    .map(rt => allItems.get(rt)?.damageModifiers)
    .filter(isNotNull);

  const getStats = (block: number) => attacks
    .map(a => attackPlayer(multiplyDamage(a.dmg, bonus), state.isWet, resistItems, state.armor, block))
    .reduce(addAttackPlayerStats, emptyAttackPlayerStats());

  return (<>
    <h1>{translate('ui.page.defense')}</h1>
    <div className="CombatCalc">
      <section className="CombatCalc__Creature">
        <h2>{translate('ui.creature')}</h2>
        <Creature creature={creature} biome={biome} onChange={onCreatureChange} />
        {creature.maxLvl > 1 && <CreatureStars max={creature.maxLvl} stars={stars} onChange={onStarsChange} />}
        {creature.attacks.length > 1 && <CreatureAttackVar creature={creature} variety={variety} onChange={onVarietyChange} />}
      </section>
      <section className="CombatCalc__Player">
        <div className="PlayerHeader">
          <h2 className="PlayerHeader__text">
            {translate('ui.player')}
          </h2>
        </div>
        <Wet wet={state.isWet} onChange={onWetChange} />
        <Players players={state.players} onChange={onPlayersChange} />
        <div className="Weapon">
          <Shield shield={state.shield} onShieldChange={onShieldChange} onLevelChange={onLevelChange} />
          <Skill shield={state.shield} onChange={onSkillChange} />
          <Armor armor={state.armor} onChange={onArmorChange} />
        </div>
        <Items resTypes={state.resTypes} onChange={onItemChange} />
      </section>
      <div className="CombatCalc__Results">
        <h2>Results</h2>
        <h3>No shield</h3>
        <Result stats={getStats(0)} showBlock={false} />
        {block > 0 && !attacks.every(a => a.unblockable) ? <>
          <h3>Block</h3>
          <Result stats={getStats(block)} showBlock={true} />
        </> : null}
        {perfectBlock !== block && !attacks.every(a => a.unblockable) ? <>
          <h3>Parry</h3>
          <Result stats={getStats(perfectBlock)} showBlock={true} />
        </> : null}
      </div>
    </div>
  </>);
}
