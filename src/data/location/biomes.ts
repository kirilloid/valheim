import type {
  Biome,
  BiomeConfig,
  Creature,
  EntityId,
  Fish,
  PhysicalObject,
} from '../../types';

import { objects } from '../objects';
import { data } from '../itemDB';
import { creatures } from '../creatures';
import { fishes } from '../fish';
import { resources } from '../resources';
import { uniq } from 'lodash-es';
import { spawnList } from '../spawn-list';

function biome(emoji: string, id: Biome, tier: number, {
  creatures = [],
  trees = [],
  rocks = [],
  resources = [],
  ingridients = [],
  foods = [],
  chestLoot = [],
  trophies,
}: {
  trees: PhysicalObject[],
  rocks: PhysicalObject[],
  plants?: PhysicalObject[],
  creatures?: (Creature | Fish)[],
  ingridients: EntityId[],
  foods: EntityId[],
  resources: EntityId[],
  chestLoot: EntityId[],
  trophies: EntityId[],
}): BiomeConfig {
  return {
    id,
    tier,
    emoji,
    trees,
    rocks,
    creatures,
    locations: [],
    ingridients,
    chestLoot,
    foods,
    resources,
    trophies,
  };
}

const spawnedVegetation = new Set(spawnList.vegetation.map(sc => sc.prefab));

export const biomes: BiomeConfig[] = [
  biome('⛳', 'Meadows', 1, {
    trees: objects.filter(o => o.type === 'object' && o.tier <= 1 && o.subtype === 'tree' && spawnedVegetation.has(o.id)),
    rocks: objects.filter(o => o.type === 'object' && o.tier <= 1 && o.subtype === 'rock' && spawnedVegetation.has(o.id)),
    resources: ['Wood', 'Stone', 'Flint', 'Resin', 'LeatherScraps', 'DeerHide', 'Feathers', 'QueenBee', 'Dandelion', 'Coal'],
    ingridients: ['Raspberry', 'Mushroom', 'Honey', 'NeckTail', 'RawMeat', 'DeerMeat'],
    foods: resources.filter(item => item.tier <= 1 && item.Food != null).map(item => item.id),
    chestLoot: ['Torch', 'Coins', 'ArrowFlint', 'KnifeWood', 'AxeWood', 'MaceWood', 'AxeHead1', 'AxeHead2', 'Upgrader0Armor', 'Upgrader0Weapon'],
    creatures: [...creatures.filter(c => c.tier <= 1), ...fishes.filter(f => f.tier <= 1)],
    trophies: uniq(creatures.filter(c => c.tier <= 1)
      .flatMap(c => c.drop.map(d => d.item)
      .filter(i => data[i]?.type === 'trophy'))),
  }),
  biome('🌲', 'BlackForest', 2, {
    trees: objects.filter(o => o.type === 'object' && o.tier === 2 && o.subtype === 'tree' && spawnedVegetation.has(o.id)),
    rocks: objects.filter(o => o.type === 'object' && o.tier === 2 && o.subtype === 'rock' && spawnedVegetation.has(o.id)),
    resources: ['RoundLog', 'FineWood', 'Copper', 'Tin', 'Bronze', 'GreydwarfEye', 'TrollHide', 'BjornPaw', 'BjornHide', 'BoneFragments', 'Ectoplasm', 'AncientSeed'],
    ingridients: ['Thistle', 'Carrot', 'BjornMeat', 'Blueberries', 'MushroomYellow', 'Pukeberries'],
    foods: resources.filter(item => item.tier === 2 && item.Food != null && !item.disabled).map(item => item.id),
    chestLoot: ['Coins', 'Ruby', 'Amber', 'AmberPearl', 'SurtlingCore', 'SpearWood', 'Upgrader1Armor', 'Upgrader1Weapon'],
    creatures: [...creatures.filter(c => c.tier === 2), ...fishes.filter(f => f.tier === 2)],
    trophies: uniq(creatures.filter(c => c.tier === 2)
      .flatMap(c => c.drop.map(d => d.item)
      .filter(i => data[i]?.type === 'trophy'))),
  }),
  biome('🐸', 'Swamp', 3, {
    trees: objects.filter(o => o.type === 'object' && o.tier === 3 && o.subtype === 'tree' && spawnedVegetation.has(o.id)),
    rocks: objects.filter(o => o.type === 'object' && o.tier === 3 && o.subtype === 'rock' && spawnedVegetation.has(o.id)),
    resources: ['ElderBark', 'Iron', 'Root', 'Guck', 'Ooze', 'WrithanRoots', 'Chain', 'WitheredBone'],
    ingridients: ['Thistle', 'Turnip', 'Entrails', 'BloodBag', 'MushroomYellow'],
    foods: resources.filter(item => item.tier === 3 && item.Food != null).map(item => item.id),
    chestLoot: ['Coins', 'Ruby', 'Amber', 'AmberPearl', 'SurtlingCore', 'SpearWood', 'Upgrader2Armor', 'Upgrader2Weapon'],
    creatures: [...creatures.filter(c => c.tier === 3 && c.id !== 'Serpent'), ...fishes.filter(f => f.tier === 3)],
    trophies: uniq(creatures.filter(c => c.tier === 3 && c.id !== 'Serpent')
      .flatMap(c => c.drop.map(d => d.item)
      .filter(i => data[i]?.type === 'trophy'))),
  }),
  biome('🌊', 'Ocean', 3, {
    trees: [],
    rocks: objects.filter(o => o.id === 'Leviathan'),
    resources: ['Chitin', 'SerpentScale'],
    ingridients: ['SerpentMeat'],
    foods: ['SerpentMeatCooked', 'SerpentStew'],
    chestLoot: [],
    creatures: creatures.filter(c => c.id === 'Serpent'),
    trophies: ['TrophySerpent'],
  }),
  biome('⛰️', 'Mountain', 4, {
    trees: objects.filter(o => o.type === 'object' && o.tier === 4 && o.subtype === 'tree' && spawnedVegetation.has(o.id)),
    rocks: objects.filter(o => ['MineRock_Obsidian', 'silvervein'].includes(o.id)),
    resources: ['Silver', 'Obsidian', 'WolfPelt', 'WolfFang', 'FreezeGland', 'Crystal', 'WolfClaw', 'WolfHairBundle', 'JuteRed', 'DragonEgg', 'DragonTear'],
    ingridients: ['Onion', 'WolfMeat', 'FreezeGland'],
    foods: resources.filter(item => item.tier === 4 && item.Food != null).map(item => item.id),
    chestLoot: ['SilverNecklace', 'ArrowFrost', 'Obsidian', 'BattleaxeWood', 'Upgrader3Armor', 'Upgrader3Weapon', 'FishingRod'],
    creatures: [...creatures.filter(c => c.tier === 4), ...fishes.filter(f => f.tier === 4)],
    trophies: uniq(creatures.filter(c => c.tier === 4)
      .flatMap(c => c.drop.map(d => d.item)
      .filter(i => data[i]?.type === 'trophy'))),
  }),
  biome('🍂', 'Plains', 5, {
    trees: objects.filter(o => o.type === 'object' && o.tier === 5 && o.subtype === 'tree' && spawnedVegetation.has(o.id)),
    rocks: objects.filter(o => o.type === 'object' && o.tier === 5 && o.subtype === 'rock' && spawnedVegetation.has(o.id)),
    resources: ['BlackMetal', 'Needle', 'LoxPelt', 'UndeadBjornRibcage', 'Barley', 'Flax', 'Tar', 'GoblinTotem', 'YagluthDrop'],
    ingridients: ['Cloudberry', 'LoxMeat'],
    foods: resources.filter(item => item.tier === 5 && item.Food != null).map(item => item.id),
    chestLoot: ['SilverNecklace', 'ArrowObsidian', 'SharpeningStone', 'AtgeirWood', 'Upgrader4Armor', 'Upgrader4Weapon'],
    creatures: [...creatures.filter(c => c.tier === 5), ...fishes.filter(f => f.tier === 5)],
    trophies: uniq(creatures.filter(c => c.tier === 5)
      .flatMap(c => c.drop.map(d => d.item)
      .filter(i => data[i]?.type === 'trophy'))),
  }),
  biome('🌫', 'Mistlands', 6, {
    trees: objects.filter(o => o.type === 'object' && o.tier === 6 && o.subtype === 'tree' && spawnedVegetation.has(o.id)),
    rocks: objects.filter(o => o.type === 'object' && o.tier === 6 && o.subtype === 'rock' && spawnedVegetation.has(o.id)),
    resources: ['ScaleHide', 'Softtissue', 'Sap', 'Eitr', 'BlackMarble', 'Bilebag', 'Carapace', 'Mandible', 'YggdrasilWood', 'BlackCore', 'JuteBlue', 'DvergrKeyFragment', 'CeramicPlate'],
    ingridients: ['HareMeat', 'BloodClot', 'RoyalJelly', 'BugMeat', 'MushroomJotunPuffs', 'MushroomMagecap'],
    foods: resources.filter(item => item.tier === 6 && item.Food != null).map(item => item.id),
    chestLoot: ['SilverNecklace', 'ArrowObsidian', 'SharpeningStone', 'THSwordWood', 'Upgrader5Armor', 'Upgrader5Weapon'],
    creatures: [...creatures.filter(c => c.tier === 6), ...fishes.filter(f => f.tier === 6)],
    trophies: uniq(creatures.filter(c => c.tier === 6)
      .flatMap(c => c.drop.map(d => d.item)
      .filter(i => data[i]?.type === 'trophy'))),
  }),
  biome('🔥', 'Ashlands', 7, {
    trees: objects.filter(o => o.type === 'object' && o.tier === 7 && o.subtype === 'tree' && spawnedVegetation.has(o.id)),
    rocks: objects.filter(o => o.type === 'object' && o.tier === 7 && o.subtype === 'rock' && spawnedVegetation.has(o.id)),
    resources: ['Blackwood', 'BonemawSerpentTooth', 'CelestialFeather', 'CharcoalResin', 'SulfurStone', 'ProustitePowder', 'CharredBone', 'CharredCogwheel', 'Charredskull', 'MorgenSinew', 'MorgenHeart', 'Fiddleheadfern', 'FlametalNew', 'ShieldCore', 'MoltenCore', 'GemstoneRed', 'GemstoneGreen', 'GemstoneBlue', 'AsksvinEgg', 'BellFragment', 'Bell', 'FaderDrop'],
    ingridients: ['MushroomSmokePuff', 'Vineberry', 'AskBladder', 'AsksvinMeat', 'VoltureEgg', 'VoltureMeat'],
    foods: resources.filter(item => item.tier === 7 && item.Food != null).map(item => item.id),
    chestLoot: ['SilverNecklace', 'ArrowObsidian', 'SharpeningStone', 'THSwordWood', 'Upgrader6Armor', 'Upgrader6Weapon'],
    creatures: [...creatures.filter(c => c.tier === 7), ...fishes.filter(f => f.tier === 7)],
    trophies: uniq(creatures.filter(c => c.tier === 7)
      .flatMap(c => c.drop.map(d => d.item)
      .filter(i => data[i]?.type === 'trophy'))),
  }),
  biome('🧊', 'DeepNorth', 8, {
    trees: objects.filter(o => o.type === 'object' && o.tier === 8 && o.subtype === 'tree' && spawnedVegetation.has(o.id)),
    rocks: objects.filter(o => o.type === 'object' && o.tier === 8 && o.subtype === 'rock' && spawnedVegetation.has(o.id)),
    resources: ['FaderEmber', 'MooseHide', 'Leatherstraps', 'FrozenFuel', 'BarkaBranch', 'MoleClaws', 'ElakingHairBundle', 'NornThread', 'Gold', 'OozeMork', 'GlowWorm', 'MemorialCoal', 'FrostCore', 'OrbFrostFire', 'OrbThunderBlood', 'HatefulBlood', 'FrozenKingDrop', 'CrownJewel'],
    ingridients: ['SealBlubber', 'MooseMeat', 'Kale', 'Oat', 'Poteitr'],
    foods: resources.filter(item => item.tier === 8 && item.Food != null).map(item => item.id),
    chestLoot: ['SilverNecklace', 'ArrowObsidian', 'SharpeningStone', 'THSwordWood', 'Upgrader6Armor', 'Upgrader6Weapon'],
    creatures: [...creatures.filter(c => c.tier === 8), ...fishes.filter(f => f.tier === 8)],
    trophies: uniq(creatures.filter(c => c.tier === 8)
      .flatMap(c => c.drop.map(d => d.item)
      .filter(i => data[i]?.type === 'trophy'))),
  }),
];
