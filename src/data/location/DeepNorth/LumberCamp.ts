import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  8, 'LumberCamp', ['DeepNorth'],
  { components: [],
    biomeArea: 2, quantity: 50, group: 'thehole',
    minApart: 100, radius: [30, 20], terrainDelta: [0, 3], minAlt: 4,
    items: [
      locItem('SnowFirTree_small', 0.75, 8),
      locItem('SnowFirTree_small', 0.8),
      locItem('stubbe_deepnorth', 0.66, 30),
      locItem('stubbe_deepnorth', 0.8, 10),
      // DN_hut01
      locItem([
        locItem('TreasureChest_deepnorth_village'),
        locItem('prop_ashwood_bed'),
        locItem([
          locItem('wood_floor', 0.75, 15),
          locItem('wood_gate', 0.5),
          locItem('darkwood_roof_67', 1, 4),
          locItem('darkwood_roof_67', 0.75, 4),
          locItem('darkwood_roof_top_67', 1, 2),
          locItem('stave_beam_67', 1, 8),
          locItem('stave_wall_2x2', 1, 11),
          locItem('stave_wall_2x2', 0.5, 2),
          locItem('stave_wall_2x2', 0.75, 4),
          locItem('scale_halfwall_1x2', 0.5),
          locItem('scale_wall_roof_67', 2),
          locItem('stave_beam_2m', 1, 2),
          locItem('stave_wall_cross_67', 0.5, 2),
          locItem('scale_wall_roof_67_flipped', 1, 2),
          locItem('stave_beam_4m', 1, 4),
          locItem([
            locItem('darkwood_roof_top_67', 1, 2),
            locItem('darkwood_roof_top_67', 0.5),
            locItem('darkwood_roof_67', 0.75, 2),
          ], 0.5),
          locItem([
            locItem('darkwood_roof_45', 1, 2),
            locItem('stave_pole_4m', 1, 2),
            locItem('stave_deco_wall_2x2', 1, 2),
            locItem('darkwood_roof_top_45', 0.5),
            locItem('stave_wall_cross_45', 0.5),
            locItem('stave_beam_45', 1, 2),
          ], 0.5),
        ]),
      ]),
      // GameObject
      locItem([
        locItem('prop_wood_stack', 0.5, 10),
        locItem('prop_wood_stack', 1, 3),
        locItem('prop_piece_workbench_ext1'),
        locItem('prop_piece_workbench_ext3'),
      ]),
    ],
  },
);
