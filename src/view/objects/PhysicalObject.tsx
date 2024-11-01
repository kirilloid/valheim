import React, { useContext } from 'react';

import type * as T from '../../types';
import { timeI2S } from '../../model/utils';
import { fullDestructible } from '../../data/objects';
import { recipes } from '../../data/recipes';
import { data } from '../../data/itemDB';

import { TranslationContext, useSettingsFilter } from '../../effects';
import { Area, InlineObject, InlineObjectWithIcon, List, rangeBy, showPercent } from '../helpers';
import { ItemHeader } from '../parts/ItemHeader';
import { ItemIcon } from '../parts/Icon';
import { DropTable } from '../parts/DropTable';
import { GrowSection } from '../parts/Source';
import { Destructible } from '../parts/Destructible';
import { ResourceRoot } from '../parts/ResourceRoot';
import { Tabs } from '../parts/Tabs';
import { spawnChance } from '../../model/game';

function Grow({ item }: { item: T.PhysicalObject }) {
  return <section>
    <h2>Source</h2>
    <GrowSection item={item} />
  </section>
}

function Drop({ drop }: { drop: T.GeneralDrop[] }) {
  const translate = useContext(TranslationContext);
  return <section>
    <h2>{translate('ui.drops')}</h2>
    <DropTable drops={drop} />
  </section>
}

function Plant({ plant }: { plant: T.Plantable }) {
  const { biomes, growTime } = plant;
  const translate = useContext(TranslationContext);
  return <section>
    <h2>{translate(`ui.itemSubtype.plant`)}</h2>
    <dl>
      <dt>planted in</dt>
      <dd><List>{biomes.map(b => <Area key={b} area={b} />)}</List></dd>
      <dt>{translate('ui.growTime.plant')}</dt>
      <dd>{rangeBy(growTime, timeI2S)}</dd>
    </dl>
  </section>
}

function Leviathan({ leviathan }: { leviathan: T.Leviathan }) {
  const { chance, delay } = leviathan;
  // const translate = useContext(TranslationContext);
  return <section>
    <h2>Scareable</h2>
    <p>This object might be scared off upon hitting</p>
    <dl>
      <dt>chance on hit</dt>
      <dd>{showPercent(chance)}</dd>
      <dt>time before start of submerge</dt>
      <dd>{timeI2S(delay)}</dd>
    </dl>
  </section>;
}

function Runestone({ texts }: { texts: string[] }) {
  const translate = useContext(TranslationContext);
  return <section>
    <h2>Texts</h2>
    {texts.length === 1
      ? <>
          <p>This object shows the following text:</p>
          <p style={{ whiteSpace: 'pre-line' }}>{translate(`lore.${texts[0]}`)}</p>
        </>
      : <p>This object shows one of the following text (picked randomly at creation):</p>}
    
    {texts.length > 1 && <Tabs tabs={texts.map((text, i) => {
      return {
        title: `#${i + 1}`,
        renderer() {
          return <p style={{ whiteSpace: 'pre-line' }}>{translate(`lore.${text}`)}</p>
        }
      };
    })} selected={0} />}
  </section>;
}

function TraderRecipes({ id }: { id: 'haldor' | 'hildir' | 'bogWitch' }) {
  const settingsFilter = useSettingsFilter();
  const rr = recipes
    .filter((r): r is T.ItemRecipe & { type: 'haldor' | 'hildir' | 'bogWitch' } => r.type === id)
    .filter(r => {
      const obj = data[r.item];
      return obj && settingsFilter(obj);
    })
  return <>
    <h2>Sells</h2>
    <table>
      <thead>
        <tr>
          <td>item</td>
          <td>price</td>
          <td>requires kill</td>
        </tr>
      </thead>
      <tbody>
        {rr.map((r, i) => <tr key={i}>
          <td><InlineObjectWithIcon id={r.item} /></td>
          <td><ItemIcon item={data.Coins} /> {r.value}</td>
          <td>{r.killed ? <InlineObjectWithIcon id={r.killed} /> : null}</td>
        </tr>)}
      </tbody>
    </table>
  </>
}

function showRelativePercent(x: number) {
  return (x * 100).toPrecision(2) + '%';
}

function SpawnArea({ params }: { params: T.SpawnArea }) {
  const translate = useContext(TranslationContext);

  const totalWeight = params.prefabs.reduce((a, prefab) => a + prefab.weight, 0);
  const minLvl = Math.min(...params.prefabs.map(prefab => prefab.level[0])) || 1;
  const maxLvl = Math.max(...params.prefabs.map(prefab => prefab.level[1])) || 3;
  const range = Array.from({ length: maxLvl - minLvl + 1 }, (_, i) => minLvl + i);
  return <>
    <h2>Spawner</h2>
    <table>
      <colgroup>
        <col span={2} />
        <col span={range.length + 1} width={showPercent(0.65 / (range.length + 1))} />
      </colgroup>
      <thead>
        <tr>
          <td></td>
          <td>{translate('ui.creature')}</td>
          {range.map(lvl => <td key={lvl}>{lvl - 1}⭐</td>)}
          <td>{translate('ui.total')}</td>
        </tr>
      </thead>
      <tbody>
        {params.prefabs.map(item => {
          const weight = item.weight / totalWeight;
          return <tr key={item.prefab}>
            <td><ItemIcon item={data[item.prefab]} /></td>
            <td><InlineObject id={item.prefab} /></td>
            {range.map(lvl => <td>{showRelativePercent(spawnChance(item.level, params.levelUpChance, lvl) * weight)}</td>)}
            <td>{showPercent(weight)}</td>
          </tr>;
        })}
      </tbody>
    </table>
    <dl>
      <dt>period</dt><dd>{params.interval}s</dd>
      <dt>max</dt><dd>{params.maxNear}</dd>
      <dt>level up chance</dt><dd>{showPercent(params.levelUpChance)}</dd>
    </dl>
  </>
}

function Vegvisir({ to }: { to: T.GameLocationId }) {
  return <dl>
    <dt>Leads to location</dt>
    <dd><Area area={to} /></dd>
  </dl>
}

export function PhysicalObject({ item }: { item: T.PhysicalObject }) {
  const full = fullDestructible(item);

  return (
    <>
      <ItemHeader item={item} noIcon />
      <ItemIcon item={item} size={128} />
      <Grow item={item} />
      {item.trader && <TraderRecipes id={item.trader} />}
      {item.Plant && <Plant plant={item.Plant} />}
      {item.Leviathan && <Leviathan leviathan={item.Leviathan} />}
      {item.RuneStone && <Runestone texts={item.RuneStone} />}
      {item.Vegvisir && <Vegvisir to={item.Vegvisir} />}
      {item.ResourceRoot && <ResourceRoot params={item.ResourceRoot} />}
      {full?.Destructible && <Destructible item={full.Destructible} />}
      {item?.SpawnArea && <SpawnArea params={item.SpawnArea} />}
      {item.drop && <Drop drop={item.drop} />}
    </>
  );
}