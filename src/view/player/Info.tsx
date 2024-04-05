import React, { useCallback, useContext } from 'react';

import type { Player, Inventory as TInventory, SkillData } from './types';
import type { EditorProps } from '../parts/types';

import { skillTiers } from '../../model/skills';
import { DEFAULT_MIN_DATE } from '../../model/game';

import { FileInfo } from '../parts/file';
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
  const onCheatChange = useCallback((player: Player) => onChange({ ...player, usedCheats: true }), [onChange]);

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
          onChange={skillData => onCheatChange({ ...player, playerData: { ...playerData, skillData } })}
          onInitSkills={() => {
            const basicSkills = Object
              .entries(skillTiers)
              .filter(([_, tier]) => tier === 0)
              .map(([key, _]) => Number(key));
            const skillData: SkillData = new Map(basicSkills.map(skill => [skill, { level: 0, accumulator: 0 }]));
            onChange({ ...player, playerData: { ...playerData, skillData } });
          }}
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

  const MIN_TIME = DEFAULT_MIN_DATE.getTime();
  const MAX_TIME = Date.now();

  return <section className={disabled ? 'FileEditor--disabled' : ''}>
    <h1>{player.playerName}</h1>
    {( player.dateCreated.getTime() > MAX_TIME
    || player.dateCreated.getTime() < MIN_TIME) && <div className="error">
      Date created is wrong. Would you like to
      {' '}
      <button className="btn btn--primary" onClick={() => {
        const dateCreated = new Date(player.dateCreated.getTime() / 1000);
        if (dateCreated.getTime() < MIN_TIME) dateCreated.setTime(MIN_TIME);
        if (dateCreated.getTime() > MAX_TIME) dateCreated.setTime(MAX_TIME);
        onChange({ ...player, dateCreated });
      }}>fix it</button>?
    </div>}
    {/* <div>created: {player.dateCreated.toDateString()}</div> */}
    <Tabs tabs={tabs} selected={2} />
  </section>
}
