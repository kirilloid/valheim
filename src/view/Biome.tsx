import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import '../css/Biome.css';

import type { EntityId, GameObject, Item, PhysicalObject, Resource, Structure } from '../types';
import { biomes } from '../data/location';
import { maxLvl } from '../data/creatures';
import { data } from '../data/itemDB';
import { resourceCraftMap } from '../data/resource-usage';

import { TranslationContext } from '../effects';
import { averageAttacksDamage, InlineObjectWithIcon, yesNo } from './helpers';
import { ItemIcon } from './parts/Icon';
import { SpoilerAlert } from './parts/Spoiler';

function ResourceList(props: { list: GameObject[] }) {
  const { list } = props;
  return <ul className="plainList">
    {list.map(item => <li key={item.id}>
      <InlineObjectWithIcon id={item.id} />
    </li>)}
  </ul>
}

function isFoodOrUsedForFood(item: Item) {
  const visited = new Set<EntityId>();
  const queue = [item];
  let idx = 0;
  while (idx < queue.length) {
    const next = queue[idx++]!;
    if ((next as Resource).Food != null) return true;
    visited.add(next.id);
    for (const item of resourceCraftMap[next.id] ?? []) {
      const { id } = item;
      if (!visited.has(id)) {
        queue.push(item);
        visited.add(id);
      }
    }
  }
  return false;
}

export function Biome() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);

  const biome = biomes.find(b => b.id === id);
  if (biome == null) {
    return <span className="error">
      Biome "{id}" not found
    </span>
  }

  const imgPath = `/icons/bg/${id}`;

  const resources = {
    trophies: [] as Item[],
    food: [] as Resource[],
    others: [] as (Item | Structure)[],
    rock: [] as PhysicalObject[],
    tree: [] as PhysicalObject[],
    misc: [] as PhysicalObject[],
  };
  for (const res of biome.resources) {
    const item = data[res];
    if (item == null) {
      console.error(`Resource '${res}' from biome '${id}' not found`);
      continue;
    }
    if (item.type === 'piece' || item.type === 'creature') continue;
    if (item.type === 'object') {
      // they are not here
    } else if (item.type === 'trophy') {
      resources.trophies.push(item);
    } else if (item.type === 'ship' || item.type === 'cart') {
      // skip them
    } else if (item.type === 'item' && isFoodOrUsedForFood(item)) {
      resources.food.push(item);
    } else {
      resources.others.push(item);
    }
  }
  for (const item of biome.destructibles) {
    const obj = data[item];
    if (obj?.type === 'object') {
      switch (obj.subtype) {
        case 'tree':
          resources.tree.push(obj);
          break;
        case 'rock':
          resources.rock.push(obj);
          break;
        default:
          resources.misc.push(obj);
      }
    }
  }

  return (
    <>
      <SpoilerAlert tier={biome.tier} />
      <h1>{translate(`ui.biome.${id}`)}</h1>
      <picture>
        <source srcSet={`${imgPath}.webp`} type="image/webp" />
        <img src={`${imgPath}.jpg`} className="BiomePicture" alt="illustration" />
      </picture>
      <section>
        <dl>
          <dt>active</dt><dd>{yesNo(biome.active)}</dd>
          <dt>tier</dt><dd>{biome.tier}</dd>
        </dl>
      </section>
      <section>
        <h2>{translate('ui.resources')}</h2>
        <div className="multiList">
          <div>
            <h3>food</h3>
            <ResourceList list={resources.food} />
          </div>
          <div>
            <h3>{translate('ui.resources')}</h3>
            <ResourceList list={resources.others} />
          </div>
          <div>
            <h3>{translate('ui.trophies')}</h3>
            <ResourceList list={resources.trophies} />
          </div>
        </div>
        <h2>{translate('ui.mining')}</h2>
        <div className="multiList">
          <div>
            <h3>{translate('ui.mineType.miscs')}</h3>
            <ResourceList list={resources.misc} />
          </div>
          <div>
            <h3>{translate('ui.mineType.trees')}</h3>
            <ResourceList list={resources.tree} />
          </div>
          <div>
            <h3>{translate('ui.mineType.rocks')}</h3>
            <ResourceList list={resources.rock} />
          </div>
        </div>
      </section>
      <section>
        <h2>{translate('ui.creatures')}</h2>
        <table width="100%">
          <thead>
            <tr>
              <th></th>
              <th>{translate('ui.creature')}</th>
              <th>{translate('ui.health')}</th>
              <th>{translate('ui.damage')}</th>
              <th>⭐</th>
            </tr>
          </thead>
          <tbody>
            {biome.creatures.map(c =>
            <tr key={c.id}>
              <td><ItemIcon item={c} size={32} /></td>
              <td><Link to={`/obj/${c.id}`}>{translate(c.id)}</Link></td>
              <td className="value">{c.hp}</td>
              <td className="value">{averageAttacksDamage(c) || '—'}</td>
              <td className="value">{yesNo(maxLvl(c) > 1)}</td>
            </tr>)}
          </tbody>
        </table>
      </section>
      <section>
        <h2>{translate('ui.locations')}</h2>
        <ul className="plainList">{biome.locations.map(id =>
          <li key={id}>
            <Link to={`/loc/${id}`}>{translate(`ui.location.${id}`)}</Link>
          </li>)}
        </ul>
      </section>
    </>
  );
}