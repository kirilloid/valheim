import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import '../css/Biome.css';

import type { Destructible, GameObject, Item } from '../types';
import { biomes } from '../data/location';
import { data } from '../data/itemDB';
import { resourceCraftMap } from '../data/resource-usage';

import { TranslationContext } from '../effects';
import { averageAttacksDamage, InlineObjectWithIcon, yesNo } from './helpers';
import { ItemIcon } from './Icon';

function ResourceList(props: { list: GameObject[] }) {
  const { list } = props;
  return <ul className="plainList">
    {list.map(item => <li key={item.id}>
      <InlineObjectWithIcon id={item.id} />
    </li>)}
  </ul>
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
    food: [] as Item[],
    mining: [] as Destructible[],
    others: [] as Item[],
  };
  for (const res of biome.resources) {
    const item = data[res];
    if (item == null) {
      console.error(`Resource '${res}' from biome '${id}' not found`);
      continue;
    }
    if (item.type === 'piece' || item.type === 'creature' || item.type === 'plant') continue;
    if (item.type === 'destructible') {
      resources.mining.push(item);
    } else if (item.type === 'trophy') {
      resources.trophies.push(item);
    } else if (item.type === 'ship' || item.type === 'cart') {
      // skip them
    } else if (item.type === 'food' || resourceCraftMap[item.id]?.some(v => v.type === 'food')) {
      resources.food.push(item);
    } else {
      resources.others.push(item);
    }
  }

  return (
    <>
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
        <h2>resources</h2>
        <h3>mining</h3>
        <ResourceList list={biome.destructibles} />
        <div className="multiList">
          <div>
            <h3>food</h3>
            <ResourceList list={resources.food} />
          </div>
          <div>
            <h3>resources</h3>
            <ResourceList list={resources.others} />
          </div>
          <div>
            <h3>trophies</h3>
            <ResourceList list={resources.trophies} />
          </div>
        </div>
      </section>
      <section>
        <h2>creatures</h2>
        <table width="100%">
          <thead>
            <tr>
              <th></th>
              <th>creature</th>
              <th>health</th>
              <th>damage</th>
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
              <td className="value">{yesNo(c.maxLvl > 1)}</td>
            </tr>)}
          </tbody>
        </table>
      </section>
      <section>
        <h2>locations</h2>
        <ul className="plainList">{biome.locations.map(id =>
          <li key={id}>
            <Link to={`/loc/${id}`}>{translate(`ui.location.${id}`)}</Link>
          </li>)}
        </ul>
      </section>
    </>
  );
}