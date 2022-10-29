import React, { useCallback, useContext } from 'react';

import type { Player, Inventory as TInventory } from './types';
import type { EditorProps } from '../parts/types';

import { FileInfo } from '../parts/FileInfo';
import { Tabs } from '../parts/Tabs';

import { Worlds } from './Worlds';
import { Appearance } from './Appearance';
import { Inventory } from './Inventory';
import { Skills } from './Skills';
import { Stats, Trophies } from './Stats';
import { readExtraSlots } from './EquipmentAndQuickSlots';

import { TranslationContext } from '../../effects';

function renameCrafter({ version, items }: TInventory, id: bigint, oldName: string, newName: string) {
  return {
    version: version,
    items: items.map(
      item => item.crafterID === id
      // some extended data is written into crafterName
      // String#replace(string, ...) replaces only first occurence
      ? { ...item, crafterName: item.crafterName.replace(oldName, newName), }
      : item
    ),
  }
}

export function PlayerInfo({ value: player, onChange, file, disabled } : EditorProps<Player>) {
  const translate = useContext(TranslationContext);

  const onWorldsChange = useCallback((worlds: Player['worlds']) => onChange({ ...player, worlds }), [player, onChange]);
  const onPlayerDataChange = useCallback((playerData: Player['playerData']) => onChange({ ...player, playerData }), [player, onChange]);

  const tabs = [
    {
      title: translate('ui.file'),
      renderer: () => <FileInfo version={player.version} file={file} />
    },
    {
      title: translate('ui.character.worlds', player.worlds.size),
      renderer: () => <Worlds value={player.worlds} onChange={onWorldsChange} />
    },
  ];

  const { playerData } = player;

  if (playerData) {
    const extras = readExtraSlots(playerData);
    tabs.push({
      title: translate('ui.character.appearance'),
      renderer: () => <Appearance
        value={playerData} onChange={onPlayerDataChange}
        name={player.playerName} onNameChange={playerName => {
          const inventory = renameCrafter(playerData.inventory, player.playerID, player.playerName, playerName);
          onChange({
            ...player,
            playerData: { ...playerData, inventory, },
            playerName,
          });
        }}
      />,
    });
    tabs.push({
      title: translate('ui.character.inventory'),
      renderer: () => <Inventory playerData={playerData} extras={extras} />,
    });
    const { skillData } = playerData;
    if (skillData) {
      tabs.push({
        title: translate('ui.character.skills'),
        renderer: () => <Skills skillData={skillData}
          onChange={sd => onChange({ ...player, playerData: { ...playerData, skillData: sd } })}
          playerData={playerData} />,
      });
    }
    tabs.push({
      title: translate('ui.character.trophies'),
      renderer: () => <Trophies trophies={player.playerData?.trophies ?? []} />,
    });
    tabs.push({
      title: translate('ui.character.statistics'),
      renderer: () => <Stats player={player} />,
    });
  }

  return <section className={disabled ? 'FileEditor--disabled' : ''}>
    <h1>{player.playerName}</h1>
    <Tabs tabs={tabs} selected={2} />
  </section>
}
