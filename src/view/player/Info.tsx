import React from 'react';

import type { Player } from './types';
import type { ValueProps } from '../parts/types';
import { Worlds } from './Worlds';
import { Appearance } from './Appearance';
import { Inventory } from './Inventory';
import { Skills } from './Skills';
import { Stats } from './Stats';

export function PlayerInfo({ value: player, onChange } : ValueProps<Player> & { fileName: string }) {
  return <section>
    <h1>{player.playerName}</h1>
    <h2>Worlds ({player.worlds.size})</h2>
    <Worlds value={player.worlds} onChange={worlds => onChange({ ...player, worlds })} />
    {player.playerData && <>
      <h2>Appearance</h2>
      <Appearance value={player.playerData} onChange={playerData => onChange({ ...player, playerData })} />
      <h2>Inventory</h2>
      <Inventory inventory={player.playerData.inventory} />
      {player.playerData.skillData && <>
        <h2>Skills</h2>
        <Skills skillData={player.playerData.skillData} />
      </>}
    </>}
    <h2>Stats</h2>
    <Stats stats={player.stats} />
  </section>
}

