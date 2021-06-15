import React, { useState, useContext, useCallback } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import '../css/FoodTable.css';

import type { Food, Item } from '../types';
import { timeI2S } from '../model/utils';
import { Icon, ItemIcon } from './Icon';
import { TranslationContext } from '../translation.effect';
import { resources } from '../model/resources';

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
    return <input type="radio" name="sort" checked={sort === value} value={value} onClick={() => {
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
      items.sort((a, b) => b[sort] - a[sort]);
    }
  }

  return (<>
    <h1>{translate('ui.itemType.food')}</h1>
    <table className="FoodTable" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>icon</th>
          <th><span className="FoodTable__extra">name</span></th>
          <th>
            {Radio('health')}
            <Icon id="health" alt="" size={16} />
            <span className="FoodTable__extra">{translate('ui.health')}</span>
          </th>
          <th>
            {Radio('stamina')}
            <Icon id="walknut" alt="" size={16} />
            <span className="FoodTable__extra">{translate('ui.stamina')}</span>
          </th>
          <th>
            {Radio('total')}
            <Icon id="health" alt="" size={16} />
            <Icon id="walknut" alt="" size={16} />
            <span className="FoodTable__extra">total</span>
          </th>
          <th>
            {Radio('duration')}
            <Icon id="time" alt="" size={16} />
            <span className="FoodTable__extra">{translate('ui.time')}</span>
          </th>
          <th>
            {Radio('regen')}
            <Icon id="regen" alt="" size={16} />
            <span className="FoodTable__extra">{translate('ui.regen')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
      {items.map(food => {
        return <tr key={food.id}>
          <td><ItemIcon item={food} size={32} /></td>
          <td><Link to={`/obj/${food.id}`} className="FoodTable__extra">{translate(food.id)}</Link></td>
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