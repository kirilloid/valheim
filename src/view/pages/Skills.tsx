import React, { useContext, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { getBlockingSkillFactor, getBowDrawTime, getResourceUsageSkillFactor, getWeaponSkillFactor } from '../../model/combat';
import { skillTiers, SkillType } from '../../model/skills';
import { assertNever, clamp, lerp } from '../../model/utils';
import { skills as pageName } from '../../state';

import { TranslationContext, useGlobalState } from '../../effects';
import { EffectIcon, SkillIcon } from '../parts/Icon';
import { InlineObjectWithIcon, rangeBy, showNumber, showPercent, yesNo } from '../helpers';
import { SkillCodeMap } from '../player/Skills/smoothbrain';
import { DODGE_STAMINA } from '../../model/game';

const SkillRevMap = new Map([...SkillCodeMap.entries()].map(([key, val]) => [val, key]));

const skillNames = ['Swords', 'Knives', 'Clubs', 'Polearms', 'Spears', 'Blocking', 'Axes', 'Bows', 'ElementalMagic', 'BloodMagic', 'Unarmed', 'Pickaxes', 'WoodCutting', 'Crossbows', 'Jump', 'Sneak', 'Run', 'Swim', 'Fishing', 'Ride'] as const;
const xpTable: number[] = [];
for (let level = 1; level <= 100; level++) {
  xpTable.push(Math.pow(level + 1, 1.5) * 0.5 + 0.5);
}
xpTable.push(Infinity);

function VanillaSkillLevelUp({ skill }: { skill: SkillType }) {
  switch (skill) {
    case SkillType.Swords:
    case SkillType.Knives:
    case SkillType.Clubs:
    case SkillType.Polearms:
    case SkillType.Spears:
    case SkillType.Axes:
    case SkillType.Unarmed:
    case SkillType.Bows:
    case SkillType.Crossbows:
      return <>
        <dt>+1 xp</dt>
        <dd>hitting enemy</dd>
      </>
    case SkillType.Pickaxes:
      return <>
        <dt>+1 xp</dt>
        <dd>hitting object</dd>
      </>
    case SkillType.Blocking:
      return <>
        <dt>+1 xp</dt>
        <dd>block</dd>
        <dt>+2 xp</dt>
        <dd>parry</dd>
      </>
    case SkillType.ElementalMagic:
      return <>
        <dt>+1 xp/hit</dt>
        <dd><InlineObjectWithIcon id="StaffFireball" /></dd>
        <dt>+0.2 xp/hit</dt>
        <dd><InlineObjectWithIcon id="StaffIceShards" /></dd>
      </>
    case SkillType.BloodMagic:
      return <>
        <dt>+0.5 xp</dt>
        <dd>enemy hit by <InlineObjectWithIcon id="Skeleton_Friendly" /></dd>
        <dt>+1 xp</dt>
        <dd>shield from <InlineObjectWithIcon id="StaffShield" /> breaks</dd>
      </>
    case SkillType.WoodCutting:
      return <>
        <dt>+1 xp</dt>
        <dd>hitting a tree</dd>
      </>
    case SkillType.Jump:
      return <>
        <dt>+1 xp</dt>
        <dd>1 jump</dd>
      </>
    case SkillType.Sneak:
      return <>
        <dt>+1 xp/s</dt>
        <dd>sneaking near enemy</dd>
        <dt>+0.1 xp/s</dt>
        <dd>sneaking far from enemies</dd>
      </>
    case SkillType.Run:
      return <>
        <dt>+1 xp/s</dt>
        <dd>running</dd>
      </>
    case SkillType.Swim:
      return <>
        <dt>+1 xp/s</dt>
        <dd>swimming</dd>
      </>
    case SkillType.Fishing:
      return <>
        <dt>+1 xp/s</dt>
        <dd>baiting</dd>
        <dt>+2 xp/s</dt>
        <dd>pulling hooked</dd>
      </>
    case SkillType.Ride:
      return <>
        <dt>+1 xp/s</dt>
        <dd>riding</dd>
      </>
    case SkillType.All:
      return null;
    default:
      return assertNever(skill);
  }
}

function ModdedSkillLevelUp({ skill }: { skill: SkillType }) {
  const skillStr = SkillCodeMap.get(skill);
  switch (skillStr) {
    case 'Blacksmithing':
      return <>
        <dt>+10 xp</dt>
        <dd>per crafted/upgraded item: weapon, armor, but not ammo: arrows or bombs</dd>
      </>
  case 'PackHorse':
      return <>
        <dt>+1 xp</dt>
        <dd>per 1s carrying 90+% of max weight</dd>
      </>
    case 'Evasion':
      return <>
        <dt>+1 xp</dt>
        <dd>per dodge roll use</dd>
      </>
    case 'Tenacity':
      return <>
        <dt>+√(damage received) xp</dt>
        <dd>for actual damage received all reductions like block</dd>
      </>
    case 'Vitality':
      return <>
        <dt>+2√(health) xp</dt>
        <dd>of food item consumed</dd>
      </>
    case 'Lumberjacking':
      return <>
        <dt>+1 xp</dt>
        <dd>per hit of tree(s)</dd>
      </>
    case 'Building':
      return <>
        <dt>+1 xp</dt>
        <dd>per placed building piece</dd>
      </>
    case 'Ranching':
      return <>
        <dt>+5 xp</dt>
        <dd>with 10% chance per taming tick (3s)</dd>
        <dt>+35 xp</dt>
        <dd>when tamed creature is killed and player is within 50m</dd>
      </>
    case 'Alchemy':
      return <>
        <dt>+1 xp</dt>
        <dd>per gem upgraded</dd>
        <dt>+1 xp</dt>
        <dd>when socketing</dd>
      </>
    case 'Cooking':
      return <>
        <dt>+5 xp</dt>
        <dd>per item cooked</dd>
        <dt>+5 xp</dt>
        <dd>per new recipe?</dd>
      </>
    case 'Mining':
      return <>
        <dt>+1 xp</dt>
        <dd>per mineable item hit</dd>
      </>
    case 'Sailing':
      return <>
        <dt>+1 xp</dt>
        <dd>per 1s of sailing</dd>
        <dt>+35 xp</dt>
        <dd>per ship built</dd>
      </>
    case 'Farming':
      return <>
        <dt>+1 xp</dt>
        <dd>per plant planted</dd>
      </>
    case 'Dual Axes':
    case 'Dual Clubs':
    case 'Dual Knives':
    case 'Dual Swords':
    case 'Dual Offhand':
      return <>
        <dt>+1 xp</dt>
        <dd>per hit</dd>
      </>
    default:
      return null;
  }
}

function VanillaSkillEffect({ skill, level }: { skill: SkillType, level: number }) {
  const translate = useContext(TranslationContext);

  switch (skill) {
    case SkillType.Swords:
    case SkillType.Knives:
    case SkillType.Clubs:
    case SkillType.Polearms:
    case SkillType.Spears:
    case SkillType.Axes:
    case SkillType.Pickaxes:
    case SkillType.Unarmed:
      return <>
        <dt>{translate('ui.staminaUsage')}</dt>
        <dd>{showPercent(getResourceUsageSkillFactor(level))}</dd>
        <dt>{translate('ui.damage')}</dt>
        <dd>{rangeBy(getWeaponSkillFactor(level), showPercent)}</dd>
      </>
    case SkillType.Bows:
      return <>
        <dt>{translate('ui.staminaUsage')}</dt>
        <dd>{showPercent(getResourceUsageSkillFactor(level))}</dd>
        <dt>{translate('ui.damage')}</dt>
        <dd>{rangeBy(getWeaponSkillFactor(level), showPercent)}</dd>
        <dt>draw time</dt>
        <dd>{showPercent(getBowDrawTime(level))}</dd>
      </>
    case SkillType.Crossbows:
      return <>
        <dt>{translate('ui.staminaUsage')}</dt>
        <dd>{showPercent(getResourceUsageSkillFactor(level))}</dd>
        <dt>{translate('ui.damage')}</dt>
        <dd>{rangeBy(getWeaponSkillFactor(level), showPercent)}</dd>
        <dt>loading time</dt>
        <dd>{showPercent(1 - 0.5 * level / 100)}</dd>
      </>
    case SkillType.Blocking:
      return <>
        <dt>block</dt>
        <dd>{showPercent(getBlockingSkillFactor(level))}</dd>
      </>
    case SkillType.ElementalMagic:
      return <>
        <dt>{translate('ui.eitr')}</dt>
        <dd>{showPercent(getResourceUsageSkillFactor(level))}</dd>
        <dt>{translate('ui.damage')}</dt>
        <dd>{rangeBy(getWeaponSkillFactor(level), showPercent)}</dd>
      </>
    case SkillType.BloodMagic:
      return <>
        <dt>{translate('ui.eitr')}</dt>
        <dd>{showPercent(getResourceUsageSkillFactor(level))}</dd>
        <dt>{translate('ui.health')}</dt>
        <dd>{showPercent(getResourceUsageSkillFactor(level))}</dd>
      </>
    case SkillType.WoodCutting:
      return <>
        <dt>{translate('ui.damage')}</dt>
        <dd>{rangeBy(getWeaponSkillFactor(level), showPercent)}</dd>
      </>
    case SkillType.Jump:
      return <>
        <dt>jump height</dt>
        <dd>{showNumber(2 * (1 + 0.4 * level / 100) ** 2)}m</dd>
      </>
    case SkillType.Sneak:
      return <>
        <dt>{translate('ui.staminaUsage')}</dt>
        <dd>{showPercent(lerp(1, 0.25, Math.sqrt(level / 100)))}</dd>
        {/* clamp01(lerp(
          0.5 + lightFactor * 0.5,
          0.2 + lightFactor * 0.4,
          level
        )); */}
      </>
    case SkillType.Run:
      return <>
        <dt>{translate('ui.staminaUsage')}</dt>
        <dd>{showNumber(10 - 5 * level / 100)}/s</dd>
        <dt>{translate('ui.moveSpeed')}</dt>
        <dd>{translate('ui.speed.ms', showNumber(7 * (1 + 0.25 * level / 100)))}</dd>
      </>
    case SkillType.Swim:
      return <>
        <dt>{translate('ui.staminaUsage')}</dt>
        <dd>{showNumber(6 - 3 * level / 100)}/s</dd>
      </>
    case SkillType.Fishing:
      return <>
        <dt>pull stamina usage</dt>
        <dd>{showPercent(lerp(1, 0.2, level / 100))}</dd>
        <dt>pull speed</dt>
        <dd>{showNumber(lerp(2, 6, level / 100))}/s</dd>
      </>
    case SkillType.Ride:
      return <>
        <dt>{translate('ui.moveSpeed')}</dt>
        <dd>+{showPercent(0.25 * level / 100)}</dd>
      </>
    case SkillType.All:
      return null;
    default:
      return assertNever(skill);
  }
}

function ModdedSkillEffect({ skill, level }: { skill: SkillType, level: number }) {
  const translate = useContext(TranslationContext);

  const skillStr = SkillCodeMap.get(skill);
  switch (skillStr) {
    case 'Blacksmithing':
      return <>
        <dt>+1 to station level<sup>1</sup></dt>
        <dd>{yesNo(level >= 50)}</dd>
        <dt>+1 to max quality<sup>1</sup></dt>
        <dd>{yesNo(level >= 80)}</dd>
        <dt>items durability<sup>1</sup></dt>
        <dd>+{showPercent(level / 100)}</dd>
      </>
    case 'PackHorse':
      return <>
        <dt>carry weight</dt>
        <dd>+{showPercent(level / 100)}</dd>
      </>
    case 'Evasion':
      return <>
        <dt>stamina per dodge</dt>
        <dd>{showNumber(DODGE_STAMINA * (1 - 0.5 * level / 100))}</dd>
      </>
    case 'Tenacity':
      return <>
        <dt>damage reduction</dt>
        <dd>{showPercent(0.2 * level / 100)}</dd>
      </>
    case 'Vitality':
      return <>
        <dt>health</dt>
        <dd>+{showPercent(level / 100)}</dd>
      </>
    case 'Lumberjacking':
      return <>
        <dt>damage to trees<sup>1</sup></dt>
        <dd>+{showPercent(2 * level / 100)}</dd>
        <dt>drop yield<sup>1</sup></dt>
        <dd>+{showPercent(level / 100)}</dd>
        <dt>damage from trees<sup>1</sup></dt>
        <dd>-{showPercent(0.7 * level / 100)}</dd>
        <dt>move speed in forest<sup>1,2</sup></dt>
        <dd>+{showPercent(0.1 * level / 100)}</dd>
      </>
    case 'Building':
      return <>
        <dt>max support<sup>1</sup></dt>
        <dd>+{showPercent(0.5 * level / 100)}</dd>
        <dt>support loss<sup>1</sup></dt>
        <dd>-{showPercent(0.75 * level / 100)}</dd>
      </>
    case 'Ranching':
      return <>
        <dt>drop increase<sup>1</sup></dt>
        <dd>+{showPercent(level / 100)}</dd>
        <dt>taming speed<sup>1</sup></dt>
        <dd>+{showPercent(level / 100)}</dd>
        <dt>see if it's hungry<sup>1</sup></dt>
        <dd>{yesNo(level >= 10)}</dd>
        <dt>calming during taming<sup>1</sup></dt>
        <dd>{yesNo(level >= 20)}</dd>
        <dt>see if it's pregnant<sup>1</sup></dt>
        <dd>{yesNo(level >= 40)}</dd>
      </>
    case 'Alchemy':
      return <>
        <dt>chance of success<sup>1</sup></dt>
        <dd>+{showPercent(0.15 * level / 100)}</dd>
      </>
    case 'Cooking': {
      const HAPPY_MIN_LVL = 50;
      const roundedSkill = Math.round(level / 5) * 5;
      return <>
        <dt>cooked food stats<sup>1</sup></dt>
        <dd>+{showPercent(0.5 * level / 100)}</dd>
        <dt>perfect food chance<sup>1</sup></dt>
        <dd>{showPercent(Math.max(roundedSkill - HAPPY_MIN_LVL, 0) / 100)}</dd>
      </>
    }
    case 'Mining': {
      const EXPLOSION_MIN_LVL = 50;
      const EXPLOSION_CHANCE = 1;
      return <>
        <dt>damage to ores<sup>1</sup></dt>
        <dd>+{showPercent(2 * level / 100)}</dd>
        <dt>drop yield<sup>1</sup></dt>
        <dd>+{showPercent(level / 100)}</dd>
        <dt>chance to explode<sup>1</sup></dt>
        <dd>{showPercent(level < EXPLOSION_MIN_LVL
          ? 0
          : (level / 100 - (EXPLOSION_MIN_LVL - 10) / 100)
          /           (1 - (EXPLOSION_MIN_LVL - 10) / 100)
              * EXPLOSION_CHANCE / 100
        )}</dd>
        <dt>move speed in forest<sup>1,2</sup></dt>
        <dd>+{showPercent(0.1 * level / 100)}</dd>
      </>;
    }
    case 'Sailing':
      return <>
        <dt>exploration radius<sup>1</sup></dt>
        <dd>+{showPercent(4 * level / 100)}</dd>
        <dt>ship health<sup>1</sup></dt>
        <dd>+{showPercent(level / 100)}</dd>
      </>
    case 'Farming':
      return <>
        <dt>crop growth speed<sup>1</sup></dt>
        <dd>+{showPercent(2 * level / 100)}</dd>
        <dt>crop yield<sup>1</sup></dt>
        <dd>+{showPercent(level / 100)}</dd>
        <dt>plant items per click<sup>1</sup></dt>
        <dd>{1 + Math.floor(level / 20)}</dd>
        <dt>harvest items per click<sup>1</sup></dt>
        <dd>{1 + Math.floor(level / 20)}</dd>
        <dt>see progress<sup>1</sup></dt>
        <dd>{yesNo(level >= 30)}</dd>
        <dt>ignore biome<sup>1</sup></dt>
        <dd>{yesNo(level >= 50)}</dd>
      </>
    case 'Dual Axes':
    case 'Dual Clubs':
    case 'Dual Knives':
    case 'Dual Swords':
    case 'Dual Offhand':
      return <>
        <dt>{translate('ui.staminaUsage')}</dt>
        <dd>{showPercent(getResourceUsageSkillFactor(level))}</dd>
        <dt>{translate('ui.damage')}</dt>
        <dd>{rangeBy(getWeaponSkillFactor(level), showPercent)}</dd>
      </>
    default:
      return null;
  }
}

function parseSkill(skill?: string): SkillType {
  if (skill == null) return SkillType.Axes;
  return skill in SkillType
    ? SkillType[skill as keyof typeof SkillType]
    : (SkillRevMap.get(skill) ?? SkillType.Axes);
}
 
function parseLevel(level?: string): number {
  return clamp(~~Number(level) || 0, 0, 100);
}

export function Skills() {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);

  const history = useHistory();
  const { skill: urlSkill, level: urlLevel } = useParams<{ skill?: string, level?: string }>();
  const [skill, setSkill] = useState(parseSkill(urlSkill));
  const [level, setLevel] = useState(parseLevel(urlLevel));
  const isVanillaSkill = skill in SkillType;

  const skillStr = isVanillaSkill ? SkillType[skill] : SkillCodeMap.get(skill);
  const path = `/${pageName}/${skillStr}/${level}`;
  if (history.location.pathname !== path) {
    history.replace(path);
  }

  const xpToNextLevel = xpTable[level];

  return (<>
    <h2>{translate('ui.page.skills')}</h2>
    <dl>
      <dt>{translate('ui.skill')}</dt>
      <dd>
        <SkillIcon skill={skillStr} useAlt={false} size={24} />
        {' '}
        <select value={skill} onChange={e => setSkill(Number(e.target.value))}>
          <optgroup label="Vanilla">
            {skillNames
              .filter(skill => skillTiers[SkillType[skill]] <= spoiler)
              .map(skill => <option value={SkillType[skill]} key={skill}>{translate(`ui.skillType.${skill}`)}</option>)}
          </optgroup>
          <optgroup label="Modded">
            {[...SkillCodeMap.entries()]
              .map(([id, name]) => <option value={id} key={name}>{translate(`ui.skillType.${name}`)}</option>)}
          </optgroup>
        </select>
      </dd>
      <dt>{translate('ui.level')}</dt>
      <dd>
        <input type="number" inputMode="numeric" pattern="[0-9]*"
          min="0" max="100" value={level} onChange={e => setLevel(+e.target.value)}
          style={{ width: '3em' }} />
        {' '}
        <input type="range"
          style={{ verticalAlign: 'middle', width: 300 }}
          min="0" max="100" value={level} onChange={e => setLevel(+e.target.value)} />
        {' '}
      </dd>
      <dt>xp to next level</dt>
      <dd>{Number.isFinite(xpToNextLevel) ? Math.ceil(xpToNextLevel!) : '\u2012'}</dd>
    </dl>
    {!isVanillaSkill && <div>Most modded skills could be configured. Default config values are used.</div>}
    <h2>level-up</h2>
    <div>Those numbers are affected by effects like <Link to="/effect/Rested"><EffectIcon id="Rested" size={16} /> {translate('ui.effect.Rested')}</Link></div>
    <dl>
      {isVanillaSkill
        ? <VanillaSkillLevelUp skill={skill} />
        : <ModdedSkillLevelUp skill={skill} />}
    </dl>
    <h2>effect</h2>
    <dl>
      {isVanillaSkill
        ? <VanillaSkillEffect skill={skill} level={level} />
        : <ModdedSkillEffect skill={skill} level={level} />}
    </dl>
  </>);
}
