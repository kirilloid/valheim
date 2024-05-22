import type { LocationItem } from '../../../types';
import { locItem } from '../../../model/game';

export const TIP = locItem([ // tip
  locItem('Ashlands_Pillar4_tip3_broken2'),
  locItem('Ashlands_Pillar4_tip3_broken3', 0.5),
], 0.5);

export const ROOF1 = (number: number, hasTip: boolean) => locItem([
  locItem('Ashlands_ArchRoofDamaged_half1', 0.66),
  locItem('FernAshlands', 0.9, number),
  locItem('Pickable_Fiddlehead', 0.5, number),
  ...(hasTip ? [TIP] : []),
], 0.9);

export const ROOF2 = (number: number, hasTip: boolean) => locItem([
  locItem('Ashlands_ArchRoofDamaged_half2'),
  locItem('FernAshlands', 0.9, number),
  locItem('Pickable_Fiddlehead', 0.5, number),
  ...(hasTip ? [TIP] : []),
], 0.9);

export const FLOOR_AND_POTS = (...extra: LocationItem[]) => locItem([ // floorandpots
  locItem('Ashlands_Ruins_Floor_6x6_broken1'),
  locItem('ashland_pot3_red', 0.33),
  locItem('ashland_pot3_green', 0.33),
  locItem('ashland_pot2_red', 0.33),
  locItem('ashland_pot2_green', 0.33),
  locItem('ashland_pot1_red', 0.33),
  locItem('ashland_pot1_green', 0.33),
  ...extra,
], 0.5);

export const POT_FLOOR_RED = (...extra: LocationItem[]) => locItem([
  locItem('ashland_pot1_red', 0.33),
  locItem('ashland_pot2_red', 0.33),
  locItem('ashland_pot3_red', 0.33),
  ...extra,
]);

export const POT_FLOOR_GREEN = (...extra: LocationItem[]) => locItem([
  locItem('ashland_pot1_green', 0.33),
  locItem('ashland_pot2_green', 0.33),
  locItem('ashland_pot3_green', 0.33),
  ...extra,
]);

export const STAIR_W_STONE = locItem([
  locItem('Ashland_Steepstair'),
  locItem('Ashlands_Ruins_Floor_1point5x1point5'),
]);

export const PEAK = (...extra: LocationItem[]) => locItem([
  ...extra,
  locItem('Ashlands_Pillar4_tip3_broken1'),
  locItem([
    locItem('Ashlands_Pillar4_tip3_broken2'),
    locItem('Ashlands_Pillar4_tip3_broken3', 0.8),
  ], 0.6),
], 0.6);

export const ARCH_TIP = (...extra: LocationItem[]) => locItem([
  locItem('Ashlands_Arch2_Broken2', 1, 2),
  locItem('Ashlands_Arch2_Broken1'),
  locItem('Ashlands_Pillar4_tip2_broken1'),
  locItem('Ashlands_Pillar4_tip2_broken2', 0.6),
  ...extra,
], 0.6);
