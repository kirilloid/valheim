import React from 'react';

import type { Player } from './types';
import type { EditorProps } from '../parts/types';

import { FileInfo } from '../parts/FileInfo';
import { Worlds } from './Worlds';
import { Appearance } from './Appearance';
import { Inventory } from './Inventory';
import { Skills } from './Skills';
import { Stats } from './Stats';
import { Tabs } from '../parts/Tabs';

export function PlayerInfo({ value: player, onChange, file, disabled } : EditorProps<Player>) {
  const tabs = [
    {
      title: 'File',
      renderer: () => <FileInfo version={player.version} file={file} />
    },
    {
      title: `Worlds (${player.worlds.size})`,
      renderer: () => <Worlds value={player.worlds} onChange={worlds => onChange({ ...player, worlds })} />
    },
  ];
  const { playerData } = player;
  if (playerData) {
    tabs.push({
      title: 'Appearance',
      renderer: () => <Appearance value={playerData} onChange={playerData => onChange({ ...player, playerData })} />,
    });
    tabs.push({
      title: 'Inventory',
      renderer: () => <Inventory inventory={playerData.inventory} />,
    });
    const { skillData } = playerData;
    if (skillData) {
      tabs.push({
        title: 'Skills',
        renderer: () => <Skills skillData={skillData} />,
      });
      <h2>Skills</h2>
    }
    tabs.push({
      title: 'Stats',
      renderer: () => <Stats stats={player.stats} />,
    });
  }

  return <section className={disabled ? 'FileEditor--disabled' : ''}>
    <h1>{player.playerName}</h1>
    <Tabs tabs={tabs} selected={2} />
  </section>
}
