import React, { useContext } from 'react';

import type { PlayerData } from '../types';
import { readExtraSkills } from '../MagicOverhaul';
import { Class } from '../../../mods/magic-overhaul';

import { TranslationContext } from '../../../effects';

export function MagicOverhaul({ playerData }: { playerData: PlayerData }) {
  const translate = useContext(TranslationContext);
  const data = readExtraSkills(playerData);

  if (data == null) return null;

  return <>
    <h3>Magic Overhaul</h3>
    <div>Class: {translate(`ui.mods.MagicOverhaul.class.${Class[data.class]}`)}</div>
    <dl>
      {[...data.skills.entries()].map(([cls, { level }]) => <React.Fragment key={cls}>
        <dt>{Class[cls]}</dt><dd>{level}</dd>
      </React.Fragment>)}
    </dl>
    <div>Souls: {data.souls}</div>
  </>
}
