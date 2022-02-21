import React, { useContext } from 'react';

import '../../css/Skills.css';

import type { PlayerData, SkillData } from './types';
import { SkillType } from '../../model/skills';

import { TranslationContext } from '../../effects';
import { SkillIcon } from '../parts/Icon';
import { xp } from '../../model/game';
import { readExtraSkills } from './ValheimLevelSystemVLS';

export function Skills({ skillData, playerData } : { skillData: SkillData; playerData: PlayerData }) {
  const translate = useContext(TranslationContext);
  const deadHeim = readExtraSkills(playerData);
  return <div>
    <h3>Valheim</h3>
    <dl>
      {[...skillData.entries()]
        .filter(([, { level }]) => level)
        .map(([skill, { level, accumulator }]) => {
          const inLevelPercent = accumulator / xp(level + 1);
          return <React.Fragment key={skill}>
            <dt><SkillIcon size={32} skill={skill} useAlt={false} /> {translate(`ui.skillType.${SkillType[skill]}`)}</dt>
            <dd>
              <div className="SkillBar">
                <div className="SkillBar__level" style={{ width: `${level}%` }}></div>
                <div className="SkillBar__value text-outline">{Math.floor(level)}</div>
                <div className="SkillBar__sublevel" style={{ width: `${100 * inLevelPercent}%` }}></div>
              </div>
            </dd>
          </React.Fragment>;
        })
      }
    </dl>
    {deadHeim != null && <React.Fragment key="deadheim">
      <h3>Deadheim</h3>
      <div>Level: {deadHeim.lvl}</div>
      <dl>
        {Object.entries(deadHeim.skills).map(([skill, lvl]) => <React.Fragment key={skill}>
          <dt>{skill}</dt><dd>{lvl}</dd>
        </React.Fragment>)}
      </dl>
      <div>Exp: {deadHeim.exp}</div>
      <div>Available Points: {deadHeim.points}</div>
    </React.Fragment>}
  </div>
}
