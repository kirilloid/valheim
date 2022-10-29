import React from 'react';

import type { PlayerData } from '../types';
import { readExtraSkills } from '../ValheimLevelSystemVLS';

export function Deadheim({ playerData }: { playerData: PlayerData }) {
  const data = readExtraSkills(playerData);

  if (data == null) return null;

  return <>
    <h3>Deadheim</h3>
    <div>Level: {data.lvl}</div>
    <dl>
      {Object.entries(data.skills).map(([skill, lvl]) => <React.Fragment key={skill}>
        <dt>{skill}</dt><dd>{lvl}</dd>
      </React.Fragment>)}
    </dl>
    <div>Exp: {data.exp}</div>
    <div>Available Points: {data.points}</div>
  </>
}
