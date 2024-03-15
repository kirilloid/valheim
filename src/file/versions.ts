export const SKILLS = 2; // Skills.dataVersion
export const WORLD = 33; // Version.m_worldVersion
export const MAP = 8; // Minimap.MAPVERSION
export const SHARED_MAP = 2; // Minimap.sharedMapDataVersion, is it used at all?
export const PLAYER = 38; // Version.m_playerVersion
export const PLAYER_DATA = 26; // Player.dataVersion
export const INVENTORY = 106; // Version.m_itemDataVersion
export const WORLD_GEN = 2; // Version.m_worldGenVersion
export const LIQUID = 2; // LiquidVolume.liquidSaveVersion
export const TERRAIN_COMP = 1; // TerrainComp.terrainCompVersion

export function checkVersion(section: string, file: number, maxSupported: number) {
  if (file <= 0) {
    throw new Error(`Wrong file version. Most probably the file is corrupted.`);
  }
  if (file > maxSupported) {
    throw new Error(`Incompatible version in ${section}.\nProvided: ${file}\nMax supported: ${maxSupported}`);
  }
}
