import React, { useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import '../css/FoodPlanner.css';

import type { Biome, Food, GameObject, Item, SimpleDrop } from '../types';
import { BASE_HEALTH, BASE_STAMINA, days, isNotNull, MAX_PLAYERS, groupBy, mapValues } from '../model/utils';
import { addDrop } from '../model/dist';

import { resources } from '../data/resources';
import { area } from '../data/location';
import { data } from '../data/itemDB';

import { TranslationContext, useRuneTranslate, useDebounceEffect, useGlobalState } from '../effects';
import { InlineObjectWithIcon, showNumber } from './helpers';
import { Icon, ItemIcon } from './Icon';

function isFood(item: Item): item is Food {
  return item.type === 'food';
}

const foods = resources.filter(isFood);
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
  if (item.type !== 'item' && item.type !== 'food') return { [item.id]: 1 };
  const { recipe } = item;
  if (recipe?.type !== 'craft_one') return { [item.id]: 1 };
  return Object.entries(recipe.materials)
    .reduce((total, [res, num]) => addDrop(total, getItemResources(data[res]), num / recipe.number), {});
}

function getFoodResourcesPerDay(food: Food | undefined): SimpleDrop {
  if (food == null) {
    return {};
  }
  const t = 1 / days(food.duration);
  const { recipe } = food; 
  if (recipe?.type !== 'craft_one') {
    return { [food.id]: t };
  }
  return mapValues(getItemResources(food), v => v * t);
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
  maxHp: (food: Food) => food.health,
  balance: (food: Food) => food.health + food.stamina,
  maxSta: (food: Food) => food.stamina,
};

function bestFoods(maxTier: number, useFn: (food: Food) => number): [Food, Food, Food] {
  return foods
    .filter(f => f.tier <= maxTier)
    .sort((a, b) => useFn(b) - useFn(a))
    .slice(0, 3)
    .sort((a, b) => a.id.localeCompare(b.id)) as [Food, Food, Food];
}

type Foods = [Food | undefined, Food | undefined, Food | undefined];

type State = {
  foods: [string, string, string];
  nightEat: boolean;
  players: number;
  days: number;
  repeat: number;
};

function parseState(string: string | undefined): State {
  const match = string?.match(/(\w+,\w+,\w+)(-night-eat)?(?:-players-(\d+))?(?:-days-(\d+))?(?:-repeat-(\d+(?:\.\d+)?))?/);
  if (match == null) return {
    foods: ['CookedMeat', 'Raspberries', ''],
    nightEat: false,
    players: 1,
    days: 1,
    repeat: 1,
  };
  const [f1 = '', f2 = '', f3 = ''] = match[1]?.split(',') ?? [];
  return {
    foods: [f1, f2, f3],
    nightEat: !!match[2],
    players: Number(match[3] ?? '1'),
    days: Number(match[4] ?? '1'),
    repeat: Number(match[5] ?? '1'),
  }
}

function serializeState(state: State): string {
  const foods = state.foods.join(',');
  const nightEat = state.nightEat ? '-night-eat' : '';
  const players = state.players === 1 ? '' : '-players-' + state.players;
  const days = state.days === 1 ? '' : '-days-' + state.days;
  const repeat = state.repeat === 1 ? '' : '-repeat-' + state.repeat;
  return `/food-planner/${foods}${nightEat}${players}${days}${repeat}`;
}

export function FoodPlanner() {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const runeTranslate = useRuneTranslate();
  const history = useHistory();
  const { params } = useParams<{ params?: string }>();
  const [state, setState] = useState(parseState(params));
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
    const path = serializeState(st);
    if (history.location.pathname !== path) {
      history.replace(path);
    };
  }, 100);

  const totalRes = selectedFoods.reduce<SimpleDrop>((a, b) => addDrop(a, getFoodResourcesPerDay(b)), {});
  const totalFood = Object.fromEntries(
    selectedFoods
      .filter(isNotNull)
      .map(f => [f.id, 1 / days(f.duration)])
  );
  const mul = (nightEat ? 1 : 0.7) * players * daysDuration * repeat;

  const biomes: Biome[] = ['Meadows', 'BlackForest', 'Swamp', 'Mountain', 'Plains'];

  return (<>
    <h1>{translate('ui.page.food-planner')}</h1>
    <h2>{translate('ui.pickFoods')}</h2>
    <div className="FoodPresets">
      <div className="FoodPresets__cell FoodPresets__title FoodPresets__title--initial">{translate('ui.biome')}</div>
      {Object.keys(bestTypes).map(key =>
        <div className="FoodPresets__cell FoodPresets__title" key={key}>{translate(`ui.bestFood.${key}`)}</div>
      )}
      {biomes
        .filter((_, tier) => tier < spoiler)
        .map((biome, idx) => {
          const tier = idx + 1;
          return <React.Fragment key={biome}>
            <div className="FoodPresets__cell FoodPresets__biome">{runeTranslate({ tier, id: `ui.biome.${biome}` })}</div>
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
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td>{translate('ui.baseValue')}</td>
          <td className="FoodPlanner__value">{BASE_HEALTH}</td>
          <td className="FoodPlanner__value">{BASE_STAMINA}</td>
        </tr>
        {[0, 1, 2].map(idx => <tr>
          <td><ItemIcon key={idx} item={selectedFoods[idx]} className={(selectedFoods[idx]?.tier ?? 0) > spoiler ? 'spoiler' : ''} /></td>
          <td className="FoodPlanner__select"><FoodSelector key={idx} state={selectedFoods} setState={setSelectedFoods} idx={idx} error={wrongFoods[idx]} /></td>
          <td className="FoodPlanner__value">{selectedFoods[idx]?.health}</td>
          <td className="FoodPlanner__value">{selectedFoods[idx]?.stamina}</td>
        </tr>)}
      </tbody>
      <tfoot>
        <tr>
          <th>&Sigma;</th>
          <th>{translate('ui.total')}</th>
          <th className="FoodPlanner__value">{selectedFoods.reduce((a, b) => a + (b?.health ?? 0), BASE_HEALTH)}</th>
          <th className="FoodPlanner__value">{selectedFoods.reduce((a, b) => a + (b?.stamina ?? 0), BASE_STAMINA)}</th>
        </tr>
      </tfoot>
    </table>
    <hr />
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
    <hr />
    <div className="FoodTotals">
      <div className="FoodTotals__section">
        <h2>{translate('ui.itemType.food')}</h2>
        <ul>{Object.entries(totalFood).map(([key, val]) => 
          <li><InlineObjectWithIcon id={key} key={key} /> {showNumber(val * mul)}</li>)}</ul>
      </div>
      <div className="FoodTotals__section">
        <h2>{translate('ui.resources')}</h2>
        <ul>{Object.entries(totalRes).map(([key, val]) => 
          <li><InlineObjectWithIcon id={key} key={key} /> {showNumber(val * mul)}</li>)}</ul>
      </div>
    </div>
  </>);
}