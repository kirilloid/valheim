import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import '../css/Biome.css';

import type { Item } from '../types';
import { TranslationContext } from '../translation.effect';
import { biomes } from '../model/location';
import { ItemIcon } from './Icon';
import { data } from '../model/objects';
import { averageAttacksDamage, yesNo } from './helpers';
import { resourceCraftMap } from '../model/resource-usage';

function ResourceList(props: { list: Item[] }) {
  const translate = useContext(TranslationContext);
  const { list } = props;
  return <ul className="plainList">
    {list.map(item => <li>
      <ItemIcon item={item} size={32} />
      <Link to={`/obj/${item.id}`}>{translate(item.id)}</Link>
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
    others: [] as Item[],
  };
  for (const res of biome.resources) {
    const item = data[res];
    if (item == null) {
      console.error(`Resource '${res}' from biome '${id}' not found`);
      continue;
    }
    if (item.type === 'piece' || item.type === 'creature') continue;
    if (item.type === 'trophy') {
      resources.trophies.push(item);
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
        <img src={`${imgPath}.jpg`} className="BiomePicture" />
      </picture>
      <section>
        <dl>
          <dt>active</dt><dd>{yesNo(biome.active)}</dd>
          <dt>tier</dt><dd>{biome.tier}</dd>
        </dl>
      </section>
      <section>
        <h2>resources</h2>
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
          <tr>
            <th></th>
            <th>creature</th>
            <th>health</th>
            <th>damage</th>
            <th>⭐</th>
          </tr>
          {biome.creatures.map(c =>
          <tr>
            <td><ItemIcon item={c} size={32} /></td>
            <td><Link to={`/obj/${c.id}`}>{translate(c.id)}</Link></td>
            <td className="value">{c.hp}</td>
            <td className="value">{averageAttacksDamage(c) || '—'}</td>
            <td className="value">{yesNo(c.maxLvl > 1)}</td>
          </tr>)}
        </table>
      </section>
      <section>
        <h2>locations</h2>
        <ul className="plainList">{biome.locations.map(id =>
          <li>
            <Link to={`/loc/${id}`}>{translate(`ui.location.${id}`)}</Link>
          </li>)}
        </ul>
      </section>
    </>
  );
}