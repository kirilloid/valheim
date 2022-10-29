import React, { useContext, useState } from 'react';

import '../../css/Skills.css';

import type { PlayerData, SkillData } from '../types';
import { SkillType } from '../../../model/skills';
import { xp } from '../../../model/game';

import { TranslationContext } from '../../../effects';
import { SkillIcon } from '../../parts/Icon';

import { MagicOverhaul } from './magic-overhaul';
import { Deadheim } from './deadheim';
import { SkillCodeMap } from './smoothbrain';

function Skill({ skill, value, onChange }: {
  skill: SkillType;
  value: { level: number; accumulator: number };
  onChange: (level: number) => void;
}) {
  const translate = useContext(TranslationContext);
  const { level, accumulator } = value;
  const inLevelPercent = accumulator / xp(level + 1);

  const skillStr = SkillType[skill] ?? SkillCodeMap.get(skill);
  
  return <React.Fragment>
    <dt>
      <SkillIcon size={32} skill={skillStr} useAlt={false} />
      {' '}
      {skillStr
        ? translate(`ui.skillType.${skillStr}`)
        : `Unknown skill v${skill}`
      }
    </dt>
    <dd>
      <div className="SkillBar">
        <div className="SkillBar__level" style={{ width: `${level}%` }}></div>
        <input className="SkillBar__value text-outline"
          type="number" inputMode="numeric"
          value={Math.floor(level)} min={0} max={100} onChange={e => {
            const value = Number(e.target.value);
            if (!Number.isNaN(value)) {
              onChange(Math.min(value, 100));
            }
          }} />
        <div className="SkillBar__sublevel" style={{ width: `${100 * inLevelPercent}%` }}></div>
      </div>
    </dd>
  </React.Fragment>;
}

export function Skills({ skillData, onChange, playerData } : {
  skillData: SkillData;
  onChange: (value: SkillData) => void;
  playerData: PlayerData;
}) {
  const entries = [...skillData.entries()];
  const [showAll, setShowAll] = useState(false);
  const nonZeroEntries = entries.filter(([, { level }]) => level);
  return <div>
    <h3>Valheim</h3>
    <dl>
      {(showAll ? entries : nonZeroEntries)
        .map(([skill, value]) => <Skill skill={skill} value={value} key={skill}
          onChange={value => {
            const pair = { level: value, accumulator: 0 };
            const newSkills = new Map([...skillData.entries(), [skill, pair]]);
            onChange(newSkills);
          }} />)
      }
    </dl>
    {!showAll && <button className="btn btn--sm" onClick={() => setShowAll(true)}>Show all skills</button>}
    <MagicOverhaul playerData={playerData} />
    <Deadheim playerData={playerData} />
  </div>
}
