import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import type { EntityId, Pair, PhysicalObject, Weapon } from '../types';
import { applyDamageModifiers, getTotalDamage, getWeaponSkillFactor } from '../model/combat';
import { objects as objects } from '../data/objects';
import { axes as allAxes, pickaxes as allPickaxes } from '../data/weapons';

import { TranslationContext, useGlobalState } from '../effects';
import { ItemIcon } from './Icon';
import { assertNever } from '../model/utils';

const destructibles = objects.filter(obj => obj.destructible);
const objectMap = Object.fromEntries(destructibles.map(t => [t.id, t]));

const trees = destructibles.filter(obj => obj.destructible?.damageModifiers.chop !== 'immune');
const rocks = destructibles.filter(obj => obj.destructible?.damageModifiers.pickaxe !== 'immune');

function* walk(item: PhysicalObject, mul: number): Generator<[PhysicalObject, number]> {
  if (Number.isFinite(item.destructible?.hp)) {
    yield [item, mul];
  }
  for (const part of item.destructible?.parts ?? []) {
    yield* walk(objectMap[part.id]!, part.num * mul);
  }
}

const rootTrees = Object.fromEntries(
  trees
    .filter(tree => tree.grow?.length)
    .map(tree => [tree.id, [...walk(tree, 1)].filter(pair => !pair[0].id.endsWith('Stub'))])
);

const rootRocks = Object.fromEntries(
  rocks
    .filter(rock => rock.grow?.length)
    .map(rock => [rock.id, [...walk(rock, 1)]])
);

type MineStats = {
  hits: Pair<number>;
  stamina: number;
};

type MineStat = 'hits' | 'stamina';

function getHits(objs: [PhysicalObject, number][], tool: Weapon, skill: number): MineStats | undefined {
  const stats: MineStats = {
    hits: [0, 0],
    stamina: 0,
  };
  for (const [obj, num] of objs) {
    const { destructible } = obj;
    if (!destructible) continue;
    if ((tool.toolTier ?? 0) < destructible.minToolTier) return;    
    const damage = getTotalDamage(applyDamageModifiers(tool.damage[0], destructible.damageModifiers));
    const [min, max] = getWeaponSkillFactor(skill);
    const stamina = tool.attacks[0]?.stamina ?? 0;
    const maxHits = Math.ceil(destructible.hp / (damage * min));
    const minHits = Math.ceil(destructible.hp / (damage * max));
    const avgHits = (minHits + maxHits) / 2;
    stats.hits[0] += minHits * num;
    stats.hits[1] += maxHits * num;
    stats.stamina += avgHits * stamina * num;
  }
  return stats;
}

function showStat(stats: MineStats | undefined, stat: MineStat) {
  if (stats == null) return null;
  switch (stat) {
    case 'hits':
      return `${stats.hits[0]}-${stats.hits[1]}`;
    case 'stamina':
      return stats.stamina;
    default:
      return assertNever(stat);
  }
}

function MiningTable({ header, tools, destructibles }: { header: string; tools: Weapon[]; destructibles: Record<EntityId, [PhysicalObject, number][]> }) {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const [skill, setSkill] = useState(0);
  const [stat, setStat] = useState<MineStat>('stamina');
  const availableTools = tools.filter(a => a.tier <= spoiler);
  return <section>
    <h2>{header}</h2>
    <div>
      <label>
        {translate('ui.skill')}:
        {' '}
        <input type="range"
          min="0" max="100" value={skill} onChange={e => setSkill(+e.target.value)}
          style={{ verticalAlign: 'middle', width: '190px' }} />
        {' '}
        <input type="number" pattern="[0-9]*" inputMode="numeric"
          min="0" max="100" value={skill} onChange={e => setSkill(+e.target.value)}
          style={{ width: '3em' }} />
      </label>
    </div>
    <table width="100%">
      <thead>
        <tr>
          <td>
            <select value={stat} onChange={e => setStat(e.target.value as MineStat)}>
              <option value="hits">hits</option>
              <option value="stamina">stamina</option>
            </select>
          </td>
          {availableTools.map(a => <td key={a.id}>
            <ItemIcon item={a} size={32} />
          </td>)}
        </tr>
      </thead>
      <tbody>
        {Object.entries(destructibles).map(([id, objs]) => <tr key={id}>
          <td><Link to={`/obj/${id}`}>{translate(id)}</Link></td>
          {availableTools.map(a => <td key={a.id}>
            {showStat(getHits(objs, a, skill), stat)}
          </td>
          )}
        </tr>)}
      </tbody>
    </table>
  </section>
}

export function Mining() {
  const translate = useContext(TranslationContext);
  return (<>
    <h1>{translate('ui.mining')}</h1>
    <MiningTable header={translate('ui.trees')} tools={allAxes} destructibles={rootTrees} />
    <MiningTable header={translate('ui.rocks')} tools={allPickaxes} destructibles={rootRocks} />
  </>);
}
