import React, { useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import '../../css/FoodPlanner.css';

import type { Biome, Food, GameObject, Resource, SimpleDrop } from '../../types';
import { days, isNotNull, groupBy, mapValues, assertNever } from '../../model/utils';
import { BASE_EITR, BASE_HEALTH, BASE_STAMINA, MAX_PLAYERS } from '../../model/game';
import { addDrop } from '../../model/dist';

import { resources } from '../../data/resources';
import { data } from '../../data/itemDB';
import { recipes } from '../../data/recipes';

import { TranslationContext, useRuneTranslate, useDebounceEffect, useGlobalState } from '../../effects';
import { InlineObjectWithIcon, showNumber } from '../helpers';
import { Icon, ItemIcon } from '../parts/Icon';

import { defaultState, pageName, parseState, serializeState } from '../../state/food-planner';

type FoodItem = Resource & { Food: Food };

function isFood(item: Resource): item is FoodItem {
  return item.Food != null;
}

const foods = resources.filter(isFood).filter(i => !i.disabled);
const foodMap = new Map(foods.map(f => [f.id, f]));

const FoodOptions = React.memo(() => {
  const [spoiler] = useGlobalState('spoiler');
  const runeTranslate = useRuneTranslate();
  return <>
    <option value="" className="FoodOption--even">&mdash;</option>
    {foods
      .filter(food => food.tier <= spoiler)
      .map(food =>
        <option key={food.id} value={food.id}
          className={food.tier % 2 ? 'FoodOption--even' : 'FoodOption--odd'}
        >{runeTranslate(food)}
      </option>)}
  </>;
});

function getItemResources(item: GameObject | undefined): SimpleDrop {
  if (item == null) return {};
  if (item.type !== 'item') return { [item.id]: 1 };
  const recipe = recipes.find(r => r.item === item.id);
  switch (recipe?.type) {
    case undefined: 
      return { [item.id]: 1 };
    case 'trader':
      return { [item.id]: recipe.number };
    case 'craft':
      return Object.entries(recipe.materials)
        .reduce((total, [res, num]) => addDrop(total, getItemResources(data[res]), num / recipe.number), {});
    default:
      return assertNever(recipe);
  }
}

function getFoodResourcesPerDay(item: FoodItem | undefined): SimpleDrop {
  if (item == null) {
    return {};
  }
  const t = 1 / days(item.Food.duration);
  const recipe = recipes.find(r => r.item === item.id);
  switch (recipe?.type) {
    case undefined: 
    case 'trader':
      return { [item.id]: t };
    case 'craft':
      return mapValues(getItemResources(item), v => v * t);
    default:
      return assertNever(recipe);
  }
}

function updateAtIndex<T extends any[]>(array: T, idx: number, val: T[number]): T {
  // const idxOld = val ? array.indexOf(val) : -1;
  const copy = array.slice();
  // if (idxOld === -1) {
    copy[idx] = val;
    return copy as T;
/*  }
  copy[idxOld] = copy[idx];
  copy[idx] = val;
  return copy as T; */
}

function FoodSelector(props: {
  state: Foods;
  setState: (state: Foods) => void;
  idx: number;
  error: boolean | undefined;
}) {
  const { state, idx } = props;
  return <>
    <select
      className={props.error ? 'FoodSelector--error' : ''}
      value={state[idx]?.id ?? ''}
      onChange={e => props.setState(updateAtIndex(state, idx, foodMap.get(e.target.value)))}
    >
      <FoodOptions />
    </select>
  </>
}

function Radio(props: { val: number, repeat: number, setRepeat: (val: number) => void, children?: React.ReactNode[] | string }) {
  const { val } = props;
  return <label>
    <input type="radio" name="repeat"
      className="FoodPlanner__radio"
      checked={props.repeat === val}
      value={val} onChange={() => props.setRepeat(val)} />
    {props.children}
  </label>;
}

const bestTypes = {
  maxHp: (item: FoodItem) => item.Food.health,
  balance: (item: FoodItem) => item.Food.health + item.Food.stamina,
  maxSta: (item: FoodItem) => item.Food.stamina,
  eitr: (item: FoodItem) => item.Food.eitr ?? 0,
};

function bestFoods(maxTier: number, benefitFn: (food: FoodItem) => number): [FoodItem, FoodItem, FoodItem] {
  return foods
    .filter(f => f.tier <= maxTier)
    .sort((a, b) => benefitFn(b) - benefitFn(a))
    .slice(0, 3)
    .sort((a, b) => a.id.localeCompare(b.id)) as [FoodItem, FoodItem, FoodItem];
}

type Foods = [
  FoodItem | undefined,
  FoodItem | undefined,
  FoodItem | undefined,
];

export function FoodPlanner() {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const runeTranslate = useRuneTranslate();
  const history = useHistory();
  const { params } = useParams<{ params?: string }>();
  const [state, setState] = useState({ ...defaultState, ...parseState(params) });
  const {
    foods,
    nightEat,
    players,
    days: daysDuration,
    repeat,
  } = state;
  const setSelectedFoods = (foods: Foods) => setState({ ...state, foods: foods.map(f => f ? f.id : '') as [string, string, string] })
  const setNightEat = (nightEat: boolean) => setState({ ...state, nightEat });
  const setPlayers = (players: number) => setState({ ...state, players });
  const setDaysDuration = (days: number) => setState({ ...state, days });
  const setRepeat = (repeat: number) => setState({ ...state, repeat });
  const selectedFoods = foods.map(id => foodMap.get(id)) as Foods;
  const foodCount = groupBy(foods, x => x);
  const wrongFoods = foods.map(id => !!id && (foodCount[id]?.length ?? 0) > 1);

  useDebounceEffect(state, (st) => {
    const fullPath = `/${pageName}/${serializeState(st)}`;
    if (history.location.pathname !== fullPath) {
      history.replace(fullPath);
    };
  }, 100);

  const totalRes = selectedFoods.reduce<SimpleDrop>((a, b) => addDrop(a, getFoodResourcesPerDay(b)), {});
  const totalFood = Object.fromEntries(
    selectedFoods
      .filter(isNotNull)
      .map(f => [f.id, 1 / days(f.Food.duration)])
  );
  const mul = (nightEat ? 1 : 0.7) * players * daysDuration * repeat;

  const biomes: Biome[] = ['Meadows', 'BlackForest', 'Swamp', 'Mountain', 'Plains', 'Mistlands', 'Ashlands'];

  return (<>
    <h1>{translate('ui.page.food-planner')}</h1>
    <h2>{translate('ui.pickFoods')}</h2>
    <div className="FoodPresets">
      <div className="FoodPresets__cell FoodPresets__title FoodPresets__title--initial">{translate('ui.biome')}</div>
      {Object.keys(bestTypes).map(key =>
        <div className="FoodPresets__cell FoodPresets__title" key={key}>{translate(`ui.bestFood.${key}`)}</div>
      )}
      {biomes
        .filter((_, tier) => tier <= spoiler)
        .map((biome, idx) => {
          const tier = idx + 1;
          return <React.Fragment key={biome}>
            <div className="FoodPresets__cell FoodPresets__biome">{runeTranslate({ tier, type: 'biome', id: `ui.biome.${biome}` })}</div>
            {Object.entries(bestTypes).map(([key, fn]) => {
              const bestFood = bestFoods(tier, fn);
              return <div className="FoodPresets__cell FoodPresets__button" key={key}>
                <button type="button" onClick={() => setSelectedFoods(bestFood)}>
                  {bestFood.map(f => <ItemIcon key={f.id} item={f} useAlt size={24} />)}
                </button>
              </div>;
            })}
          </React.Fragment>;
        })}
    </div>
    <table className="FoodPlanner">
      <thead>
        <tr>
          <th></th>
          <th>{translate('ui.itemType.food')}</th>
          <th className="FoodPlanner__value">hp <Icon id="health" size={16} alt="" /></th>
          <th className="FoodPlanner__value">sta <Icon id="walknut" size={16} alt="" /></th>
          <th className="FoodPlanner__value">eitr 🟣</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td>{translate('ui.baseValue')}</td>
          <td className="FoodPlanner__value">{BASE_HEALTH}</td>
          <td className="FoodPlanner__value">{BASE_STAMINA}</td>
          <td className="FoodPlanner__value">{BASE_EITR}</td>
        </tr>
        {[0, 1, 2].map(idx => <tr key={idx}>
          <td><ItemIcon key={idx} item={selectedFoods[idx]} className={(selectedFoods[idx]?.tier ?? 0) > spoiler ? 'spoiler' : ''} /></td>
          <td className="FoodPlanner__select"><FoodSelector key={idx} state={selectedFoods} setState={setSelectedFoods} idx={idx} error={wrongFoods[idx]} /></td>
          <td className="FoodPlanner__value">{selectedFoods[idx]?.Food.health}</td>
          <td className="FoodPlanner__value">{selectedFoods[idx]?.Food.stamina}</td>
          <td className="FoodPlanner__value">{selectedFoods[idx]?.Food.eitr ?? '—'}</td>
        </tr>)}
      </tbody>
      <tfoot>
        <tr>
          <th>&Sigma;</th>
          <th>{translate('ui.total')}</th>
          <th className="FoodPlanner__value">{selectedFoods.reduce((a, b) => a + (b?.Food.health ?? 0), BASE_HEALTH)}</th>
          <th className="FoodPlanner__value">{selectedFoods.reduce((a, b) => a + (b?.Food.stamina ?? 0), BASE_STAMINA)}</th>
          <th className="FoodPlanner__value">{selectedFoods.reduce((a, b) => a + (b?.Food.eitr ?? 0), BASE_EITR) || '—'}</th>
        </tr>
      </tfoot>
    </table>
    <hr style={{ width: '100%' }} />
    <div>
      <h2>{translate('ui.repEat')}</h2>
      <input id="nightEat"
        type="checkbox"
        checked={nightEat}
        onChange={e => setNightEat(e.target.checked)}
      />
      <label htmlFor="nightEat">{translate('ui.nightEat')}</label> {translate('ui.nightEat.extra')}
    </div>
    <div>
    {translate('ui.repEat.when')}
      <br /><Radio key={0} val={2} repeat={repeat} setRepeat={setRepeat}>{translate('ui.repEat.maximum')}</Radio>
      <br /><Radio key={1} val={1} repeat={repeat} setRepeat={setRepeat}>{translate('ui.repEat.moderate')}</Radio>
      <br /><Radio key={2} val={0.5} repeat={repeat} setRepeat={setRepeat}>{translate('ui.repEat.rarely')}</Radio>
    </div>
    {translate('ui.repEat.planTime')}
    <div>
      <input id="players" className="FoodPlanner__range"
        type="range" min="1" max={MAX_PLAYERS} value={players}
        onChange={e => setPlayers(Number(e.target.value))}
      />
      {' '}
      <input className="FoodPlanner__numeric"
        type="number" min="1" max={MAX_PLAYERS} value={players}
        onChange={e => setPlayers(Number(e.target.value))}
      />
      {' '}
      <label htmlFor="players">{translate('ui.players')}</label>
    </div>
    <div>
      <input id="days" className="FoodPlanner__range"
        type="range" min="1" max="100" value={daysDuration}
        onChange={e => setDaysDuration(Number(e.target.value))}
      />
      {' '}
      <input className="FoodPlanner__numeric"
        type="number" min="1" max="100" value={daysDuration}
        onChange={e => setDaysDuration(Number(e.target.value))}
      />
      {' '}
      <label htmlFor="days">{translate('ui.days')}</label>
    </div>
    <hr style={{ width: '100%' }} />
    <div className="FoodTotals">
      <div className="FoodTotals__section">
        <h2>{translate('ui.itemType.food')}</h2>
        <ul>{Object.entries(totalFood).map(([key, val]) => 
          <li key={key}><InlineObjectWithIcon id={key} /> {showNumber(val * mul)}</li>)}</ul>
      </div>
      <div className="FoodTotals__section">
        <h2>{translate('ui.resources')}</h2>
        <ul>{Object.entries(totalRes).map(([key, val]) => 
          <li key={key}><InlineObjectWithIcon id={key} /> {showNumber(val * mul)}</li>)}</ul>
      </div>
    </div>
  </>);
}