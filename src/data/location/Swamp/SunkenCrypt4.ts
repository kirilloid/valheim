import { locItem } from '../../../model/game';
import { sunkencrypt } from '../../rooms';
import { loc } from '../common';

export default loc(
  3, 'SunkenCrypt4', ['Swamp'], // 1,2,3 disabled
  { type: 'dungeon', components: ['DungeonGenerator'],
    biomeArea: 2, quantity: 175, prioritized: true, group: 'SunkenCrypt', minApart: 64, terrainDelta: [0, 4], minAlt: 0, maxAlt: 2, radius: [14, 12],
    // exterior
    items: [
      locItem('Draugr', 0.3, 1),
      locItem('BlobElite', 0.3, 1),
      locItem('piece_groundtorch_green', 1, 2),
    ],
    needsKey: 'CryptKey',
    dungeon: sunkencrypt,
  },
  'SunkenCrypt',
);
