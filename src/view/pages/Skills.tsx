import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getBlockingSkillFactor, getBowDrawTime, getResourceUsageSkillFactor, getWeaponSkillFactor } from '../../model/combat';
import { skillTiers, SkillType } from '../../model/skills';
import { assertNever, clamp, lerp } from '../../model/utils';
import { skills as pageName } from '../../state';

import { TranslationContext, useGlobalState } from '../../effects';
import { SkillIcon } from '../parts/Icon';
import { rangeBy, showNumber, showPercent } from '../helpers';

const skillNames = ['Swords', 'Knives', 'Clubs', 'Polearms', 'Spears', 'Blocking', 'Axes', 'Bows', 'ElementalMagic', 'BloodMagic', 'Unarmed', 'Pickaxes', 'WoodCutting', 'Crossbows', 'Jump', 'Sneak', 'Run', 'Swim', 'Fishing', 'Ride'] as const;

function VanillaSkill({ skill, level }: { skill: SkillType, level: number }) {
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
        <dt>{translate('ui.damage')}</dt>
        <dd>{rangeBy(getWeaponSkillFactor(level), showPercent)}</dd>
      </>
    case SkillType.WoodCutting:
      return <>
        <dt>{translate('ui.damage')}</dt>
        <dd>{rangeBy(getWeaponSkillFactor(level), showPercent)}</dd>
      </>
    case SkillType.Jump:
      return <>
        <dt>jump height</dt>
        <dd>{showNumber(2 * Math.pow(1 + 0.4 * level / 100, 2))}m</dd>
      </>
    case SkillType.Sneak:
      return <>
        <dt>{translate('ui.staminaUsage')}</dt>
        <dd>{showPercent(lerp(1, 0.25, Math.sqrt(level / 100)))}</dd>
        {/* clamp01(lerp(
          0.5 + lightFactor * 0.5,
          0.2 + lightFactor * 0.4, level
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

function parseSkill(skill?: string): SkillType {
  if (skill == null) return SkillType.Axes;
  return skill in SkillType ? SkillType[skill as keyof typeof SkillType] : SkillType.Axes;
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

  const path = `/${pageName}/${SkillType[skill]}/${level}`;
  if (history.location.pathname !== path) {
    history.replace(path);
  }

  return (<>
    <h2>{translate('ui.skill')}</h2>
    <dl>
      <dt>{translate('ui.skill')}</dt>
      <dd>
        <SkillIcon skill={SkillType[skill]} useAlt={false} />
        {' '}
        <select value={skill} onChange={e => setSkill(Number(e.target.value))}>
          {skillNames
            .filter(skill => skillTiers[SkillType[skill]] <= spoiler)
            .map(skill => <option value={SkillType[skill]} key={skill}>{translate(`ui.skillType.${skill}`)}</option>)}
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
    </dl>
    <h2>effect</h2>
    <dl>
      <VanillaSkill skill={skill} level={level} />
    </dl>
  </>);
}
