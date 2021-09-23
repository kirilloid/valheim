import React, { useContext, useState } from 'react';

import type { Destructible, EntityId, Pair, Weapon } from '../types';
import { applyDamageModifiers, getTotalDamage, getWeaponSkillFactor } from '../model/combat';
import { destructibles as objects } from '../data/objects';
import { axes, pickaxes } from '../data/weapons';

import { TranslationContext } from '../effects';
import { ItemIcon } from './Icon';
import { assertNever } from '../model/utils';

const destructibles = objects.filter(obj => obj.hp < Infinity);
const trees = destructibles.filter(obj => obj.subtype === 'tree');
const treeMap = Object.fromEntries(trees.map(t => [t.id, t]));

function* walk(item: Destructible, mul: number): Generator<[Destructible, number]> {
  yield [item, mul];
  for (const part of item.parts) {
    yield* walk(treeMap[part.id]!, part.num * mul);
  }
}

const rootTrees = Object.fromEntries(
  trees
    .filter(tree => tree.grow.length)
    .map(tree => [tree.id, [...walk(tree, 1)].filter(pair => !pair[0].id.endsWith('Stub'))])
);

type MineStats = {
  hits: Pair<number>;
  stamina: number;
}

type MineStat = 'hits' | 'stamina';

function getHits(objs: [Destructible, number][], tool: Weapon, skill: number): MineStats | undefined {
  const stats: MineStats = {
    hits: [0, 0],
    stamina: 0,
  };
  for (const [obj, num] of objs) {
    if ((tool.toolTier ?? 0) < obj.minToolTier) return;    
    const damage = getTotalDamage(applyDamageModifiers(tool.damage[0], obj.damageModifiers));
    const [min, max] = getWeaponSkillFactor(skill);
    const stamina = tool.attacks[0]?.stamina ?? 0;
    const maxHits = Math.ceil(obj.hp / (damage * min));
    const minHits = Math.ceil(obj.hp / (damage * max));
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

export function Mining() {
  const translate = useContext(TranslationContext);
  const [skill, setSkill] = useState(0);
  const [stat, setStat] = useState<MineStat>('stamina');
  return (<>
    <h1>{translate('ui.mining')}</h1>
    <section>
      <h2>{translate('ui.trees')}</h2>
      <div>
        <label>
          skill:
          {' '}
          <input type="range" min="0" max="100" value={skill}
            onChange={e => setSkill(+e.target.value)} />
        </label>
        {' '}
        {skill}
      </div>
      <table width="100%">
        <thead>
          <tr>
            <th>
              <select value={stat} onChange={e => setStat(e.target.value as MineStat)}>
                <option value="hits">hits</option>
                <option value="stamina">stamina</option>
              </select>
            </th>
            {axes.map(a => <th key={a.id}>
              <ItemIcon item={a} size={64} />
            </th>)}
          </tr>
        </thead>
        <tbody>
          {Object.entries(rootTrees).map(([id, objs]) => <tr key={id}>
            <td>{translate(id)}</td>
            {axes.map(a => <td key={a.id}>
              {showStat(getHits(objs, a, skill), stat)}
            </td>
            )}
          </tr>)}
        </tbody>
      </table>
    </section>
  </>);
}
