import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { EntityId, GameObject, Item, Pair } from '../../types';
import { SkillType } from '../../model/skills';
import { assertNever, days, timeI2S } from '../../model/utils';

import { data } from '../../data/itemDB';
import { recipes } from '../../data/recipes';
import { creatures } from '../../data/creatures';
import { miningMap, resourceBuildMap, resourceCraftMap } from '../../data/resource-usage';
import { locationBiomes, objectLocationMap } from '../../data/location';

import { TranslationContext, useGlobalState } from '../../effects';
import { Area, InlineObject, InlineObjectWithIcon, List, rangeBy } from '../helpers';
import { Icon, ItemIcon, SkillIcon } from './Icon';

export const SOURCE_CRAFT = 1;
export const SOURCE_DROP = 2;
export const SOURCE_RECIPE = 4;
export const SOURCE_GROW = 8;
export const SOURCE_MINING = 16;
export const SOURCE_ALL = SOURCE_CRAFT | SOURCE_DROP | SOURCE_RECIPE | SOURCE_GROW | SOURCE_MINING;

const source: Record<EntityId, EntityId[]> = {};
for (const { id, drop } of creatures) {
  for (const { item } of drop) {
    (source[item] ?? (source[item] = [])).push(id);
  }
}

function DropsFrom({ sources }: { sources: EntityId[] }) {
  return (
    sources.length === 1
    ? <InlineObjectWithIcon id={sources[0]!} />
    : <ul>{sources.map(id => <li key={id}><InlineObjectWithIcon id={id} /></li>)}</ul>
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

function Station({ station }: { station: EntityId | null }) {
  if (!station) {
    return <>
      <SkillIcon skill="Unarmed" useAlt={false} />{' '}
      inventory
    </>;
  }
  return <InlineObjectWithIcon id={station} />;
}

const MaterialHeader = ({ cols }: { cols: number }) => {
  const translate = useContext(TranslationContext);
  return <thead>
    <tr key="header">
      <th key="icon"></th>
      <th key="name">{translate('ui.quality')}</th>
      {Array.from({ length: cols }, (_, i: number) =>
        <th key={`lvl${i+1}`} className="RecipeItems__value">{i + 1}</th>)}
    </tr>
  </thead>;
};

function Materials({
  materials, materialsUp = {}, maxLvl = 1
}: {
  materials: Record<EntityId, number>,
  materialsUp?: Record<EntityId, number>,
  maxLvl?: number
}) {
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
          <td key="name"><InlineObject id={id} /></td>
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
          <h2>{translate('ui.crafting')}</h2>
          <div>{translate('ui.usedToCraft')}:</div>
          <ul className="CraftList">
            {crafts.sort((a, b) => a.tier - b.tier).map(item => <li key={item.id}>
              <InlineObjectWithIcon id={item.id} />
            </li>)}
          </ul>
        </section>
      : null}
    {builds?.length
      ? <section>
          <h2>{translate('ui.building')}</h2>
          <div>{translate('ui.usedToBuild')}:</div>
          <ul className="CraftList">
            {builds.sort((a, b) => a.tier - b.tier).map(item => <li key={item.id}>
              <InlineObjectWithIcon id={item.id} />
            </li>)}
          </ul>
        </section>
      : null}
  </>
}

function getRecipe(item: GameObject) {
  if (item.type === 'piece') return item.recipe;
  return recipes.find(r => r.item === item.id);
}

export function Recipe({ item }: { item: GameObject }) {
  const translate = useContext(TranslationContext);
  const recipe = getRecipe(item);
  if (recipe == null) return null;
  switch (recipe.type) {
    case 'trader':
      return <>
        Bought from <Link to="/info/trader">trader</Link> for {recipe.value} <Icon id="coin" alt={translate('Coins')} size={16} />
      </>;
    case 'craft':
      const maxLvl = (item as Item).maxLvl;
      if (maxLvl == null || maxLvl <= 1) {
        const { station, level } = recipe.source;
        const { number, materials, time } = recipe;
        return <dl>
          <dt>station</dt><dd><Station station={station} /> {level ? `lvl ${level}` : ''}</dd>
          <dt>{translate('ui.duration')}</dt><dd><Icon id="time" alt="" size={16} />{timeI2S(time)}</dd>
          <dt>{translate('ui.resources')}</dt><dd>{
          Object.keys(materials).length
            ? <Materials materials={materials} />
            : 'for free'
          }</dd>
          {number === 1 ? null : <><dt>{translate('ui.quantity')}</dt><dd>{number}</dd></>} 
        </dl>;
      } else {
        const { station, level } = recipe.source;
        return <>
          Crafted in <Station station={station} /> {level ? `lvl ${level}` : ''} using:{' '}
          <Materials
            materials={recipe.materials}
            materialsUp={recipe.materialsPerLevel}
            maxLvl={(item as Item).maxLvl} />
        </>;
      }
    case 'craft_piece':
      return <>
        Built near <Station station={recipe.station} /> using: <Materials materials={recipe.materials} />
      </>
    default:
      return assertNever(recipe);
  }
}

export function RecipeSection({ item }: { item: GameObject | undefined }) {
  const translate = useContext(TranslationContext);
  return item != null && getRecipe(item) != null
    ? <section>
        <h2>{translate('ui.recipe')}</h2>
        <Recipe item={item} />
      </section>
    : null;
}

function showAltitude(num: Pair<number>): string {
  const [min, max] = num;
  if (max === 1000) return `${min}..`;
  return rangeBy(num, String, '..');
}

function showSurface(onSurface: boolean, offset: number): string {
  if (onSurface) {
    return offset
      ? offset < 0
        ? `${-offset}m underwater`
        : `${offset}m above water`
      : 'on water';
  }
  return offset
    ? offset < 0
      ? `${-offset}m underground`
      : `${offset}m above ground`
    : 'on ground';
}

function showTilt(num: Pair<number>): string {
  return rangeBy(num, x => `${x}°`);
}

function showNumber(num: Pair<number>): string {
  const [min, max] = num;
  if (max < 1) return `1 in ${Math.round(1 / max)}`;
  if (min === max) return String(min);
  return rangeBy(num, String);
}

export function GrowSection({ item }: { item: GameObject | undefined }) {
  const translate = useContext(TranslationContext);
  if (!item) return null;
  switch (item.type) {
    case 'creature':
    case 'piece':
    case 'structure':
    case 'ship':
    case 'cart':
      return null;
  }
  const grow = item.grow ?? [];
  const locations = objectLocationMap[item.id] ?? [];
  if (!grow.length && !locations.length) return null;
  const respawn = grow?.find(g => g.respawn)?.respawn ?? 0;
  return <>
    {item.type === 'object' ? 'Can be found in' : 'Sourced from'}
    {' '}
    <List separator={<hr />}>{grow.map((g, i) => <dl key={i}>
      <dt>{translate('ui.locations')}</dt>
      <dd><List>{g.locations.map(loc => <Area key={loc} area={loc} />)}</List></dd>
      <dt>{translate('ui.altitude')}</dt>
      <dd>{showAltitude(g.altitude)}</dd>
      <dt>surface</dt>
      <dd>{showSurface(g.onSurface, g.offset)}</dd>
      <dt>{translate('ui.groundTilt')}</dt>
      <dd>{showTilt(g.tilt)}</dd>
      <dt>{translate('ui.quantity')}</dt>
      <dd>{showNumber(g.num)}{g.locations[0]! in locationBiomes ? '' : ' (per 64x64m zone)'}</dd>
      <dt>{translate('ui.respawn')}</dt>
      <dd>{g.respawn ? `every ${days(respawn)} game days` : 'never'}</dd>
    </dl>)}</List>
    {grow.length && locations.length ? <hr /> : null}
    <List>{
      locations.map(loc => <div><Area key={loc} area={loc} /></div>)
    }</List>
  </>;
}

function MiningSection({ id }: { id: EntityId }) {
  const translate = useContext(TranslationContext);
  const sources = miningMap.get(id);
  return sources
    ? <section>
        <h2>{translate('ui.minedFrom')}</h2>
        <ul>
          {[...new Set(sources)].map(s => <li key={s.id}>
            <InlineObject id={s.id} />
          </li>)}
        </ul>
      </section>
    : null;
}

export function Source({ id, types = SOURCE_ALL }: { id: EntityId, types?: number }) {
  return <>
    {(types & SOURCE_CRAFT) !== 0 && <CraftingSection id={id} />}
    {(types & SOURCE_DROP) !== 0 && <DropSection sources={source[id]} />}
    {(types & SOURCE_RECIPE) !== 0 && <RecipeSection item={data[id]} />}
    {(types & SOURCE_GROW) !== 0 && <GrowSection item={data[id]} />}
    {(types & SOURCE_MINING) !== 0 && <MiningSection id={id} />}
  </>
}