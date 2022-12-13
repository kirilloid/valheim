import type { EntityId, ItemGrowConfig, PointLight } from '../types';

export const pickables: {
  id: string;
  iconId?: string;
  tier: number;
  item: EntityId;
  number?: number;
  grow?: ItemGrowConfig[];
  PointLight?: PointLight;
  subtype: 'misc' | 'plant';
}[] = [
  {
    id: 'Pickable_Branch',
    tier: 0,
    item: 'Wood',
    subtype: 'misc',
  },
  {
    id: 'Pickable_Stone',
    iconId: 'resource/Stone',
    tier: 0,
    item: 'Stone',
    subtype: 'misc',
  },
  {
    id: 'RaspberryBush',
    iconId: 'resource/Raspberry',
    tier: 1,
    item: 'Raspberry',
    subtype: 'plant',
  },
  {
    id: 'Pickable_Mushroom',
    iconId: 'resource/Mushroom',
    tier: 1,
    item: 'Mushroom',
    subtype: 'plant',
  },
  {
    id: 'Pickable_Dandelion',
    iconId: 'resource/Dandelion',
    tier: 1,
    item: 'Dandelion',
    subtype: 'plant',
  },
  {
    id: 'Pickable_Flint',
    iconId: 'resource/Flint',
    tier: 1,
    item: 'Flint',
    subtype: 'misc',
  },
  {
    id: 'BlueberryBush',
    iconId: 'resource/Blueberries',
    tier: 2,
    item: 'Blueberries',
    subtype: 'plant',
  },
  {
    id: 'Pickable_Thistle',
    iconId: 'resource/Thistle',
    tier: 2,
    item: 'Thistle',
    PointLight: { color: '#B2FFF9', range: 2, intensity: 1.5 },
    subtype: 'plant',
  },
  {
    id: 'Pickable_ForestCryptRemains01',
    iconId: 'resource/BoneFragments',
    tier: 2,
    item: 'BoneFragments',
    subtype: 'misc',
  },
  {
    id: 'Pickable_ForestCryptRemains02',
    iconId: 'resource/BoneFragments',
    tier: 2,
    item: 'BoneFragments',
    subtype: 'misc',
  },
  {
    id: 'Pickable_ForestCryptRemains03',
    iconId: 'resource/BoneFragments',
    tier: 2,
    item: 'resource/BoneFragments',
    subtype: 'misc',
  },
  {
    id: 'Pickable_ForestCryptRemains04',
    iconId: 'resource/BoneFragments',
    tier: 2,
    item: 'BoneFragments',
    subtype: 'misc',
  },
  {
    id: 'Pickable_Mushroom_yellow',
    iconId: 'resource/MushroomYellow',
    tier: 2,
    item: 'MushroomYellow',
    PointLight: { color: '#FFDE52', range: 1.5, intensity: 2.5 },
    subtype: 'plant',
  },
  {
    id: 'Pickable_Mushroom_blue',
    iconId: 'resource/MushroomBlue',
    tier: 2,
    item: 'MushroomBlue',
    PointLight: { color: '#9FDBFF', range: 1.5, intensity: 1.5 },
    subtype: 'plant',
  },
  {
    id: 'Pickable_SurtlingCoreStand',
    iconId: 'resource/SurtlingCore',
    tier: 2,
    item: 'SurtlingCore',
    subtype: 'misc',
  },
  {
    id: 'Pickable_MountainCaveObsidian',
    iconId: 'resource/Obsidian',
    tier: 4,
    item: 'Obsidian',
    subtype: 'misc',
  },
  {
    id: 'Pickable_MountainCaveCrystal',
    iconId: 'resource/Crystal',
    tier: 4,
    item: 'Crystal',
    subtype: 'misc',
  },
  {
    id: 'Pickable_Hairstrands01',
    iconId: 'resource/WolfHairBundle',
    tier: 4,
    item: 'WolfHairBundle',
    subtype: 'misc',
  },
  {
    id: 'Pickable_Hairstrands02',
    iconId: 'resource/WolfHairBundle',
    tier: 4,
    item: 'WolfHairBundle',
    subtype: 'misc',
  },
  {
    id: 'Pickable_Fishingrod',
    iconId: 'weapon/FishingRod',
    tier: 2,
    item: 'FishingRod',
    subtype: 'misc',
  },
  {
    id: 'Pickable_DragonEgg',
    iconId: 'resource/DragonEgg',
    tier: 4,
    item: 'DragonEgg',
    subtype: 'misc',
  },
  {
    id: 'CloudberryBush',
    iconId: 'resource/Cloudberry',
    tier: 5,
    item: 'Cloudberry',
    subtype: 'plant',
  },
  {
    id: 'Pickable_BlackCoreStand',
    iconId: 'resource/BlackCore',
    tier: 6,
    item: 'BlackCore',
    subtype: 'misc',
  },
  {
    id: 'Pickable_DvergrLantern',
    iconId: 'weapon/Lantern',
    tier: 6,
    item: 'Lantern',
    subtype: 'misc',
  },
  {
    id: 'Pickable_DvergrStein',
    iconId: 'weapon/Tankard_dvergr',
    tier: 6,
    item: 'Tankard_dvergr',
    subtype: 'misc',
  },
];
