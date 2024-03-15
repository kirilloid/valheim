export const SKILLS = 2; // Skills.dataVersion
// is used for both as primary DB as well as FWL versions
export const WORLD = 34; // Version.m_worldVersion
export const MAP = 8; // Minimap.MAPVERSION
export const SHARED_MAP = 2; // Minimap.sharedMapDataVersion, is it used at all?
export const PLAYER = 39; // Version.m_playerVersion
export const PLAYER_DATA = 27; // Player.dataVersion
export const INVENTORY = 106; // Version.m_itemDataVersion
export const WORLD_GEN = 2; // Version.m_worldGenVersion
export const LIQUID = 2; // LiquidVolume.liquidSaveVersion
export const TERRAIN_COMP = 1; // TerrainComp.terrainCompVersion

export const VERSION_HISTORY = [
  {
    SKILLS: 2,
    WORLD: 28,
    MAP: 7,
    SHARED_MAP: 2,
    PLAYER: 36,
    PLAYER_DATA: 25,
    INVENTORY: 103,
    WORLD_GEN: 1,
    LIQUID: 2,
    TERRAIN_COMP: 1,
  },
  {
    SKILLS: 2,
    WORLD: 29,
    MAP: 7,
    SHARED_MAP: 2,
    PLAYER: 37,
    PLAYER_DATA: 26,
    INVENTORY: 104,
    WORLD_GEN: 2,
    LIQUID: 2,
    TERRAIN_COMP: 1,
  },
  {
    SKILLS: 2,
    WORLD: 30,
    MAP: 7,
    SHARED_MAP: 2,
    PLAYER: 37,
    PLAYER_DATA: 26,
    INVENTORY: 104,
    WORLD_GEN: 2,
    LIQUID: 2,
    TERRAIN_COMP: 1,
  },
  {
    SKILLS: 2,
    WORLD: 33,
    MAP: 8,
    SHARED_MAP: 2,
    PLAYER: 38,
    PLAYER_DATA: 26,
    INVENTORY: 106,
    WORLD_GEN: 2,
    LIQUID: 2,
    TERRAIN_COMP: 1,
  },
];

type VersionSet = typeof VERSION_HISTORY[number];

export const LATEST = VERSION_HISTORY.slice(-1)[0]!;

export function checkVersion(section: string, file: number, maxSupported: number) {
  if (file <= 0) {
    throw new Error(`Wrong file version. Most probably the file is corrupted.`);
  }
  if (file > maxSupported) {
    throw new Error(`Incompatible version in ${section}.\nProvided: ${file}\nMax supported: ${maxSupported}`);
  }
}
