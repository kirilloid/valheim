import { locItem } from "../../../model/game";
import { loc } from "../common";

export default loc(
  7, 'CharredFortress', ['Ashlands'],
  { type: 'misc',
    biomeArea: 7, quantity: 20, group: 'zigg', minApart: 256,
    terrainDelta: [0, 4], minAlt: 20, radius: [32, 12],
    items: [
      locItem('Charred_Mage', 1, 2),
      // fort
      // spawners
      locItem('Spawner_CharredCross', 1, 2),
      locItem('Charred_Mage'),
      locItem('Charred_Archer'),
      locItem('Charred_Archer', 0.6, 4),
      locItem('Charred_Mage', 0.6, 2),
      locItem('piece_Charred_Balista', 0.8, 4),
      locItem('TreasureChest_charredfortress'),
      locItem('TreasureChest_charredfortress'),
      locItem('Vegvisir_Fader', 1, 0.5),
      locItem('Charred_altar_bellfragment'),
      // gate
      locItem('Ashlands_Fortress_Gate_Door', 1, 3),
      locItem('CharredBanner2', 1, 6),
      // banner
      locItem('CharredBanner1', 0.66, 8),
      locItem('CharredBanner2', 0.66, 8),
      // gravestones
      locItem('GraveStone_Broken_CharredTwitcherNest', 0.5, 24),
      locItem('GraveStone_CharredTwitcherNest', 0.5, 29),
      // gravestones_outside
      locItem('GraveStone_Broken_CharredTwitcherNest', 0.5, 22),
      locItem('GraveStone_CharredTwitcherNest', 0.5, 30),
      // moltencore
      locItem('Pickable_MoltenCoreStand', 0.05, 8),
      locItem('Pickable_MoltenCoreStand', 1, 2),
    ],
  },
  'CharredFortress',
);
