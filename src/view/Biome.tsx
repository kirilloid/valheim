import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import '../css/Biome.css';

import type { BiomeConfig, EntityId, GameObject, Item, PhysicalObject, Resource, Structure } from '../types';
import { biomes } from '../data/location';
import { maxLvl } from '../data/creatures';
import { data } from '../data/itemDB';
import { resourceCraftMap } from '../data/resource-usage';
import { envSetup, envStates } from '../data/env';

import { TranslationContext } from '../effects';
import { averageAttacksDamage, InlineObjectWithIcon, List, yesNo } from './helpers';
import { ItemIcon } from './parts/Icon';
import { SpoilerAlert } from './parts/Spoiler';
import { sortBy } from '../model/utils';
import { useSettingsFilter } from '../effects/globalState.effect';

const foodTracking: Record<EntityId, EntityId[]> = {};

function ResourceList(props: { list: GameObject[] }) {
  const { list } = props;
  list.sort((a, b) => b.tier - a.tier);
  return <ul className="plainList">
    {list.map(item => {
      const track = foodTracking[item.id] ?? [];
      return <li key={item.id} title={track.join(' <- ')}>
        <InlineObjectWithIcon id={item.id} />
      </li>
    })}
  </ul>
}

function isFoodOrUsedForFood(item: Item, settingsFilter: (item: GameObject) => boolean) {
  // TODO: maybe this less hacky, but currently buyable ChickenEgg makes coins food ingridient
  if (item.id === 'Coins') return false;
  const visited = new Set<EntityId>();
  const queue: { item: Item; track: EntityId[] }[] = [{ item, track: [] }];
  let idx = 0;
  while (idx < queue.length) {
    const { item: next, track } = queue[idx++]!;
    if ((next as Resource).Food != null) {
      foodTracking[item.id] = track.concat(next.id);
      return true;
    }
    visited.add(next.id);
    for (const item of resourceCraftMap[next.id] ?? []) {
      if (!settingsFilter(item)) continue;
      const { id } = item;
      if (!visited.has(id)) {
        queue.push({ item, track: track.concat(next.id) });
        visited.add(id);
      }
    }
  }
  return false;
}

function Weather({ biome }: { biome: BiomeConfig }) {
  const translate = useContext(TranslationContext);
  const envs = envSetup[biome.id];
  const totalWeight = envs.reduce((total, [, weight]) => weight + total, 0);
  return <section>
    <h2><Link to="/weather">{translate('ui.page.weather')}</Link></h2>
    <dl>
      {envs.map(([env, weight]) => <React.Fragment key={env}>
        <dt>{envStates[env].emoji} {translate(`ui.weather.${env}`)}</dt><dd>{Math.round(weight / totalWeight * 100)}%</dd>
      </React.Fragment>)}
    </dl>
  </section>
}

function Resources({ biome }: { biome: BiomeConfig }) {
  const translate = useContext(TranslationContext);
  const settingsFilter = useSettingsFilter();

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
      console.error(`Resource '${res}' from biome '${biome.id}' not found`);
      continue;
    }
    if (!settingsFilter(item)) continue;
    switch (item.type) {
      case 'piece':
      case 'spawner':
      case 'creature':
      case 'fish':
        continue;
      case 'object':
        // they are not here
        break;
      case 'trophy':
        resources.trophies.push(item);
        break;
      case 'ship':
      case 'cart':
      case 'siege':
        // skip them
        break;
      case 'item':
        if (isFoodOrUsedForFood(item, settingsFilter)) {
          resources.food.push(item);
        } else {
          resources.others.push(item);
        }
        break;
      default:
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
        case 'indestructible':
          break;
        default:
          if (obj.drop?.length === 1
          &&  obj.drop[0]?.options.length === 1
          &&  biome.resources.has(obj.drop[0]?.options[0]?.item ?? '')) {
            // this should be pickable
          } else {
            resources.misc.push(obj);
          }
      }
    }
  }

  return <section>
    <h2>{translate('ui.resources')}</h2>
    <div className="multiList">
      <div>
        <h3>{translate('ui.itemType.food')}</h3>
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
}

function Creatures({ biome }: { biome: BiomeConfig }) {
  const translate = useContext(TranslationContext);
  const creatures = [...biome.creatures];
  sortBy(creatures, c => c.type === 'fish' ? 0 : c.hp)
  return <section>
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
        {creatures.map(c =>
        <tr key={c.id}>
          <td><ItemIcon item={c} size={32} /></td>
          <td><Link to={`/obj/${c.id}`}>{translate(c.id)}</Link></td>
          <td className="value">{c.type === 'fish' ? 1 : c.hp}</td>
          <td className="value">{c.type === 'fish' ? '—' : averageAttacksDamage(c) || '—'}</td>
          <td className="value">{yesNo(maxLvl(c) > 1)}</td>
        </tr>)}
      </tbody>
    </table>
  </section>
}

function Locations({ biome }: { biome: BiomeConfig }) {
  const translate = useContext(TranslationContext);
  return <section>
    <h2>{translate('ui.locations')}</h2>
    <ul className="plainList">{biome.locations.map(id =>
      <li key={id}>
        <Link to={`/loc/${id}`}>{translate(`ui.location.${id}`)}</Link>
      </li>)}
    </ul>
  </section>
}

function BiomeList({ id }: { id: string }) {
  const translate = useContext(TranslationContext);

  return <div>{translate('ui.biomes')}: <List separator=" | ">{biomes.map(biome => {
    const name = translate(`ui.biome.${biome.id}`);
    return biome.active
      ? biome.id === id
        ? <strong key={biome.id}>{name}</strong>
        : <Link key={biome.id} to={`/biome/${biome.id}`}>{name}</Link>
      : <span key={biome.id} className="disabled">{name}</span>
  })}</List></div>
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

  return (
    <>
      <SpoilerAlert tier={biome.tier} />
      <h1>
        {translate(`ui.biome.${id}`)}
        <span className="entity-type"> &ndash; {translate('ui.biome')}</span>
      </h1>
      <BiomeList id={id} />
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
      <Weather biome={biome} />
      <Resources biome={biome} />
      <Creatures biome={biome} />
      <Locations biome={biome} />
    </>
  );
}