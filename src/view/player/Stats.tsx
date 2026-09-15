import React, { useContext, useState } from 'react';

import { Player, DifficultyRequirement } from '../../file/Player';
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
  '$piece_meadcauldron': 'piece_MeadCauldron',
  '$piece_stonecutter': 'piece_stonecutter',
  '$piece_artisanstation': 'piece_artisanstation',
  '$piece_blackforge': 'blackforge',
  '$piece_preptable': 'piece_preptable',
  '$piece_magetable': 'piece_magetable',
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

const difficultyRequirements: DifficultyRequirement[] = [];
for (let i = 0; i < DifficultyRequirement.Count; ++i) {
  difficultyRequirements.push(i as DifficultyRequirement);
}

export function Stats({ player }: { player: Player }) {
  const translate = useContext(TranslationContext);

  const { stats, playerData } = player;
  const [difficultyRequirement, setDifficultyRequirement] = useState(DifficultyRequirement.RawStats);
  const stat = stats[difficultyRequirement]!;

  return <>
    {stats.length > 0 && <div>
      <label htmlFor="difficulty">Difficulty</label> <select id="difficulty" value={difficultyRequirement} onChange={e => setDifficultyRequirement(Number(e.target.value))}>
        {stats.map((_, dr) => <option key={dr} value={dr}>{translate(`ui.difficulty.${DifficultyRequirement[dr]}`)}</option>)}
      </select>
    </div>}
    <Tabs tabs={[
      {
        title: 'summary',
          renderer: () => <dl>
            <dt>kills (PvP)</dt><dd>{stat.stats.get(PlayerStatType.PlayerKills) ?? 0}</dd>
            <dt>deaths (any)</dt><dd>{stat.stats.get(PlayerStatType.Deaths) ?? 0}</dd>
            <dt>cheated</dt><dd>{stat.stats.get(PlayerStatType.Cheats) ?? 0}</dd>
            <dt>items crafted</dt><dd>{stat.stats.get(PlayerStatType.Crafts) ?? 0}</dd>
            <dt>structures built</dt><dd>{stat.stats.get(PlayerStatType.Builds) ?? 0}</dd>
            <dt>trophies</dt><dd>{playerData?.trophies.length ?? 0}</dd>
          {playerData != null && <>
            <dt>biomes</dt><dd>{playerData.knownBiomeStr.length || playerData.knownBiomeInt.length}</dd>
            <dt>known items</dt><dd>{playerData.knownMaterials.length}</dd>
            <dt>known recipes</dt><dd>{playerData.knownRecipes.length}</dd>
            <dt>known stations</dt><dd>{playerData.knownStations.size}</dd>
          </>}
        </dl>
      },
      {
        title: 'deaths',
        renderer: () => <div><dl>
          <dt>Total</dt><dd>{stat.stats.get(PlayerStatType.Deaths) ?? 0}</dd>
          <dt>Unknown</dt><dd>{stat.stats.get(PlayerStatType.DeathByUndefined) ?? 0}</dd>
          <dt>EnemyHit</dt><dd>{stat.stats.get(PlayerStatType.DeathByEnemyHit) ?? 0}</dd>
          <dt>PlayerHit</dt><dd>{stat.stats.get(PlayerStatType.DeathByPlayerHit) ?? 0}</dd>
          <dt>Fall</dt><dd>{stat.stats.get(PlayerStatType.DeathByFall) ?? 0}</dd>
          <dt>Drowning</dt><dd>{stat.stats.get(PlayerStatType.DeathByDrowning) ?? 0}</dd>
          <dt>Burning</dt><dd>{stat.stats.get(PlayerStatType.DeathByBurning) ?? 0}</dd>
          <dt>Freezing</dt><dd>{stat.stats.get(PlayerStatType.DeathByFreezing) ?? 0}</dd>
          <dt>Poisoned</dt><dd>{stat.stats.get(PlayerStatType.DeathByPoisoned) ?? 0}</dd>
          <dt>Smoke</dt><dd>{stat.stats.get(PlayerStatType.DeathBySmoke) ?? 0}</dd>
          <dt>Water</dt><dd>{stat.stats.get(PlayerStatType.DeathByWater) ?? 0}</dd>
          <dt>EdgeOfWorld</dt><dd>{stat.stats.get(PlayerStatType.DeathByEdgeOfWorld) ?? 0}</dd>
          <dt>Impact</dt><dd>{stat.stats.get(PlayerStatType.DeathByImpact) ?? 0}</dd>
          <dt>Cart</dt><dd>{stat.stats.get(PlayerStatType.DeathByCart) ?? 0}</dd>
          <dt>Tree</dt><dd>{stat.stats.get(PlayerStatType.DeathByTree) ?? 0}</dd>
          <dt>Self</dt><dd>{stat.stats.get(PlayerStatType.DeathBySelf) ?? 0}</dd>
          <dt>Structural</dt><dd>{stat.stats.get(PlayerStatType.DeathByStructural) ?? 0}</dd>
          <dt>Turret</dt><dd>{stat.stats.get(PlayerStatType.DeathByTurret) ?? 0}</dd>
          <dt>Boat</dt><dd>{stat.stats.get(PlayerStatType.DeathByBoat) ?? 0}</dd>
          <dt>Stalagtite</dt><dd>{stat.stats.get(PlayerStatType.DeathByStalagtite) ?? 0}</dd>
          <dt>Catapult</dt><dd>{stat.stats.get(PlayerStatType.DeathByCatapult) ?? 0}</dd>
          <dt>CinderFire</dt><dd>{stat.stats.get(PlayerStatType.DeathByCinderFire) ?? 0}</dd>
          <dt>AshlandsOcean</dt><dd>{stat.stats.get(PlayerStatType.DeathByAshlandsOcean) ?? 0}</dd>
          <dt>Incinerator</dt><dd>{stat.stats.get(PlayerStatType.DeathByIncinerator) ?? 0}</dd>
          <dt>TreeTier0</dt><dd>{stat.stats.get(PlayerStatType.DeathByTreeTier0) ?? 0}</dd>
          <dt>TreeTier1</dt><dd>{stat.stats.get(PlayerStatType.DeathByTreeTier1) ?? 0}</dd>
          <dt>TreeTier2</dt><dd>{stat.stats.get(PlayerStatType.DeathByTreeTier2) ?? 0}</dd>
          <dt>TreeTier3</dt><dd>{stat.stats.get(PlayerStatType.DeathByTreeTier3) ?? 0}</dd>
          <dt>TreeTier4</dt><dd>{stat.stats.get(PlayerStatType.DeathByTreeTier4) ?? 0}</dd>
          <dt>TreeTier5</dt><dd>{stat.stats.get(PlayerStatType.DeathByTreeTier5) ?? 0}</dd>
          <dt>DrawBridge</dt><dd>{stat.stats.get(PlayerStatType.DeathByDrawBridge) ?? 0}</dd>
        </dl></div>
      },
      {
        title: 'fight',
        renderer: () => <div><dl>
          <dt>Enemy hits</dt><dd>{stat.stats.get(PlayerStatType.EnemyHits) ?? 0}</dd>
          <dt>Enemy kills</dt><dd>{stat.stats.get(PlayerStatType.EnemyKills) ?? 0}</dd>
          <dt>Enemy kills last hits</dt><dd>{stat.stats.get(PlayerStatType.EnemyKillsLastHits) ?? 0}</dd>
          <dt>Boss kills</dt><dd>{stat.stats.get(PlayerStatType.BossKills) ?? 0}</dd>
          <dt>Boss kill (multiplayer)</dt><dd>{stat.stats.get(PlayerStatType.BossKillMultiplayer) ?? 0}</dd>
          <dt>Boss kill (solo)</dt><dd>{stat.stats.get(PlayerStatType.BossKillSolo) ?? 0}</dd>
          <dt>Boss last hits</dt><dd>{stat.stats.get(PlayerStatType.BossLastHits) ?? 0}</dd>
          <dt>Player hits</dt><dd>{stat.stats.get(PlayerStatType.PlayerHits) ?? 0}</dd>
          <dt>Player kills</dt><dd>{stat.stats.get(PlayerStatType.PlayerKills) ?? 0}</dd>
          <dt>Hits taken from enemies</dt><dd>{stat.stats.get(PlayerStatType.HitsTakenEnemies) ?? 0}</dd>
          <dt>Hits taken from players</dt><dd>{stat.stats.get(PlayerStatType.HitsTakenPlayers) ?? 0}</dd>
          <dt>Creatures tamed</dt><dd>{stat.stats.get(PlayerStatType.CreatureTamed) ?? 0}</dd>
          <dt>TamedPetting</dt><dd>{stat.stats.get(PlayerStatType.TamedPetting) ?? 0}</dd>
          <dt>TamedCommand</dt><dd>{stat.stats.get(PlayerStatType.TamedCommand) ?? 0}</dd>
          <dt>Skeleton summons</dt><dd>{stat.stats.get(PlayerStatType.SkeletonSummons) ?? 0}</dd>
          <dt>Arrows shot</dt><dd>{stat.stats.get(PlayerStatType.ArrowsShot) ?? 0}</dd>
          <dt>Turret ammo added</dt><dd>{stat.stats.get(PlayerStatType.TurretAmmoAdded) ?? 0}</dd>
          <dt>Turret trophy set</dt><dd>{stat.stats.get(PlayerStatType.TurretTrophySet) ?? 0}</dd>
          <dt>Traps armed</dt><dd>{stat.stats.get(PlayerStatType.TrapArmed) ?? 0}</dd>
          <dt>Traps triggered</dt><dd>{stat.stats.get(PlayerStatType.TrapTriggered) ?? 0}</dd>
        </dl></div>
      },
      {
        title: 'resources',
        renderer: () => <div>
          <p>Only "honest" hits are considered. Treevalanche or mining under and collapsing a deposit don't increase your stats</p>
          <h3>Trees</h3>
          <dl>
            <dt>Trees</dt><dd>{stat.stats.get(PlayerStatType.Tree) ?? 0}</dd>
            <dt>Tier0</dt><dd>{stat.stats.get(PlayerStatType.TreeTier0) ?? 0}</dd>
            <dt>Tier1</dt><dd>{stat.stats.get(PlayerStatType.TreeTier1) ?? 0}</dd>
            <dt>Tier2</dt><dd>{stat.stats.get(PlayerStatType.TreeTier2) ?? 0}</dd>
            <dt>Tier3</dt><dd>{stat.stats.get(PlayerStatType.TreeTier3) ?? 0}</dd>
            <dt>Tier4</dt><dd>{stat.stats.get(PlayerStatType.TreeTier4) ?? 0}</dd>
            <dt>Tier5</dt><dd>{stat.stats.get(PlayerStatType.TreeTier5) ?? 0}</dd>
            <dt>hits</dt><dd>{stat.stats.get(PlayerStatType.TreeChops) ?? 0}</dd>
            <dt>Logs destroyed</dt><dd>{stat.stats.get(PlayerStatType.Logs) ?? 0}</dd>
            <dt>Log hits</dt><dd>{stat.stats.get(PlayerStatType.LogChops) ?? 0}</dd>
          </dl>
          <h3>Mining</h3>
          <dl>
            <dt>hits</dt><dd>{stat.stats.get(PlayerStatType.MineHits) ?? 0}</dd>
            <dt>nodes</dt><dd>{stat.stats.get(PlayerStatType.Mines) ?? 0}</dd>
            <dt>Tier0</dt><dd>{stat.stats.get(PlayerStatType.MineTier0) ?? 0}</dd>
            <dt>Tier1</dt><dd>{stat.stats.get(PlayerStatType.MineTier1) ?? 0}</dd>
            <dt>Tier2</dt><dd>{stat.stats.get(PlayerStatType.MineTier2) ?? 0}</dd>
            <dt>Tier3</dt><dd>{stat.stats.get(PlayerStatType.MineTier3) ?? 0}</dd>
            <dt>Tier4</dt><dd>{stat.stats.get(PlayerStatType.MineTier4) ?? 0}</dd>
            <dt>Tier5</dt><dd>{stat.stats.get(PlayerStatType.MineTier5) ?? 0}</dd>
            <dt>Flametal node sunk</dt><dd>{stat.stats.get(PlayerStatType.LavaLeviathanSink) ?? 0}</dd>
          </dl>
          <h3>Misc</h3>
          <dl>
            <dt>Leviathan sunk</dt><dd>{stat.stats.get(PlayerStatType.LeviathanSink) ?? 0}</dd>
            <dt>Bonus</dt><dd>{stat.stats.get(PlayerStatType.HarvestBonus) ?? '-'}</dd>
            <dt>Berry</dt><dd>{stat.stats.get(PlayerStatType.HarvestBerry) ?? '-'}</dd>
            <dt>Mushroom</dt><dd>{stat.stats.get(PlayerStatType.HarvestMushroom) ?? '-'}</dd>
            <dt>Vine</dt><dd>{stat.stats.get(PlayerStatType.HarvestVine) ?? '-'}</dd>
            <dt>Honey</dt><dd>{stat.stats.get(PlayerStatType.BeesHarvested) ?? '-'}</dd>
            <dt>Sap</dt><dd>{stat.stats.get(PlayerStatType.SapHarvested) ?? '-'}</dd>
            <dt>Crop</dt><dd>{stat.stats.get(PlayerStatType.HarvestCrop) ?? '-'}</dd>
          </dl>
        </div>
      },
      {
        title: 'travel',
        renderer: () => <div>
          <dl>
            <dt>World loads</dt><dd>{stat.stats.get(PlayerStatType.WorldLoads) ?? 0}</dd>
            <dt>Portals taken</dt><dd>{stat.stats.get(PlayerStatType.PortalsUsed) ?? 0}</dd>
            <dt>Jumps</dt><dd>{stat.stats.get(PlayerStatType.Jumps) ?? 0}</dd>
            <dt>Traveled</dt><dd>{Math.round(stat.stats.get(PlayerStatType.DistanceTraveled) ?? 0)} m</dd>
            <dt>Walk</dt><dd>{Math.round(stat.stats.get(PlayerStatType.DistanceWalk) ?? 0)} m</dd>
            <dt>Run</dt><dd>{Math.round(stat.stats.get(PlayerStatType.DistanceRun) ?? 0)} m</dd>
            <dt>Sail</dt><dd>{Math.round(stat.stats.get(PlayerStatType.DistanceSail) ?? 0)} m</dd>
            <dt>Sail (Captain)</dt><dd>{Math.round(stat.stats.get(PlayerStatType.DistanceSailHelm) ?? 0)} m</dd>
            <dt>Air</dt><dd>{Math.round(stat.stats.get(PlayerStatType.DistanceAir) ?? 0)} m</dd>
            <dt>ExploreNorth</dt><dd>{stat.stats.get(PlayerStatType.ExploreNorth) ?? 0}</dd>
            <dt>ExploreSouth</dt><dd>{stat.stats.get(PlayerStatType.ExploreSouth) ?? 0}</dd>
            <dt>ExploreEast</dt><dd>{stat.stats.get(PlayerStatType.ExploreEast) ?? 0}</dd>
            <dt>ExploreWest</dt><dd>{stat.stats.get(PlayerStatType.ExploreWest) ?? 0}</dd>
            <dt>ExploreNorthNoMap</dt><dd>{stat.stats.get(PlayerStatType.ExploreNorthNoMap) ?? 0}</dd>
            <dt>ExploreSouthNoMap</dt><dd>{stat.stats.get(PlayerStatType.ExploreSouthNoMap) ?? 0}</dd>
            <dt>ExploreEastNoMap</dt><dd>{stat.stats.get(PlayerStatType.ExploreEastNoMap) ?? 0}</dd>
            <dt>ExploreWestNoMap</dt><dd>{stat.stats.get(PlayerStatType.ExploreWestNoMap) ?? 0}</dd>
            <dt>DeepestDungeon</dt><dd>{stat.stats.get(PlayerStatType.DeepestDungeon) ?? 0}</dd>
          </dl>
        </div>
      },
      {
        title: 'crafting',
        renderer: () => <div>
          <dl>
            <dt>CraftsOrUpgrades</dt><dd>{stat.stats.get(PlayerStatType.CraftsOrUpgrades) ?? 0}</dd>
            <dt>Crafts</dt><dd>{stat.stats.get(PlayerStatType.Crafts) ?? 0}</dd>
            <dt>Upgrades</dt><dd>{stat.stats.get(PlayerStatType.Upgrades) ?? 0}</dd>
            <dt>Food</dt><dd>{stat.stats.get(PlayerStatType.CraftFood) ?? '-'}</dd>
            <dt>FoodBonus</dt><dd>{stat.stats.get(PlayerStatType.CraftFoodBonus) ?? '-'}</dd>
            <dt>Grill</dt><dd>{stat.stats.get(PlayerStatType.CraftGrill) ?? '-'}</dd>
            <dt>GrillBurnt</dt><dd>{stat.stats.get(PlayerStatType.CraftGrillBurnt) ?? '-'}</dd>
            <dt>GrillBonus</dt><dd>{stat.stats.get(PlayerStatType.CraftGrillBonus) ?? '-'}</dd>
            <dt>Weapon</dt><dd>{stat.stats.get(PlayerStatType.CraftWeapon) ?? '-'}</dd>
            <dt>Armor</dt><dd>{stat.stats.get(PlayerStatType.CraftArmor) ?? '-'}</dd>
            <dt>Trinket</dt><dd>{stat.stats.get(PlayerStatType.CraftTrinket) ?? '-'}</dd>
            <dt>Ammo</dt><dd>{stat.stats.get(PlayerStatType.CraftAmmo) ?? '-'}</dd>
            <dt>Material</dt><dd>{stat.stats.get(PlayerStatType.CraftMaterial) ?? '-'}</dd>
            <dt>Tool</dt><dd>{stat.stats.get(PlayerStatType.CraftTool) ?? '-'}</dd>
            <dt>Torch</dt><dd>{stat.stats.get(PlayerStatType.CraftTorch) ?? '-'}</dd>
            <dt>Bait</dt><dd>{stat.stats.get(PlayerStatType.CraftBait) ?? '-'}</dd>
            <dt>Other</dt><dd>{stat.stats.get(PlayerStatType.CraftOther) ?? '-'}</dd>
          </dl>
        </div>
      },
      {
        title: 'fishing',
        renderer: () => <div>
          <dl>
            <dt>Hooked</dt><dd>{stat.stats.get(PlayerStatType.FishHooked) ?? 0}</dd>
            <dt>Lost</dt><dd>{stat.stats.get(PlayerStatType.FishLost) ?? 0}</dd>
            <dt>Caught (total)</dt><dd>{stat.stats.get(PlayerStatType.FishCaught) ?? 0}</dd>
            {/* <dt>FishCaughtTier0</dt><dd>{stat.stats.get(PlayerStatType.FishCaughtTier0) ?? '-'}</dd> */}
            <dt>0⭐</dt><dd>{stat.stats.get(PlayerStatType.FishCaughtTier1) ?? 0}</dd>
            <dt>1⭐</dt><dd>{stat.stats.get(PlayerStatType.FishCaughtTier2) ?? 0}</dd>
            <dt>2⭐</dt><dd>{stat.stats.get(PlayerStatType.FishCaughtTier3) ?? 0}</dd>
            <dt>3⭐</dt><dd>{stat.stats.get(PlayerStatType.FishCaughtTier4) ?? 0}</dd>
            <dt>4⭐</dt><dd>{stat.stats.get(PlayerStatType.FishCaughtTier5) ?? 0}</dd>
            {/* <dt>FishCaughtTier6</dt><dd>{stat.stats.get(PlayerStatType.FishCaughtTier6) ?? '-'}</dd> */}
          </dl>
        </div>
      },
      {
        title: 'building',
        renderer: () => <div>
          <dl>
            <dt><ItemIcon item={data.Hammer} /> Builds</dt><dd>{stat.stats.get(PlayerStatType.Builds) ?? 0}</dd>
            <dt>MaxBuildingHeight</dt><dd>{(stat.stats.get(PlayerStatType.MaxBuildingHeight) ?? 0).toFixed(2)} m</dd>
            <dt>MaxBuildingHeightWorld</dt><dd>{(stat.stats.get(PlayerStatType.MaxBuildingHeightWorld) ?? 0).toFixed(2)} m</dd>
            <dt>BuiltPieces</dt><dd>{stat.stats.get(PlayerStatType.BuiltPieces) ?? 0}</dd>
            <dt>BuiltPiecesNoDebt</dt><dd>{stat.stats.get(PlayerStatType.BuiltPiecesNoDebt) ?? 0}</dd>
            <dt>BuildPiecesRemoved</dt><dd>{stat.stats.get(PlayerStatType.BuildPiecesRemoved) ?? 0}</dd>
            <dt>Misc</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterMisc) ?? 0}</dd>
            <dt>Crafting</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterCrafting) ?? 0}</dd>
            <dt>Structural</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterStructural) ?? 0}</dd>
            <dt>Floor</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterFloor) ?? 0}</dd>
            <dt>Wall</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterWall) ?? 0}</dd>
            <dt>Roof</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterRoof) ?? 0}</dd>
            <dt>Beam</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterBeam) ?? 0}</dd>
            <dt>Furniture</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterFurniture) ?? 0}</dd>
            <dt>Lighting</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterLighting) ?? 0}</dd>
            <dt>Decor</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterDecor) ?? 0}</dd>
            <dt>Storage</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterStorage) ?? 0}</dd>
            <dt>Vehicles</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterVehicles) ?? 0}</dd>
            <dt>Food</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterFood) ?? 0}</dd>
            <dt>Meads</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterMeads) ?? 0}</dd>
            <dt>Feasts</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterFeasts) ?? 0}</dd>
            <dt>Defense</dt><dd>{stat.stats.get(PlayerStatType.BuildClusterDefense) ?? 0}</dd>
          </dl>
        </div>
      },
      {
        title: 'trees',
        renderer: () => <div>
          <dl>
            <dt>TreeBirch</dt><dd>{stat.stats.get(PlayerStatType.TreeBirch) ?? 0}</dd>
            <dt>TreeBeech</dt><dd>{stat.stats.get(PlayerStatType.TreeBeech) ?? 0}</dd>
            <dt>TreeOak</dt><dd>{stat.stats.get(PlayerStatType.TreeOak) ?? 0}</dd>
            <dt>TreeFir</dt><dd>{stat.stats.get(PlayerStatType.TreeFir) ?? 0}</dd>
            <dt>TreePine</dt><dd>{stat.stats.get(PlayerStatType.TreePine) ?? 0}</dd>
            <dt>TreeSwamp</dt><dd>{stat.stats.get(PlayerStatType.TreeSwamp) ?? 0}</dd>
            <dt>TreeSnowFir</dt><dd>{stat.stats.get(PlayerStatType.TreeSnowFir) ?? 0}</dd>
            <dt>TreeSnowPine</dt><dd>{stat.stats.get(PlayerStatType.TreeSnowPine) ?? 0}</dd>
            <dt>TreeYggdrasilShoot</dt><dd>{stat.stats.get(PlayerStatType.TreeYggdrasilShoot) ?? 0}</dd>
            <dt>TreeAshlands</dt><dd>{stat.stats.get(PlayerStatType.TreeAshlands) ?? 0}</dd>
          </dl>
        </div>
      },
      {
        title: 'adventure',
        renderer: () => <div>
          <dl>
            <dt>ConsecutiveDaysSurvived</dt><dd>{stat.stats.get(PlayerStatType.ConsecutiveDaysSurvived) ?? 0}</dd>
            <dt>ConsecutiveDaysSurvivedMax</dt><dd>{stat.stats.get(PlayerStatType.ConsecutiveDaysSurvivedMax) ?? 0}</dd>
            <dt>PortalDungeonIn</dt><dd>{stat.stats.get(PlayerStatType.PortalDungeonIn) ?? 0}</dd>
            <dt>PortalDungeonOut</dt><dd>{stat.stats.get(PlayerStatType.PortalDungeonOut) ?? 0}</dd>
            <dt>MaxComfort</dt><dd>{stat.stats.get(PlayerStatType.MaxComfort) ?? 0}</dd>
            <dt>ItemsPickedUp</dt><dd>{stat.stats.get(PlayerStatType.ItemsPickedUp) ?? 0}</dd>
            <dt>TreasureBuriedFound</dt><dd>{stat.stats.get(PlayerStatType.TreasureBuriedFound) ?? 0}</dd>
            <dt>TreasureDungeonFound</dt><dd>{stat.stats.get(PlayerStatType.TreasureDungeonFound) ?? 0}</dd>
            <dt>TreasureLocationFound</dt><dd>{stat.stats.get(PlayerStatType.TreasureLocationFound) ?? 0}</dd>
            <dt>TimeInBase</dt><dd>{stat.stats.get(PlayerStatType.TimeInBase) ?? 0} s</dd>
            <dt>TimeOutOfBase</dt><dd>{stat.stats.get(PlayerStatType.TimeOutOfBase) ?? 0} s</dd>
            <dt>PlayerSpawn</dt><dd>{stat.stats.get(PlayerStatType.PlayerSpawn) ?? 0} s</dd>
            <dt><ItemIcon item={data.bed} />Sleep</dt><dd>{stat.stats.get(PlayerStatType.Sleep) ?? 0} times</dd>
            <dt><ItemIcon item={data.piece_chest_wood} /> Placed stacks</dt><dd>{stat.stats.get(PlayerStatType.PlaceStacks) ?? 0}</dd>
            <dt><Icon id="food" alt="" size={32} /> Foods eaten</dt><dd>{stat.stats.get(PlayerStatType.FoodEaten) ?? 0}</dd>
            <dt><ItemIcon item={data.wood_door} /> DoorsOpened</dt><dd>{stat.stats.get(PlayerStatType.DoorsOpened) ?? 0}</dd>
            <dt><ItemIcon item={data.wood_door} /> DoorsClosed</dt><dd>{stat.stats.get(PlayerStatType.DoorsClosed) ?? 0}</dd>
            <dt><ItemIcon item={data.itemstand} /> Item stand Uses</dt><dd>{stat.stats.get(PlayerStatType.ItemStandUses) ?? 0}</dd>
            <dt><ItemIcon item={data.ArmorStand} /> Armor stand uses</dt><dd>{stat.stats.get(PlayerStatType.ArmorStandUses) ?? 0}</dd>
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
                <td>{stat.stats.get(PlayerStatType.SetGuardianPower) ?? 0}</td>
                <td>{stat.stats.get(PlayerStatType.UseGuardianPower) ?? 0}</td>
              </tr>
              <tr>
                <td><EffectIcon id="GP_Eikthyr" /> {translate('ui.effect.GP_Eikthyr')}</td>
                <td>{stat.stats.get(PlayerStatType.SetPowerEikthyr) ?? 0}</td>
                <td>{stat.stats.get(PlayerStatType.UsePowerEikthyr) ?? 0}</td>
              </tr>
              <tr>
                <td><EffectIcon id="GP_TheElder" /> {translate('ui.effect.GP_TheElder')}</td>
                <td>{stat.stats.get(PlayerStatType.SetPowerElder) ?? 0}</td>
                <td>{stat.stats.get(PlayerStatType.UsePowerElder) ?? 0}</td>
              </tr>
              <tr>
                <td><EffectIcon id="GP_Bonemass" /> {translate('ui.effect.GP_Bonemass')}</td>
                <td>{stat.stats.get(PlayerStatType.SetPowerBonemass) ?? 0}</td>
                <td>{stat.stats.get(PlayerStatType.UsePowerBonemass) ?? 0}</td>
              </tr>
              <tr>
                <td><EffectIcon id="GP_Moder" /> {translate('ui.effect.GP_Moder')}</td>
                <td>{stat.stats.get(PlayerStatType.SetPowerModer) ?? 0}</td>
                <td>{stat.stats.get(PlayerStatType.UsePowerModer) ?? 0}</td>
              </tr>
              <tr>
                <td><EffectIcon id="GP_Yagluth" /> {translate('ui.effect.GP_Yagluth')}</td>
                <td>{stat.stats.get(PlayerStatType.SetPowerYagluth) ?? 0}</td>
                <td>{stat.stats.get(PlayerStatType.UsePowerYagluth) ?? 0}</td>
              </tr>
              <tr>
                <td><EffectIcon id="GP_Queen" /> {translate('ui.effect.GP_Queen')}</td>
                <td>{stat.stats.get(PlayerStatType.SetPowerQueen) ?? 0}</td>
                <td>{stat.stats.get(PlayerStatType.UsePowerQueen) ?? 0}</td>
              </tr>
              <tr>
                <td><EffectIcon id="GP_Fader" /> {translate('ui.effect.GP_Fader')}</td>
                <td>{stat.stats.get(PlayerStatType.SetPowerAshlands) ?? 0}</td>
                <td>{stat.stats.get(PlayerStatType.UsePowerAshlands) ?? 0}</td>
              </tr>
              <tr>
                <td><EffectIcon id="PowerDeepNorth" /> {translate('ui.effect.PowerDeepNorth')}</td>
                <td>{stat.stats.get(PlayerStatType.SetPowerDeepNorth) ?? 0}</td>
                <td>{stat.stats.get(PlayerStatType.UsePowerDeepNorth) ?? 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      },
      ...(playerData == null ? [] : [{
        title: 'items',
        renderer: () => <dl>
        <dt>known biomes</dt><dd>
          <ul>
            {(playerData.knownBiomeStr.length
              ? playerData.knownBiomeStr.filter(s => !s.startsWith('$'))
              : playerData.knownBiomeInt
                .map(b => biomes.get(b) ?? '')
                .filter(Boolean))
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
          <dt>RavenHits</dt><dd>{stat.stats.get(PlayerStatType.RavenHits) ?? 0}</dd>
          <dt>RavenTalk</dt><dd>{stat.stats.get(PlayerStatType.RavenTalk) ?? 0}</dd>
          <dt>RavenAppear</dt><dd>{stat.stats.get(PlayerStatType.RavenAppear) ?? 0}</dd>
          <dt>TombstonesOpenedOwn</dt><dd>{stat.stats.get(PlayerStatType.TombstonesOpenedOwn) ?? 0}</dd>
          <dt>TombstonesOpenedOther</dt><dd>{stat.stats.get(PlayerStatType.TombstonesOpenedOther) ?? 0}</dd>
          <dt>TombstonesFit</dt><dd>{stat.stats.get(PlayerStatType.TombstonesFit) ?? 0}</dd>
        </dl>
      },
    ]} selected={0} />
  </>
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
