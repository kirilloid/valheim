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

function dropSource(id: EntityId, translate: Translator) {
  return (<Link to={`/obj/${id}`}>
    <Icon type="creature" id={id} />
    {translate(id)}
  </Link>);    
}

function droppedBy(sources: EntityId[], translate: Translator) {
  return (
    sources.length === 1
    ? dropSource(sources[0]!, translate)
    : <ul>{sources.map(id => <li>{dropSource(id, translate)}</li>)}</ul>
  );
}

export function DropSection(sources: string[] | undefined, translate: Translator) {
  return sources?.length
    ? <section>
        <header>{translate('ui.droppedBy')}</header>
        {droppedBy(sources, translate)}
      </section>
    : null;
}

export function Recipe(recipe: Item['recipe'] | Piece['recipe'], translate: Translator) {
  if (recipe == null) return null;
  if ('value' in recipe) {
    return <>
      Bought from <Link to="/info/trader">trader</Link> for {recipe.value} <Icon type="icon" id="coin_32" size={16} />
    </>;
  }
  if ('number' in recipe) {
    const { station } = recipe.source;
    return <>
      Crafted {recipe.number} in <Link to={`/obj/${getCraftingStationId(station)}`}>{CraftingStation[station]}</Link> using:
      <ul>
        {Object.entries(recipe.materials).map(([id, num]) => <li>{num}x <Link to={`/obj/${id}`}>{id}</Link></li>)}
      </ul>
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
      Crafted in <Link to={`/obj/${getCraftingStationId(station)}`}>{CraftingStation[station]}</Link> lvl{level} using:
      <ul className="Recipe">
        {Object.entries(recipe.materials).map(([id, num]) =>
          <li>
            <Icon type="resource" id={id} />
            <Link to={`/obj/${id}`}>{translate(id)}</Link> x {num}
          </li>
        )}
      </ul>
    </>
  }
  return <>
    Crafted with <Link to={`/obj/${getCraftingStationId(recipe.station)}`}>{CraftingStation[recipe.station]}</Link> using:
    <ul>
      {Object.entries(recipe.materials).map(([id, num]) =>
        <li>
          <Icon type="resource" id={id} />{' '}
          <Link to={`/obj/${id}`}>{translate(id)}</Link> x {num}
        </li>
      )}
    </ul>
  </>
}


export function RecipeSection(recipe: Item['recipe'] | Piece['recipe'] | undefined, translate: Translator) {
  return recipe
    ? <section>
        <header>{translate('ui.recipe')}</header>
        {Recipe(recipe, translate)}
      </section>
    : null;
}

export function Source(id: EntityId, translate: Translator) {
  return <>
    {DropSection(source[id], translate)}
    {RecipeSection(data[id]?.recipe, translate)}
  </>
}