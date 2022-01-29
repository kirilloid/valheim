import React, { useState, useContext, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import '../../css/FoodTable.css';

import type { Food, Resource } from '../../types';
import { timeI2S } from '../../model/utils';
import { resources } from '../../data/resources';

import { TranslationContext, useGlobalState } from '../../effects';
import { InlineObject } from '../helpers';
import { Icon, ItemIcon } from '../parts/Icon';
import { foodTable as pageName } from '../../state';

type FoodItem = Resource & { Food: Food };

function isFood(item: Resource): item is FoodItem {
  return item.Food != null;
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
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const params = useParams<{ sort?: string }>();
  const history = useHistory();
  const [sort, setSort] = useState<SortField | undefined>(parseSort(params.sort));

  const Radio = useCallback((value: SortField) => {
    return <input type="radio" name="sort" id={`sort_${value}`} checked={sort === value} value={value} onClick={() => {
      const path = `/${pageName}/${value}`;
      if (history.location.pathname !== path) {
        history.replace(path);
      };
      setSort(value);
    }} />
  }, [sort, setSort, history]);

  const items = foods.slice();
  if (sort != null) {
    if (sort === 'total') {
      sortBy(items, f => f.Food.health + f.Food.stamina, false);
    } else {
      sortBy(items, f => f.Food[sort], false);
    }
  }

  return (<>
    <h1>{translate('ui.page.food-nutrition')}</h1>
    <table className="FoodTable">
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
      {items.filter(item => item.tier <= spoiler).map(item => {
        return <tr key={item.id}>
          <td><ItemIcon item={item} size={32} /></td>
          <td><InlineObject id={item.id} className="FoodTable__extra" /></td>
          <td className="FoodTable__value">{item.Food.health}</td>
          <td className="FoodTable__value">{item.Food.stamina}</td>
          <td className="FoodTable__value">{item.Food.health + item.Food.stamina}</td>
          <td className="FoodTable__value">{timeI2S(item.Food.duration)}</td>
          <td className="FoodTable__value">{item.Food.regen}</td>
        </tr>
      })}
      </tbody>
    </table>
  </>);
}