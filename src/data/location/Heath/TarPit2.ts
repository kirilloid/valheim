import { locItem } from '../../../model/game';
import { loc } from '../common';

export default loc(
  5, 'TarPit2', ['Plains'],
  { biomeArea: 2, quantity: 100, group: 'tarpit', minApart: 128, terrainDelta: [0, 1.5], minAlt: 5, maxAlt: 60, radius: [20, 25],
    items: [
      locItem('BlobTar', 0.5, 7),
      locItem('Spawner_BlobTar_respawn_30', 1, 2),
      locItem('Pickable_TarBig', 1, 4),
      locItem('Pickable_Tar', 1, 8),
    ],
  },
  'TarPit',
);
