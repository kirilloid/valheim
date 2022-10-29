import React, { useContext } from 'react';

import type { Effect } from '../../../types';
import { SkillType } from '../../../model/skills';

import { TranslationContext } from '../../../effects';
import { List } from '../../helpers';

export function SetBonus({ bonus }: { bonus: Effect }) {
  const translate = useContext(TranslationContext);
  const parts = [];
  if (bonus.attackModifier != null) {
    parts.push(<span key="skill">{
      translate(`ui.skillType.${SkillType[bonus.attackModifier[0]]}`)}
      {' '}
      <span className="InvTooltip__value">+{bonus.attackModifier[1]}</span>
    </span>);
  }
  if (bonus.damageModifiers != null) {
    parts.push(<span key="resist">{
      Object
        .entries(bonus.damageModifiers)
        .map(([key, value]) => <React.Fragment key={key}>
          {translate(`ui.damageType.${key}`)}
          {': '}
          <span className="InvTooltip__value">{translate(`ui.damageModifier.${value}`)}</span>
        </React.Fragment>)
    }</span>);
  }
  return <List>{parts}</List>;
}