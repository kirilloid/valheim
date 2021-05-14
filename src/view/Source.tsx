import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Biome, CraftingStation, EntityId, Item, Piece } from '../types';
import { TranslationContext } from '../translation.effect';
import { data } from '../model/objects';
import { creatures } from '../model/creatures';
import { Icon } from './Icon';
import { timeI2S } from '../model/utils';
import { getCraftingStationId } from '../model/building';
import { useGlobalState } from '../globalState.effect';

const source: Record<EntityId, EntityId[]> = {};
for (const { id, drop } of creatures) {
  for (const { item } of drop) {
    (source[item] ?? (source[item] = [])).push(id);
  }
}

function DropSource({ id }: { id: EntityId }) {
  const translate = useContext(TranslationContext);
  return (<Link to={`/obj/${id}`}>
    <Icon type="creature" id={id} />
    {translate(id)}
  </Link>);    
}

function DroppedBy({ sources }: { sources: EntityId[] }) {
  return (
    sources.length === 1
    ? <DropSource id={sources[0]!} />
    : <ul>{sources.map(id => <li><DropSource id={id} /></li>)}</ul>
  );
}

export function DropSection({ sources }: { sources: string[] | undefined }) {
  const translate = useContext(TranslationContext);
  return sources?.length
    ? <section>
        <header>{translate('ui.droppedBy')}</header>
        <DroppedBy sources={sources} />
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

const MaterialHeader = ({ cols }: { cols: number }) => (
  <thead>
    <tr key="header">
      <th key="icon"></th>
      <th key="name">level</th>
      {Array.from({ length: cols }, (_, i: number) =>
        <th key={`lvl${i+1}`}>{i + 1}</th>)}
    </tr>
  </thead>
);

function Materials({
  materials, materialsUp = {}, maxLvl = 1
}: {
  materials: Record<EntityId, number>,
  materialsUp?: Record<EntityId, number>,
  maxLvl?: number
}) {
  const translate = useContext(TranslationContext);
  const [aggregateSum, setAggregateSum] = useGlobalState('aggregate');
  const keys = Array.from(new Set([
    ...Object.keys(materials),
    ...Object.keys(materialsUp)
  ]));
  return (
    <table className="RecipeItems">
      {maxLvl === 1
        ? null
        : <MaterialHeader cols={maxLvl} />
      }
      <tbody>
      {keys.map(id =>
        <tr key={id}>
          <td key="icon"><Icon type="resource" id={id} /></td>
          <td key="name"><Link to={`/obj/${id}`}>{translate(id)}</Link></td>
          {Array.from({ length: maxLvl }, (_, i: number) =>
            <td key={`lvl${i+1}`}>{
              aggregateSum
                ? (materials[id] ?? 0) + (materialsUp[id] ?? 0) * i * (i + 1) / 2
                : (i ? (materialsUp[id] ?? 0) * i : (materials[id] ?? 0))
            }</td>)}
        </tr>
      )}
      </tbody>
      {maxLvl === 1
        ? null
        : <tfoot>
          <tr>
            <th colSpan={maxLvl + 2} align="right">
              <label>
                total resources
                <input type="checkbox" checked={aggregateSum} onChange={e => setAggregateSum(e.target.checked)} />
              </label>
            </th>
          </tr>
        </tfoot>}
    </table>
  );
}

export function Recipe({ item }: { item: Item | Piece}) {
  const translate = useContext(TranslationContext);
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
      Crafted {recipe.number}x in <Station station={station} /> using: <Materials materials={recipe.materials} />
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
      Crafted in {level
        ? <><Station station={station} /> lvl {level}</>
        : <Icon type="weapon" id="Hands" />} using:{' '}
      <Materials
        materials={recipe.materials}
        materialsUp={recipe.materialsPerLevel}
        maxLvl={(item as any).maxLvl} />
    </>
  }
  return <>
    Crafted with <Station station={recipe.station} /> using: <Materials materials={recipe.materials} />
  </>
}


export function RecipeSection({ item }: { item: Item | Piece | undefined }) {
  const translate = useContext(TranslationContext);
  return item
    ? <section>
        <header>{translate('ui.recipe')}</header>
        <Recipe item={item} />
      </section>
    : null;
}

export function Source({ id }: { id: EntityId }) {
  return <>
    <DropSection sources={source[id]} />
    <RecipeSection item={data[id]} />
  </>
}