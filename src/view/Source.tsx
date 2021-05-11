import React from 'react';
import { Link } from 'react-router-dom';

import { Biome, CraftingStation, EntityId, Item, Piece } from '../types';
import type { Translator } from '../translation.effect';
import { data } from '../model/objects';
import { creatures } from '../model/creatures';
import { Icon } from './Icon';
import { timeI2S } from '../model/utils';
import { getCraftingStationId } from '../model/building';

const source: Record<EntityId, EntityId[]> = {};
for (const { id, drop } of creatures) {
  for (const { item } of drop) {
    (source[item] ?? (source[item] = [])).push(id);
  }
}

function dropSource(translate: Translator, id: EntityId) {
  return (<Link to={`/obj/${id}`}>
    <Icon type="creature" id={id} />
    {translate(id)}
  </Link>);    
}

function droppedBy(translate: Translator, sources: EntityId[]) {
  return (
    sources.length === 1
    ? dropSource(translate, sources[0]!)
    : <ul>{sources.map(id => <li>{dropSource(translate, id)}</li>)}</ul>
  );
}

export function DropSection(translate: Translator, sources: string[] | undefined) {
  return sources?.length
    ? <section>
        <header>{translate('ui.droppedBy')}</header>
        {droppedBy(translate, sources)}
      </section>
    : null;
}

function Station({ station }: { station: CraftingStation }) {
  const id = getCraftingStationId(station);
  return <>
    <Icon type="piece" id={id} />{' '}
    <Link to={`/obj/${id}`}>{CraftingStation[station]}</Link>
  </>;
}

function Materials(
  translate: Translator,
  materials: Record<EntityId, number>,
  materialsUp: Record<EntityId, number> = {},
  maxLvl: number = 1
) {
  return (
    <table className="RecipeItems">
      <th key="icon"></th>
      <th key="name">level</th>
      {Array.from({ length: maxLvl }, (_, i: number) =>
          <th key={`lvl${i+1}`}>{i + 1}</th>)}
      {Object.entries(materials).map(([id, num]) =>
        <tr>
          <td key="icon"><Icon type="resource" id={id} /></td>
          <td key="name"><Link to={`/obj/${id}`}>{translate(id)}</Link></td>
          {Array.from({ length: maxLvl }, (_, i: number) =>
            <td key={`lvl${i+1}`}>{i ? (materialsUp[id] ?? 0) * i : num}</td>)}
        </tr>
      )}
    </table>
  );
}

export function Recipe(translate: Translator, item: Item | Piece) {
  const { recipe } = item;
  if (recipe == null) return null;
  if ('value' in recipe) {
    return <>
      Bought from <Link to="/info/trader">trader</Link> for {recipe.value} <Icon type="icon" id="coin_32" size={16} />
    </>;
  }
  if ('number' in recipe) {
    const { station } = recipe.source;
    return <>
      Crafted {recipe.number}x in <Station station={station} /> using: {Materials(translate, recipe.materials)}
    </>
  }
  if ('biomes' in recipe) {
    return <>
      Grows in {recipe.biomes.map(b => Biome[b]).join(', ')}, {recipe.respawn ? `respawns every ${timeI2S(recipe.respawn)}` : 'does not respawn'}
    </>
  }
  if ('source' in recipe) {
    const { station, level } = recipe.source;
    return <>
      Crafted in <Station station={station} /> lvl {level} using: {Materials(translate, recipe.materials, recipe.materialsPerLevel, (item as any).maxLvl)}
    </>
  }
  return <>
    Crafted with <Station station={recipe.station} /> using: {Materials(translate, recipe.materials)}
  </>
}


export function RecipeSection(translate: Translator, item: Item | Piece | undefined) {
  return item
    ? <section>
        <header>{translate('ui.recipe')}</header>
        {Recipe(translate, item)}
      </section>
    : null;
}

export function Source(translate: Translator, id: EntityId) {
  return <>
    {DropSection(translate, source[id])}
    {RecipeSection(translate, data[id])}
  </>
}