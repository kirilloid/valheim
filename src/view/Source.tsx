import React from 'react';
import { Link } from 'react-router-dom';

import { Biome, CraftingStation, EntityId, Item } from '../types';
import type { Translator } from '../translation.effect';
import { data } from '../model/objects';
import { creatures } from '../model/creatures';
import { Icon } from './Icon';
import { timeI2S } from '../model/utils';

const source: Record<EntityId, EntityId[]> = {};
for (const { id, drop } of creatures) {
  for (const { item } of drop) {
    (source[item] ?? (source[item] = [])).push(id);
  }
}

function dropSource(id: EntityId, translate: Translator) {
  return (<Link to={`/obj/${id}`}>
    <Icon type="creatures" id={id} />
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

export function Recipe(recipe: Item['recipe'], translate: Translator) {
  if (recipe == null) return null;
  if ('value' in recipe) {
    return <>
      Bought from <Link to="/info/trader">trader</Link> for {recipe.value} <Icon type="icon" id="coin_32" size={16} />
    </>;
  }
  if ('number' in recipe) {
    return <>
      Crafted {recipe.number} in {CraftingStation[recipe.source.station]} with:
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
  return <>
    Crafted in {CraftingStation[recipe.source.station]} lvl{recipe.source.level} with:
    <ul className="Recipe">
      {Object.entries(recipe.materials).map(([id, num]) =>
        <li>
          <Icon type="resources" id={id} />
          {' '}
          <Link to={`/obj/${id}`}>
            {translate(id)}
          </Link> x {num}
        </li>
      )}
    </ul>
  </>
}


export function RecipeSection(recipe: Item['recipe'] | undefined, translate: Translator) {
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