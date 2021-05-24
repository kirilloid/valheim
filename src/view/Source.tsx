import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Biome, CraftingStation, EntityId, GameObject, Item, Piece } from '../types';
import { TranslationContext } from '../translation.effect';
import { data } from '../model/objects';
import { creatures } from '../model/creatures';
import { Icon, ItemIcon, SkillIcon } from './Icon';
import { timeI2S } from '../model/utils';
import { getCraftingStationId } from '../model/building';
import { useGlobalState } from '../globalState.effect';
import { resourceBuildMap, resourceCraftMap } from '../model/resource-usage';
import { SkillType } from '../model/skills';

const source: Record<EntityId, EntityId[]> = {};
for (const { id, drop } of creatures) {
  for (const { item } of drop) {
    (source[item] ?? (source[item] = [])).push(id);
  }
}

function DropSource({ id }: { id: EntityId }) {
  const translate = useContext(TranslationContext);
  return (<Link to={`/obj/${id}`}>
    <ItemIcon item={data[id]} />
    {translate(id)}
  </Link>);    
}

function DropsFrom({ sources }: { sources: EntityId[] }) {
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
        <h2>{translate('ui.dropsFrom')}</h2>
        <DropsFrom sources={sources} />
      </section>
    : null;
}

function Station({ station }: { station: CraftingStation }) {
  const translate = useContext(TranslationContext);
  if (station === CraftingStation.Inventory) {
    return <>
      <SkillIcon skill={SkillType.Unarmed} useAlt={false} />{' '}
      inventory
    </>;
  }
  const id = getCraftingStationId(station);
  return <>
    <ItemIcon item={data[id]} />{' '}
    <Link to={`/obj/${id}`}>{translate(id)}</Link>
  </>;
}

const MaterialHeader = ({ cols }: { cols: number }) => (
  <thead>
    <tr key="header">
      <th key="icon"></th>
      <th key="name">level</th>
      {Array.from({ length: cols }, (_, i: number) =>
        <th key={`lvl${i+1}`} className="RecipeItems__value">{i + 1}</th>)}
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
          <td key="icon"><ItemIcon item={data[id]} /></td>
          <td key="name"><Link to={`/obj/${id}`}>{translate(id)}</Link></td>
          {Array.from({ length: maxLvl }, (_, i: number) =>
            <td key={`lvl${i+1}`} className="RecipeItems__value">{
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

function CraftingSection({ id }: { id: EntityId }) {
  const translate = useContext(TranslationContext);
  const crafts = resourceCraftMap[id];
  const builds = resourceBuildMap[id];
  return <>
    {crafts?.length
      ? <section>
          <h2>crafting</h2>
          {translate('ui.usedToCraft')}:
          <ul className="CraftList">
            {crafts.map(item => <li>
              <ItemIcon item={item} />
              {' '}
              <Link to={`/obj/${item.id}`}>{translate(item.id)}</Link>
            </li>)}
          </ul>
        </section>
      : null}
    {builds?.length
      ? <section>
          <h2>building</h2>
          {translate('ui.usedToBuild')}:
          <ul className="CraftList">
            {builds.map(item => <li>
              <ItemIcon item={item} />
              {' '}
              <Link to={`/obj/${item.id}`}>{translate(item.id)}</Link>
            </li>)}
          </ul>
        </section>
      : null}
  </>
}

export function Recipe({ item }: { item: Item | Piece}) {
  const translate = useContext(TranslationContext);
  const { recipe } = item;
  if (recipe == null) return null;
  if ('value' in recipe) {
    return <>
      Bought from <Link to="/info/trader">trader</Link> for {recipe.value} <Icon id="coin_32" alt={translate('Coins')} size={16} />
    </>;
  }
  if ('number' in recipe) {
    const { station } = recipe.source;
    const { number, materials, time } = recipe;
    return <dl>
      <dt>station</dt><dd><Station station={station} /></dd>
      <dt>{translate('ui.time')}</dt><dd>{timeI2S(time)}</dd>
      <dt>resources</dt><dd>{
      Object.keys(materials).length
        ? <Materials materials={materials} />
        : 'for free'
      }</dd>
      {number === 1 ? null : <><dt>quantity</dt><dd>{number}</dd></>} 
    </dl>
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
        : <Icon path="skills/Unarmed" alt="" />} using:{' '}
      <Materials
        materials={recipe.materials}
        materialsUp={recipe.materialsPerLevel}
        maxLvl={(item as any).maxLvl} />
    </>
  }
  return item.type === 'piece'
    ? <>
      Built near <Station station={recipe.station} /> using: <Materials materials={recipe.materials} />
    </>
    : <>
      Crafted in <Station station={recipe.station} /> using: <Materials materials={recipe.materials} />
    </>
}


export function RecipeSection({ item }: { item: GameObject | undefined }) {
  const translate = useContext(TranslationContext);
  return item && item.type !== 'creature'
    ? <section>
        <h2>{translate('ui.recipe')}</h2>
        <Recipe item={item} />
      </section>
    : null;
}

export function Source({ id }: { id: EntityId }) {
  return <>
    <CraftingSection id={id} />
    <DropSection sources={source[id]} />
    <RecipeSection item={data[id]} />
  </>
}