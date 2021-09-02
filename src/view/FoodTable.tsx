import React, { useState, useContext, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import '../css/FoodTable.css';

import type { Food, Item } from '../types';
import { timeI2S } from '../model/utils';
import { Icon, ItemIcon } from './Icon';
import { TranslationContext } from '../effects';
import { resources } from '../model/resources';
import { InlineObject } from './helpers';

function isFood(item: Item): item is Food {
  return item.type === 'food';
}

const foods = resources.filter(isFood);

type SortField = 'health' | 'stamina' | 'duration' | 'regen' | 'total';

function parseSort(sort?: string): SortField | undefined {
  switch (sort) {
    case 'health':
    case 'stamina':
    case 'duration':
    case 'regen':
    case 'total':
      return sort;
    default:
      return undefined;
  }
}

function sortBy<T>(array: T[], orderFn: (value: T) => number, asc: boolean = true) {
  array.sort((a, b) => (asc ? 1 : -1) * (orderFn(a) - orderFn(b)));
}

export function FoodTable() {
  const translate = useContext(TranslationContext);
  const params = useParams<{ sort?: string }>();
  const history = useHistory();
  const [sort, setSort] = useState<SortField | undefined>(parseSort(params.sort));

  const Radio = useCallback((value: SortField) => {
    return <input type="radio" name="sort" id={`sort_${value}`} checked={sort === value} value={value} onClick={() => {
      const path = `/food/${value}`;
      if (history.location.pathname !== path) {
        history.replace(path);
      };
      setSort(value);
    }} />
  }, [sort, setSort, history]);

  const items = foods.slice();
  if (sort != null) {
    if (sort === 'total') {
      sortBy(items, f => f.health + f.stamina, false);
    } else {
      sortBy(items, f => f[sort], false);
    }
  }

  return (<>
    <h1>{translate('ui.page.food-nutrition')}</h1>
    <table className="FoodTable" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>icon</th>
          <th><span className="FoodTable__extra">name</span></th>
          <th>
            {Radio('health')}
            <label htmlFor="sort_health">
              <Icon id="health" alt="" size={16} />
              <span className="FoodTable__extra">{translate('ui.health')}</span>
            </label>
          </th>
          <th>
            {Radio('stamina')}
            <label htmlFor="sort_stamina">
              <Icon id="walknut" alt="" size={16} />
              <span className="FoodTable__extra">{translate('ui.stamina')}</span>
            </label>
          </th>
          <th>
            {Radio('total')}
            <label htmlFor="sort_total">
              <Icon id="health" alt="" size={16} />
              <Icon id="walknut" alt="" size={16} />
              <span className="FoodTable__extra">total</span>
            </label>
          </th>
          <th>
            {Radio('duration')}
            <label htmlFor="sort_duration">
              <Icon id="time" alt="" size={16} />
              <span className="FoodTable__extra">{translate('ui.time')}</span>
            </label>
          </th>
          <th>
            {Radio('regen')}
            <label htmlFor="sort_regen">
              <Icon id="regen" alt="" size={16} />
              <span className="FoodTable__extra">{translate('ui.regen')}</span>
            </label>
          </th>
        </tr>
      </thead>
      <tbody>
      {items.map(food => {
        return <tr key={food.id}>
          <td><ItemIcon item={food} size={32} /></td>
          <td><InlineObject id={food.id} className="FoodTable__extra" /></td>
          <td className="FoodTable__value">{food.health}</td>
          <td className="FoodTable__value">{food.stamina}</td>
          <td className="FoodTable__value">{food.health + food.stamina}</td>
          <td className="FoodTable__value">{timeI2S(food.duration)}</td>
          <td className="FoodTable__value">{food.regen}</td>
        </tr>
      })}
      </tbody>
    </table>
  </>);
}