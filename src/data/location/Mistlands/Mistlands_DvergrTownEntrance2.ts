import { locItem } from '../../../model/game';
import { dvergrTown } from '../../rooms';
import { loc } from '../common';

export default loc(
  6, 'Mistlands_DvergrTownEntrance2', ['Mistlands'],
  { type: 'dungeon', components: ['DungeonGenerator'],
    biomeArea: 2, quantity: 120, prioritized: true, group: 'DvergrDungeon', minApart: 256,
    randomRotation: false, slopeRotation: true,
    terrainDelta: [0, 40], maxAlt: 20, radius: [32, 32],
    items: [
      // fort
      locItem('dvergrtown_base', 1, 4),
      locItem('dvergrtown_4x2x1', 1, 8),
      locItem('dvergrtown_1x1x1', 1, 4),
      locItem('dvergrtown_2x2x2_enforced', 1, 8),
      locItem('blackmarble_head01'),
      locItem([locItem('CreepProp_pillarhalf02', 1, 2)], 0.6, 2), // pillar
      locItem('dvergrtown_floor_large'),
      locItem('CreepProp_hanging01', 0.6, 6),
      locItem('CreepProp_entrance1', 0.5, 6),
      locItem('CreepProp_entrance2', 0.5, 2),
      locItem('CreepProp_wall01', 0.5, 7),
      locItem('dverger_demister_broken', 1, 2),
      // room
      locItem('caverock_curvedwallbig', 1, 9),
      locItem('caverock_floorsmall'),
      locItem('caverock_curvedrock', 1, 25),
      // wall
      locItem('blackmarble_2x2x2', 1, 75),
      locItem('blackmarble_stair', 1, 27),
      locItem('blackmarble_1x1', 1, 2),
      locItem('dverger_demister_broken'),
      locItem('dverger_demister_ruins'),
      // cliffs
      locItem('cliff_mistlands2', 1, 5),
      // randomcliff
      locItem('cliff_mistlands2', 0.5, 3),
      locItem('cliff_mistlands1', 0.8, 5),

      locItem('Spawner_Seeker', 1, 2),
      locItem('Spawner_Seeker', 0.5, 2),
    ],
    dungeon: dvergrTown,
  },
  'Mistlands_DvergrTown',
);
