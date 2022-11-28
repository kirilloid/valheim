import React, { useContext, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import type { DamageModifiers, EntityId, Pair, PhysicalObject, Weapon } from '../../types';
import { applyDamageModifiers, getTotalDamage, getWeaponSkillFactor } from '../../model/combat';
import { assertNever, groupBy } from '../../model/utils';
import { mining as pageName } from '../../state';

import { objects } from '../../data/objects';
import { objectLocationMap } from '../../data/location';
import { axes as allAxes, pickaxes as allPickaxes } from '../../data/weapons';

import { TranslationContext, useGlobalState } from '../../effects';
import { ItemIcon, SkillIcon } from '../parts/Icon';

const objectMap: Record<EntityId, PhysicalObject> = {};
const objectTypes = ['tree', 'ore', 'rock', 'misc'] as const;
type ObjectType = typeof objectTypes[number];

function getObjectType(obj: PhysicalObject): ObjectType | undefined {
  switch (obj.subtype) {
    case 'tree': return 'tree';
    case 'ore': return 'ore';
    case 'rock': return 'rock';
    default: {
      const mods = obj.Destructible?.damageModifiers ?? ({} as Partial<DamageModifiers>);
      const grouped = groupBy(Object.entries(mods), p => p[1] ?? '', p => p[0]);
      return ((grouped.immune?.length ?? 0) >= 8) ? 'misc' : undefined;
    }
  }
}

const root: Record<ObjectType, Record<EntityId, [PhysicalObject, number][]>> = {
  tree: {},
  ore: {},
  rock: {},
  misc: {},
};

for (const obj of objects) {
  if (!obj.Destructible) continue;
  objectMap[obj.id] = obj;
}
for (const obj of objects) {
  if (!obj.Destructible) continue;
  if (!obj.grow?.length && !objectLocationMap[obj.id]?.length) continue;
  const type = getObjectType(obj);
  if (type) {
    root[type][obj.id] = [...walk(obj, 1)];
  }
}

function* walk(item: PhysicalObject, mul: number): Generator<[PhysicalObject, number]> {
  if (Number.isFinite(item.Destructible?.hp)) {
    yield [item, mul];
  }
  for (const part of item.Destructible?.parts ?? []) {
    yield* walk(objectMap[part.id]!, part.num * mul);
  }
}

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
    const { Destructible } = obj;
    if (!Destructible) continue;
    if ((tool.toolTier ?? 0) < Destructible.minToolTier) return;    
    const damage = getTotalDamage(applyDamageModifiers(tool.damage[0], Destructible.damageModifiers));
    const [min, max] = getWeaponSkillFactor(skill);
    const stamina = tool.attacks[0]?.stamina ?? 0;
    const maxHits = Math.ceil(Destructible.hp / (damage * min));
    const minHits = Math.ceil(Destructible.hp / (damage * max));
    const avgHits = (minHits + maxHits) / 2;
    stats.hits[0] += minHits * num;
    stats.hits[1] += maxHits * num;
    stats.stamina += avgHits * stamina * num;
  }
  return stats;
}

function showStat(stats: MineStats | undefined, stat: MineStat) {
  if (stats == null) return null;
  const { hits, stamina } = stats;
  switch (stat) {
    case 'hits':
      return hits[0] === hits[1] ? String(hits[0]) : `${hits[0]}–${hits[1]}`;
    case 'stamina':
      return stamina;
    default:
      return assertNever(stat);
  }
}

function MiningTable({ id, tools, destructibles, skill, stat, onSetStat }: {
  id: string;
  tools: Weapon[];
  destructibles: Record<EntityId, [PhysicalObject, number][]>;
  skill: number;
  stat: MineStat;
  onSetStat: (stat: MineStat) => void;
}) {
  const translate = useContext(TranslationContext);
  return <section>
    <table width="100%" id={id}>
      <thead>
        <tr>
          <td>
            <select value={stat} onChange={e => onSetStat(e.target.value as MineStat)}>
              <option value="hits">hits</option>
              <option value="stamina">stamina</option>
            </select>
          </td>
          <td>{translate('ui.healthStructure')}</td>
          {tools.map(a => <td key={a.id}>
            <ItemIcon item={a} size={32} />
          </td>)}
        </tr>
      </thead>
      <tbody>
        {Object.entries(destructibles)
          .map(([id, objs]) => <tr key={id}>
            <td><Link to={`/obj/${id}`}>{translate(id)}</Link></td>
            <td>{objs.reduce((totalHp, [obj, num]) => totalHp + (obj.Destructible?.hp ?? 0) * num, 0)}</td>
            {tools.map(tool => <td key={tool.id}>
              {showStat(getHits(objs, tool, skill), stat)}
            </td>
            )}
          </tr>)
        }
      </tbody>
    </table>
  </section>
}

function parseObjectType(type?: string): ObjectType {
  return objectTypes.includes(type as ObjectType)
    ? type as ObjectType
    : 'tree';
}
 
function parseMiningStat(stat?: string): MineStat {
  switch (stat) {
    case 'hits':
    case 'stamina':
      return stat;
    default:
      return 'hits';
  }
}

export function Mining() {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const history = useHistory();
  const { objectType: urlObjectType, stat: urlStat } = useParams<{ objectType?: string, stat?: string }>();
  const objectType = parseObjectType(urlObjectType);
  const [skill, setSkill] = useState(0);
  const [stat, setStat] = useState<MineStat>(parseMiningStat(urlStat));
  const path = `/${pageName}/${objectType}/${stat}`;
  if (history.location.pathname !== path) {
    history.replace(path);
  }
  const destructibles = Object.fromEntries(objectTypes.map(type => [type, {}])) as typeof root;
  for (const type of objectTypes) {
    const copy: typeof root[ObjectType] = {};
    for (const [key, objs] of Object.entries(root[type])) {
      const newObjs = objs.filter(pair => pair[0].tier <= spoiler);
      if (newObjs.length) copy[key] = newObjs;
    }
    destructibles[type] = copy;
  }
  return (<>
    <h1>{translate('ui.mining')}</h1>
    <div className="Switch" role="tablist">
      {objectTypes
        .filter(type => Object.keys(destructibles[type]).length)
        .map(type => objectType === type
          ? <span key={type} className="Switch__Option Switch__Option--selected"
              role="tab" aria-selected="true" aria-controls={type}>
              {translate(`ui.mineType.${type}s`)}
            </span>
          : <Link key={type} className="Switch__Option" to={`/mining/${type}/${stat}`}
              role="tab" aria-selected="false">
              {translate(`ui.mineType.${type}s`)}
            </Link>
        )
      }
    </div>
    <div>
      <label>
        <SkillIcon skill={objectType === 'tree' ? 'WoodCutting' : 'Pickaxes'} useAlt />
        {' '}
        {translate('ui.skill')}:
        {' '}
        <input type="range"
          min="0" max="100" value={skill} onChange={e => setSkill(+e.target.value)}
          style={{ verticalAlign: 'middle', width: '190px' }} />
        {' '}
        <input type="number" inputMode="numeric" pattern="[0-9]*"
          min="0" max="100" value={skill} onChange={e => setSkill(+e.target.value)}
          style={{ width: '3em' }} />
      </label>
    </div>
    <MiningTable
      id={objectType}
      tools={(objectType === 'tree' ? allAxes : allPickaxes).filter(a => a.tier <= spoiler)}
      destructibles={destructibles[objectType]}
      skill={skill}
      stat={stat}
      onSetStat={setStat}
    />
  </>);
}
