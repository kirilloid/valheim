import React, { useContext } from 'react';

import type { SkillData } from './types';
import { SkillType } from '../../model/skills';

import { TranslationContext } from '../../effects';
import { SkillIcon } from '../parts/Icon';

export function Skills({ skillData } : { skillData: SkillData }) {
  const translate = useContext(TranslationContext);
  return <dl>
    {[...skillData.entries()]
      .filter(([, { level }]) => level)
      .map(([skill, { level, accumulator }]) => {
        return <React.Fragment key={skill}>
          <dt><SkillIcon size={32} skill={skill} useAlt={false} /> {translate(`ui.skillType.${SkillType[skill]}`)}</dt>
          <dd>
            <div style={{ width: 200, height: 32, position: 'relative', backgroundColor: 'gray' }}>
              <div style={{ width: 200 * level / 100, height: 24, backgroundColor: '#cc0' }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', color: 'white' }}
                className="text-outline">{Math.round(level)}</div>
              <div style={{ width: 200 * accumulator / 100, height: 8, backgroundColor: '#f80' }}></div>
            </div>
          </dd>
        </React.Fragment>;
      })
    }
  </dl>
}
