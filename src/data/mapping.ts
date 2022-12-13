import { EntityId } from '../types';
import { creatures } from './creatures';

export const mapping = new Map<string, EntityId>([
  ['wood_wall', 'woodwall'],
  ['wood_dragon', 'wood_dragon1'],
  ['wood_beam1', 'wood_beam_1'],
 
  ['sapling_turnip', 'Pickable_Turnip'],
  ['sapling_seedturnip', 'Pickable_SeedTurnip'],
  ['sapling_barley', 'Pickable_Barley'],
  ['sapling_flax', 'Pickable_Flax'],
  ['piece_sapling_jotunpuffs', 'Pickable_Mushroom_JotunPuffs'],
  ['piece_sapling_magecap', 'Pickable_Mushroom_Magecap'],
  ['Pickable_Flax_Wild', 'Pickable_Flax'],
  ['Pickable_Barley_Wild', 'Pickable_Barley'],

  ['Birch2', 'Birch1'],
  ['Birch2_aut', 'Birch1_aut'],
  ['dungeon_forestcrypt_door', 'wood_door'],
  ['dungeon_sunkencrypt_irongate', 'iron_grate'],
  ['sunken_crypt_gate', 'iron_grate'],
  ['CastleKit_groundtorch', 'piece_groundtorch_wood'],
  ['CastleKit_groundtorch_green', 'piece_groundtorch_green'],

  ['GoblinArcher', 'Goblin'],
  ['Draugr_Ranged', 'Draugr'],
  ['Skeleton_NoArcher', 'Skeleton'],
  ['loxcalf_ragdoll', 'Lox'],
  ...creatures
    .map(c => [c.ragdollId, c.id])
    .filter(c => c[0] != null) as [string, string][],
]);
