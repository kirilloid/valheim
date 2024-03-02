import React, { useContext } from 'react';

import type { Player } from '../../file/Player';
import { InlineObjectWithIcon } from '../helpers';

import '../../css/Stats.css';

import { data } from '../../data/itemDB';
import { EffectIcon, Icon, ItemIcon } from '../parts/Icon';
import { Biome, Creature, EntityId, Resource } from '../../types';
import { TranslationContext } from '../../effects';
import { PlayerStatType } from '../../file/PlayerStatType';
import { Tabs } from '../parts/Tabs';
import { creatures } from '../../data/creatures';
import { runeText } from '../../effects/translation.effect';

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

  return <Tabs tabs={[
    {
      title: 'summary',
        renderer: () => <dl>
          <dt>kills (PvP)</dt><dd>{stats[PlayerStatType.PlayerKills] ?? 0}</dd>
          <dt>deaths (any)</dt><dd>{stats[PlayerStatType.Deaths] ?? 0}</dd>
          <dt>cheated</dt><dd>{stats[PlayerStatType.Cheats] ?? 0}</dd>
          <dt>items crafted</dt><dd>{stats[PlayerStatType.Crafts] ?? 0}</dd>
          <dt>structures built</dt><dd>{stats[PlayerStatType.Builds] ?? 0}</dd>
          <dt>trophies</dt><dd>{playerData?.trophies.length ?? 0}</dd>
        {playerData != null && <>
          <dt>biomes</dt><dd>{playerData.knownBiome.length}</dd>
          <dt>known items</dt><dd>{playerData.knownMaterials.length}</dd>
          <dt>known recipes</dt><dd>{playerData.knownRecipes.length}</dd>
          <dt>known stations</dt><dd>{playerData.knownStations.size}</dd>
        </>}
      </dl>
    },
    {
      title: 'deaths',
      renderer: () => <div><dl>
        <dt>Total</dt><dd>{stats[PlayerStatType.Deaths] ?? 0}</dd>
        <dt>Unknown</dt><dd>{stats[PlayerStatType.DeathByUndefined] ?? 0}</dd>
        <dt>EnemyHit</dt><dd>{stats[PlayerStatType.DeathByEnemyHit] ?? 0}</dd>
        <dt>PlayerHit</dt><dd>{stats[PlayerStatType.DeathByPlayerHit] ?? 0}</dd>
        <dt>Fall</dt><dd>{stats[PlayerStatType.DeathByFall] ?? 0}</dd>
        <dt>Drowning</dt><dd>{stats[PlayerStatType.DeathByDrowning] ?? 0}</dd>
        <dt>Burning</dt><dd>{stats[PlayerStatType.DeathByBurning] ?? 0}</dd>
        <dt>Freezing</dt><dd>{stats[PlayerStatType.DeathByFreezing] ?? 0}</dd>
        <dt>Poisoned</dt><dd>{stats[PlayerStatType.DeathByPoisoned] ?? 0}</dd>
        <dt>Smoke</dt><dd>{stats[PlayerStatType.DeathBySmoke] ?? 0}</dd>
        <dt>Water</dt><dd>{stats[PlayerStatType.DeathByWater] ?? 0}</dd>
        <dt>EdgeOfWorld</dt><dd>{stats[PlayerStatType.DeathByEdgeOfWorld] ?? 0}</dd>
        <dt>Impact</dt><dd>{stats[PlayerStatType.DeathByImpact] ?? 0}</dd>
        <dt>Cart</dt><dd>{stats[PlayerStatType.DeathByCart] ?? 0}</dd>
        <dt>Tree</dt><dd>{stats[PlayerStatType.DeathByTree] ?? 0}</dd>
        <dt>Self</dt><dd>{stats[PlayerStatType.DeathBySelf] ?? 0}</dd>
        <dt>Structural</dt><dd>{stats[PlayerStatType.DeathByStructural] ?? 0}</dd>
        <dt>Turret</dt><dd>{stats[PlayerStatType.DeathByTurret] ?? 0}</dd>
        <dt>Boat</dt><dd>{stats[PlayerStatType.DeathByBoat] ?? 0}</dd>
        <dt>Stalagtite</dt><dd>{stats[PlayerStatType.DeathByStalagtite] ?? 0}</dd>
      </dl></div>
    },
    {
      title: 'fight',
      renderer: () => <div><dl>
        <dt>Enemy hits</dt><dd>{stats[PlayerStatType.EnemyHits] ?? 0}</dd>
        <dt>Enemy kills</dt><dd>{stats[PlayerStatType.EnemyKills] ?? 0}</dd>
        <dt>Enemy kills last hits</dt><dd>{stats[PlayerStatType.EnemyKillsLastHits] ?? 0}</dd>
        <dt>Boss kills</dt><dd>{stats[PlayerStatType.BossKills] ?? 0}</dd>
        <dt>Boss last hits</dt><dd>{stats[PlayerStatType.BossLastHits] ?? 0}</dd>
        <dt>Player hits</dt><dd>{stats[PlayerStatType.PlayerHits] ?? 0}</dd>
        <dt>Player kills</dt><dd>{stats[PlayerStatType.PlayerKills] ?? 0}</dd>
        <dt>Hits taken from enemies</dt><dd>{stats[PlayerStatType.HitsTakenEnemies] ?? 0}</dd>
        <dt>Hits taken from players</dt><dd>{stats[PlayerStatType.HitsTakenPlayers] ?? 0}</dd>
        <dt>Creatures tamed</dt><dd>{stats[PlayerStatType.CreatureTamed] ?? 0}</dd>
        <dt>Skeleton summons</dt><dd>{stats[PlayerStatType.SkeletonSummons] ?? 0}</dd>
        <dt>Arrows shot</dt><dd>{stats[PlayerStatType.ArrowsShot] ?? 0}</dd>
        <dt>Turret ammo added</dt><dd>{stats[PlayerStatType.TurretAmmoAdded] ?? 0}</dd>
        <dt>Turret trophy set</dt><dd>{stats[PlayerStatType.TurretTrophySet] ?? 0}</dd>
        <dt>Traps armed</dt><dd>{stats[PlayerStatType.TrapArmed] ?? 0}</dd>
        <dt>Traps triggered</dt><dd>{stats[PlayerStatType.TrapTriggered] ?? 0}</dd>
      </dl></div>
    },
    {
      title: 'resources',
      renderer: () => <div>
        <p>Only "honest" hits are considered. Treevalanche or mining under and collapsing a deposit don't increase your stats</p>
        <h3>Trees</h3>
        <dl>
          <dt>Trees</dt><dd>{stats[PlayerStatType.Tree] ?? 0}</dd>
          <dt>Tier0</dt><dd>{stats[PlayerStatType.TreeTier0] ?? 0}</dd>
          <dt>Tier1</dt><dd>{stats[PlayerStatType.TreeTier1] ?? 0}</dd>
          <dt>Tier2</dt><dd>{stats[PlayerStatType.TreeTier2] ?? 0}</dd>
          <dt>Tier3</dt><dd>{stats[PlayerStatType.TreeTier3] ?? 0}</dd>
          <dt>Tier4</dt><dd>{stats[PlayerStatType.TreeTier4] ?? 0}</dd>
          <dt>Tier5</dt><dd>{stats[PlayerStatType.TreeTier5] ?? 0}</dd>
          <dt>hits</dt><dd>{stats[PlayerStatType.TreeChops] ?? 0}</dd>
          <dt>Logs</dt><dd>{stats[PlayerStatType.Logs] ?? 0}</dd>
          <dt>LogChops</dt><dd>{stats[PlayerStatType.LogChops] ?? 0}</dd>
        </dl>
        <h3>Mining</h3>
        <dl>
          <dt>hits</dt><dd>{stats[PlayerStatType.MineHits] ?? 0}</dd>
          <dt>nodes</dt><dd>{stats[PlayerStatType.Mines] ?? 0}</dd>
          <dt>Tier0</dt><dd>{stats[PlayerStatType.MineTier0] ?? 0}</dd>
          <dt>Tier1</dt><dd>{stats[PlayerStatType.MineTier1] ?? 0}</dd>
          <dt>Tier2</dt><dd>{stats[PlayerStatType.MineTier2] ?? 0}</dd>
          <dt>Tier3</dt><dd>{stats[PlayerStatType.MineTier3] ?? 0}</dd>
          <dt>Tier4</dt><dd>{stats[PlayerStatType.MineTier4] ?? 0}</dd>
          <dt>Tier5</dt><dd>{stats[PlayerStatType.MineTier5] ?? 0}</dd>
        </dl>
        <h3>Misc</h3>
        <dl>
          <dt>Honey</dt><dd>{stats[PlayerStatType.BeesHarvested] ?? 0}</dd>
          <dt>Sap</dt><dd>{stats[PlayerStatType.SapHarvested] ?? 0}</dd>
        </dl>
      </div>
    },
    {
      title: 'travel',
      renderer: () => <div>
        <dl>
          <dt>World loads</dt><dd>{stats[PlayerStatType.WorldLoads] ?? 0}</dd>
          <dt>Portals taken</dt><dd>{stats[PlayerStatType.PortalsUsed] ?? 0}</dd>
          <dt>Jumps</dt><dd>{stats[PlayerStatType.Jumps] ?? 0}</dd>
          <dt>Traveled</dt><dd>{(stats[PlayerStatType.DistanceTraveled] ?? 0) / 1000} km</dd>
          <dt>Walk</dt><dd>{(stats[PlayerStatType.DistanceWalk] ?? 0) / 1000} km</dd>
          <dt>Run</dt><dd>{(stats[PlayerStatType.DistanceRun] ?? 0) / 1000} km</dd>
          <dt>Sail</dt><dd>{(stats[PlayerStatType.DistanceSail] ?? 0) / 1000} km</dd>
          <dt>Air</dt><dd>{(stats[PlayerStatType.DistanceAir] ?? 0) / 1000} km</dd>
        </dl>
      </div>
    },
    {
      title: 'adventure',
      renderer: () => <div>
        <dl>
          <dt><ItemIcon item={data.Hammer} /> Builds</dt><dd>{stats[PlayerStatType.Builds] ?? 0}</dd>
          <dt>ItemsPickedUp</dt><dd>{stats[PlayerStatType.ItemsPickedUp] ?? 0}</dd>
          <dt>CraftsOrUpgrades</dt><dd>{stats[PlayerStatType.CraftsOrUpgrades] ?? 0}</dd>
          <dt>Crafts</dt><dd>{stats[PlayerStatType.Crafts] ?? 0}</dd>
          <dt>Upgrades</dt><dd>{stats[PlayerStatType.Upgrades] ?? 0}</dd>
          <dt>TimeInBase</dt><dd>{stats[PlayerStatType.TimeInBase] ?? 0} s</dd>
          <dt>TimeOutOfBase</dt><dd>{stats[PlayerStatType.TimeOutOfBase] ?? 0} s</dd>
          <dt><ItemIcon item={data.bed} />Sleep</dt><dd>{stats[PlayerStatType.Sleep] ?? 0} times</dd>
          <dt><ItemIcon item={data.piece_chest_wood} /> Placed stacks</dt><dd>{stats[PlayerStatType.PlaceStacks] ?? 0}</dd>
          <dt><Icon id="food" alt="" size={32} /> Foods eaten</dt><dd>{stats[PlayerStatType.FoodEaten] ?? 0}</dd>
          <dt><ItemIcon item={data.wood_door} /> DoorsOpened</dt><dd>{stats[PlayerStatType.DoorsOpened] ?? 0}</dd>
          <dt><ItemIcon item={data.wood_door} /> DoorsClosed</dt><dd>{stats[PlayerStatType.DoorsClosed] ?? 0}</dd>
          <dt><ItemIcon item={data.itemstand} /> Item stand Uses</dt><dd>{stats[PlayerStatType.ItemStandUses] ?? 0}</dd>
          <dt><ItemIcon item={data.ArmorStand} /> Armor stand uses</dt><dd>{stats[PlayerStatType.ArmorStandUses] ?? 0}</dd>
        </dl>
      </div>
    },
    {
      title: 'powers',
      renderer: () => <div>
        <table>
          <thead>
            <tr><td>power</td><td>set</td><td>use</td></tr>
          </thead>
          <tbody>
            <tr>
              <td>Total</td>
              <td>{stats[PlayerStatType.SetGuardianPower] ?? 0}</td>
              <td>{stats[PlayerStatType.UseGuardianPower] ?? 0}</td>
            </tr>
            <tr>
              <td><EffectIcon id="GP_Eikthyr" /> {translate('GP_Eikthyr')}</td>
              <td>{stats[PlayerStatType.SetPowerEikthyr] ?? 0}</td>
              <td>{stats[PlayerStatType.UsePowerEikthyr] ?? 0}</td>
            </tr>
            <tr>
              <td><EffectIcon id="GP_TheElder" /> {translate('GP_TheElder')}</td>
              <td>{stats[PlayerStatType.SetPowerElder] ?? 0}</td>
              <td>{stats[PlayerStatType.UsePowerElder] ?? 0}</td>
            </tr>
            <tr>
              <td><EffectIcon id="GP_Bonemass" /> {translate('GP_Bonemass')}</td>
              <td>{stats[PlayerStatType.SetPowerBonemass] ?? 0}</td>
              <td>{stats[PlayerStatType.UsePowerBonemass] ?? 0}</td>
            </tr>
            <tr>
              <td><EffectIcon id="GP_Moder" /> {translate('GP_Moder')}</td>
              <td>{stats[PlayerStatType.SetPowerModer] ?? 0}</td>
              <td>{stats[PlayerStatType.UsePowerModer] ?? 0}</td>
            </tr>
            <tr>
              <td><EffectIcon id="GP_Yagluth" /> {translate('GP_Yagluth')}</td>
              <td>{stats[PlayerStatType.SetPowerYagluth] ?? 0}</td>
              <td>{stats[PlayerStatType.UsePowerYagluth] ?? 0}</td>
            </tr>
            <tr>
              <td><EffectIcon id="GP_Queen" /> {translate('GP_Queen')}</td>
              <td>{stats[PlayerStatType.SetPowerQueen] ?? 0}</td>
              <td>{stats[PlayerStatType.UsePowerQueen] ?? 0}</td>
            </tr>
            {/* <tr>
              <td><EffectIcon id="PowerAshlands" /> {translate('PowerAshlands')}</td>
              <td>{stats[PlayerStatType.SetPowerAshlands] ?? 0}</td>
              <td>{stats[PlayerStatType.UsePowerAshlands] ?? 0}</td>
            </tr>
            <tr>
              <td><EffectIcon id="PowerDeepNorth" /> {translate('PowerDeepNorth')}</td>
              <td>{stats[PlayerStatType.SetPowerDeepNorth] ?? 0}</td>
              <td>{stats[PlayerStatType.UsePowerDeepNorth] ?? 0}</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    },
    ...(playerData == null ? [] : [{
      title: 'items',
      renderer: () => <dl>
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
    </dl>}]),
    {
      title: 'misc',
      renderer: () => <dl>
        <dt>RavenHits</dt><dd>{stats[PlayerStatType.RavenHits] ?? 0}</dd>
        <dt>RavenTalk</dt><dd>{stats[PlayerStatType.RavenTalk] ?? 0}</dd>
        <dt>RavenAppear</dt><dd>{stats[PlayerStatType.RavenAppear] ?? 0}</dd>
        <dt>TombstonesOpenedOwn</dt><dd>{stats[PlayerStatType.TombstonesOpenedOwn] ?? 0}</dd>
        <dt>TombstonesOpenedOther</dt><dd>{stats[PlayerStatType.TombstonesOpenedOther] ?? 0}</dd>
        <dt>TombstonesFit</dt><dd>{stats[PlayerStatType.TombstonesFit] ?? 0}</dd>
        <dt>PortalDungeonIn</dt><dd>{stats[PlayerStatType.PortalDungeonIn] ?? 0}</dd>
        <dt>PortalDungeonOut</dt><dd>{stats[PlayerStatType.PortalDungeonOut] ?? 0}</dd>
      </dl>
    },
  ]} selected={0} />
}

const allTrophies = Object.values(data).filter(i => i.type === 'trophy' && !i.disabled) as (Resource & { type: 'trophy' })[];
const maxX = Math.max(...allTrophies.map(t => t.trophyPos?.x ?? 0));
const maxY = Math.max(...allTrophies.map(t => t.trophyPos?.y ?? 0));
const grid: string[][] = Array.from({ length: maxY + 1 }, () => Array.from({ length: maxX + 1 }, () => ''));
for (const item of allTrophies) {
  const pos = item.trophyPos;
  if (pos == null) continue;
  grid[pos.y]![pos.x] = item.id;
}
const trophyToCreature: Record<EntityId, Creature> = {};

for (const c of creatures) {
  for (const i of c.drop) {
    const item = data[i.item];
    if (item?.type === 'trophy') {
      trophyToCreature[i.item] = c;
    }
  }
}

export function Trophies({ trophies }: { trophies: string[] }) {
  const translate = useContext(TranslationContext);

  const found = new Set(trophies);

  return <div className="TrophyRoom">
    {grid.map((row, y) => row.map((id, x) => {
      const isFound = found.has(id);
      const item = data[id];
      if (item == null) return <div key={`${x}_${y}`}></div>;
      const classNames = ['TrophyRoom__slot'];
      if (isFound) {
        classNames.push('TrophyRoom__slot--found');
      }
      const name = translate(trophyToCreature[item.id]?.id ?? item.id);
      const shownName = isFound ? name : runeText(name);
      return <div key={`${x}_${y}`} className={classNames.join(' ')} title="shownName">
        <div className="TrophyRoom__shadow"><ItemIcon item={item} size={64} /></div>
        <div className="TrophyRoom__icon"><ItemIcon item={item} size={64} /></div>
        <span className="TrophyRoom__title">
          {shownName}
        </span>
      </div>
    }))}
  </div>;
}
