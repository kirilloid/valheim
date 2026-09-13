import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  8, 'DN_Bossroom', ['DeepNorth'],
  { components: [],
    biomeArea: 7, quantity: 3, prioritized: true, minApart: 1024, group: 'dn_boss',
    iconPlaced: true, slopeRotation: true,
    terrainDelta: [0, 6], radius: [32, 32], minAlt: 80, maxAlt: 5000,
    items: [
      locItem('caverock_curvedwallbig', 1, 24),
      locItem('caverock_floorsmall', 1, 19),
      locItem('caverock_curvedwallbig', 1, 23),
      locItem('caverock_curvedwallbig', 1, 8),
      locItem('caverock_curvedrock', 1, 10),
      locItem('icelake'),
      locItem('caverock_pillar', 1, 4),
      locItem('LastBossGate_InternalGate'),
      locItem('LastBossGate_Pillarbase'),
      locItem('LastBossGate_Pillar', 0.75, 8),
      locItem('LastBossGate_Pillar', 1, 2),
      locItem('LastBossGate_Chain', 0.75, 34),
      locItem('LastBossGate_Chain2', 0.75, 30),
      locItem('FrozenKing'),
      // exterior
      locItem('LastBossGate'),
      locItem('LastBossGate_Pillarbase', 1, 8),
      locItem('RuneTablet_FrozenKing'),
      locItem('offeraltar_FrozenKing'),
    ],
  },
);
