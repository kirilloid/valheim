import { locItem } from '../../../model/game';
import { theHole } from '../../rooms/thehole';
import { loc } from '../common';

export default loc(
  8, 'TheHole01', ['DeepNorth'],
  { components: [],
    biomeArea: 2, quantity: 40, group: 'thehole',
    minApart: 256, terrainDelta: [0, 3], minAlt: 2, radius: [20, 28],
    items: [
      locItem('wood_floor', 1, 225),
      locItem('wood_floor_1x1', 1, 2),
      locItem('stave_wall_2x2', 1, 266),
      locItem('stave_pole_4m', 1, 106),
      locItem('stave_pole_2m', 1, 26),
      locItem('stave_beam_2m', 1, 34),
      locItem('stave_beam_4m', 1, 115),
      locItem('stave_beam_26', 1, 16),
      locItem('stave_beam_45', 1, 62),
      locItem('stave_beam_67', 1, 12),
      locItem('stave_deco_wall_2x2', 1, 81),
      locItem('darkwood_roof_45', 1, 94),
      locItem('darkwood_roof_icorner_45', 1, 12),
      locItem('darkwood_roof_ocorner_45', 1, 14),
      locItem('darkwood_gate', 1, 12),
      locItem('piece_bench01', 1, 12),
      locItem('rug_fur', 1, 4),
      locItem('loot_deepNorth_TimberHall', 1, 2),
      locItem('piece_chest_warderobe', 1, 1),
      locItem('MoldArmorHoldHelmet', 0.5), // inside wardrobe
      locItem('scale_wall_roof_26', 1, 4),
      locItem('scale_wall_roof_26_flipped', 1, 5),
      locItem('scale_wall_roof_67', 1, 3),
      locItem('scale_wall_roof_67_flipped', 1, 3),
      locItem('scale_wall_roof_45', 1, 2),
      locItem('scale_wall_roof_45_flipped', 1, 2),
      locItem('scale_wall_roof_45_upsidedown', 1, 2),
      locItem('scale_wall_roof_45_upsidedown_flipped', 1, 2),
    ],
    dungeon: theHole,
  },
);
