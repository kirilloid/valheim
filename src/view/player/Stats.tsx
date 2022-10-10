import React, { useContext } from 'react';

import type { Player } from '../../file/Player';
import { InlineObjectWithIcon } from '../helpers';

import { data } from '../../data/itemDB';
import { ItemIcon } from '../parts/Icon';
import { Biome, Resource } from '../../types';
import { TranslationContext } from '../../effects';

const stations: Record<string, string> = {
  '$piece_workbench': 'piece_workbench',
  '$piece_forge': 'forge',
  '$piece_cauldron': 'piece_cauldron',
  '$piece_stonecutter': 'piece_stonecutter',
  '$piece_artisanstation': 'piece_artisanstation',
};

const biomes = new Map<number, Biome>([
  [1, 'Meadows'],
  [2, 'Swamp'],
  [4, 'Mountain'],
  [8, 'BlackForest'],
  [16, 'Plains'],
  [32, 'Ashlands'],
  [64, 'DeepNorth'],
  [256, 'Ocean'],
  [512, 'Mistlands'],
]);

export function Stats({ player }: { player: Player }) {
  const translate = useContext(TranslationContext);
  const { stats, playerData } = player;
  return <>
    <dl>
      <dt>kills (PvP)</dt><dd>{stats.kills}</dd>
      <dt>deaths (any)</dt><dd>{stats.deaths}</dd>
      <dt>items crafted</dt><dd>{stats.crafts}</dd>
      <dt>structures built</dt><dd>{stats.builds}</dd>
    </dl>
    {playerData != null && <dl>
      <dt>known biomes</dt><dd>
        <ul>
          {playerData.knownBiome
            .map(b => biomes.get(b) ?? '')
            .filter(Boolean)
            .map(b => <li key={b}>{translate(`ui.biome.${b}`)}</li>)}
        </ul>
      </dd>
      <dt>known items</dt><dd>{playerData.knownMaterials.length}</dd>
      <dt>known recipes</dt><dd>{playerData.knownRecipes.length}</dd>
      <dt>known stations</dt><dd>
        <ul>{[...playerData.knownStations.entries()].map(([key, lvl]) => <li key={key}>
          <InlineObjectWithIcon id={stations[key] ?? ''} /> lvl. {lvl}
        </li>)}</ul>
      </dd>
      <dt>tutorials</dt><dd>{playerData.shownTutorials.length}</dd>
    </dl>}
  </>
}

const allTrophies = Object.values(data).filter(i => i.type === 'trophy' && !i.disabled) as (Resource & { type: 'trophy' })[];

export function Trophies({ trophies }: { trophies: string[] }) {
  const grid: string[][] = Array.from({ length: 6 }, () => Array.from({ length: 7 }, () => ''));
  const found = new Set(trophies);
  for (const item of allTrophies) {
    const pos = item.trophyPos;
    if (pos == null) continue;
    grid[pos.y]![pos.x] = item.id;
  }

  return <div className="TrophyRoom">
    {grid.map((row, y) => row.map((id, x) => {
      const item = data[id];
      if (item == null) return <div key={`${x}_${y}`}></div>;
      const classNames = ['TrophyRoom__slot'];
      if (found.has(id)) {
        classNames.push('TrophyRoom__slot--found');
      }
      return <div key={`${x}_${y}`} className={classNames.join(' ')}>
        <ItemIcon item={item} size={64} useAlt />
      </div>
    }))}
  </div>;
}
