export const SKILLS = 2; // Skills.dataVersion
export const WORLD = 29; // Version.m_worldVersion
export const MAP = 7; // Minimap.MAPVERSION
export const SHARED_MAP = 2; // Minimap.sharedMapDataVersion, is it used at all?
export const PLAYER = 37; // Version.m_playerVersion
export const PLAYER_DATA = 26; // Player.dataVersion
export const INVENTORY = 104; // Inventory.currentVersion
export const WORLD_GEN = 2; // Version.m_worldGenVersion
export const LIQUID = 2; // LiquidVolume.liquidSaveVersion
export const TERRAIN_COMP = 1; // TerrainComp.terrainCompVersion

export function checkVersion(file: number, maxSupported: number) {
  if (file <= 0) {
    throw new Error(`Wrong file version. Most probably a file is corrupted.`);
  }
  if (file > maxSupported) {
    throw new Error(`Incompatible version.\nProvided: ${file}\nMax supported: ${maxSupported}`);
  }
}
