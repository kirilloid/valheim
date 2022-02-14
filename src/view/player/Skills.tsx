import React, { useContext } from 'react';

import '../../css/Skills.css';

import type { SkillData } from './types';
import { SkillType } from '../../model/skills';

import { TranslationContext } from '../../effects';
import { SkillIcon } from '../parts/Icon';
import { xp } from '../../model/game';

export function Skills({ skillData } : { skillData: SkillData }) {
  const translate = useContext(TranslationContext);
  return <dl>
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
}
