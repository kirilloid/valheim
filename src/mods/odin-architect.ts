import { GameObject, ItemRecipe, mods, Piece, Tool } from '../types';
import { MaterialType } from '../types';
import {
  crystalStructureRecipe,
  ironStructureRecipe,
  stoneStructureRecipe,
  woodStructureRecipe,
  wearStructure,
  woodResist,
  cookingResist,
  darkwoodStructureWear,
  ironStructureWear,
  stoneStructureWear,
  woodStructureWear,
} from '../model/building';
import { workbenchRecipe } from '../model/recipe';

const buildings: Piece[] = [
  {
    id: 'rae_woodwall_half',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(1),
  },
  {
    id: 'rae_woodwall_3',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(2),
  },
  {
    id: 'rae_woodwall_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 2,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { RoundLog: 2, Wood: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_woodwall_1_half',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 2,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { RoundLog: 1, Wood: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_woodwall_2',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 2,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { RoundLog: 2, Wood: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_woodwall_2_half',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 2,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { RoundLog: 1, Wood: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_woodwall_4',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { ElderBark: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_woodwall_4_half',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { ElderBark: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'wooden_gate_1',
    base: false,
    type: 'piece',
    subtype: 'door',
    components: ['Door'],
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 4, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(20),
  },
  {
    id: 'rae_elevator',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 4, 1] },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { SurtlingCore: 3, Iron: 6, IronNails: 20, Wood: 10 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_elevator_big',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 4, 2] },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { SurtlingCore: 6, Iron: 8, IronNails: 30, Wood: 20 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'wooden_window_small',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(3),
  },
  {
    id: 'wooden_window_big',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 4, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(6),
  },
  {
    id: 'wooden_fence_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(2),
  },
  {
    id: 'wooden_fence_1_gate',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(3),
  },
  {
    id: 'wooden_fence_2',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(3),
  },
  {
    id: 'wooden_fence_2_gate',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(4),
  },
  {
    id: 'rae_irondeco_fence_2', // no translation?
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 5,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Iron: 3, Tar: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_darkwooddeco_fence', // no translation?
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 5,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: darkwoodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { FineWood: 4, Tar: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_irondeco_fence', // no translation?
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 5,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Iron: 3, Tar: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'thin_wood_beam_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(1, 'FineWood'),
  },
  {
    id: 'thin_wood_beam_2', 
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(2, 'FineWood'),
  },
  {
    id: 'thin_wood_pole_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [0, 1, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(1, 'FineWood'),
  },
  {
    id: 'thin_wood_pole_2', 
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [0, 2, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(2, 'FineWood'),
  },
  {
    id: 'piece_woodbeam_25_thin',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(1, 'FineWood'),
  },
  {
    id: 'piece_woodbeam_45_thin',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(1, 'FineWood'),
  },
  {
    id: 'thin_iron_beam_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(2),
  },
  {
    id: 'thin_iron_beam_2',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(1),
  },
  {
    id: 'thin_iron_pole_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(2),
  },
  {
    id: 'thin_iron_pole_2',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(1),
  },
  {
    id: 'thin_rae_crystal_beam_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(2),
  },
  {
    id: 'thin_rae_crystal_beam_2',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(1),
  },
  {
    id: 'thin_rae_crystal_pole_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(1),
  },
  {
    id: 'thin_rae_crystal_pole_2',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(2),
  },
  {
    id: 'piece_ironbeam_25_thin',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(2),
  },
  {
    id: 'piece_ironbeam_45_thin',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(2),
  },
  {
    id: 'piece_crystalbeam_25_thin',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [2, 1, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(2),
  },
  {
    id: 'piece_crystalbeam_45_thin',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(2),
  },
  {
    id: 'rae_darkwood_arch_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 5,
    piece: { target: 'random', water: undefined, size: [2, 2, 1] },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { FineWood: 2, Tar: 1 },
      station: 'forge',
    },
  },
  {
    id: 'wooden_drawbridge_1',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 2] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 12, Iron: 6, SurtlingCore: 1 },
      station: 'forge',
    },
  },
  { // ?
    id: 'wooden_arch_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: { target: 'random', water: undefined, size: [2, 2, 1] },
    wear: woodStructureWear,
    recipe: woodStructureRecipe(2),
  },
  {
    id: 'refined_stakewall_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 2,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: wearStructure(1000, woodResist, MaterialType.Wood, { noRoof: false }),
    recipe: {
      type: 'craft_piece',
      materials: { RoundLog: 5, BronzeNails: 5 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'refined_stakewall_2',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: wearStructure(1000, woodResist, MaterialType.Wood, { noRoof: false }),
    recipe: {
      type: 'craft_piece',
      materials: { RoundLog: 7, Wood: 5, IronNails: 10 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'refined_sharpstakes',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 2,
    piece: { target: 'random', water: undefined, groundOnly: true, size: [1, 0, 2] },
    wear: wearStructure(200, woodResist, MaterialType.Wood, { noRoof: false }),
    recipe: {
      type: 'craft_piece',
      materials: { RoundLog: 8, BronzeNails: 5 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'food_smelter',
    base: false,
    type: 'piece',
    components: ['CookingStation'],
    subtype: 'craft',
    group: 'cook',
    tier: 1,
    emoji: '🍳',
    craft: {
      requiresFire: true,
      batchSize: 10,
    },
    // RawMeat -> CookedMeat
    piece: {
      target: 'primary',
      water: false,
    },
    wear: {
      hp: 20,
      damageModifiers: cookingResist,
      noRoof: false,
      noSupport: true,
      materialType: MaterialType.Wood,
    },
    recipe: {
      type: 'craft_piece',
      materials: { Coal: 20, SurtlingCore: 4, Iron: 5 },
      station: 'piece_workbench',
    }
  },
  {
    id: 'rae_bird_house',
    base: false,
    type: 'piece',
    components: ['Smelter'],
    subtype: 'craft',
    tier: 2,
    emoji: '🐦🏠',
    // FishingBait -> Feathers
    craft: {},
    piece: { target: 'primary', water: undefined, size: [1, 1, 1] },
    wear: wearStructure(200, mods([0, 0, 1, 0, 0, 3, 3, 0, 3, 3]), undefined, { noRoof: false }),
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 5, BronzeNails: 8, RoundLog: 1 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_fish_trap',
    base: false,
    type: 'piece',
    components: ['Smelter'],
    subtype: 'craft',
    tier: 2,
    emoji: '',
    piece: { target: 'primary', water: true, size: [1, 1, 1] },
    // FishingBait -> FishRaw
    craft: {},
    wear: wearStructure(200, mods([0, 0, 1, 0, 0, 3, 3, 0, 3, 3]), undefined, { noRoof: false }),
    recipe: {
      type: 'craft_piece',
      materials: { AncientSeed: 1, Wood: 8, Resin: 10 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_compost',
    base: false,
    type: 'piece',
    components: ['Smelter'],
    subtype: 'craft',
    tier: 2,
    emoji: '',
    piece: { target: 'primary', water: undefined, size: [1, 1, 1] },
    // NeckTail -> FishingBait
    // RawMeat -> FishingBait
    craft: {},
    wear: wearStructure(200, mods([0, 0, 1, 0, 0, 3, 3, 0, 3, 3]), undefined, { noRoof: false }),
    recipe: {
      type: 'craft_piece',
      materials: { NeckTail: 8, Wood: 5, Resin: 10 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'surtling_lantern_1',
    base: true,
    type: 'piece',
    components: ['Fireplace'],
    subtype: 'fireplace',
    emoji: '',
    tier: 1,
    fireplace: {
      fuel: '',
      capacity: 0,
      burnTime: 0,
      minHeightAbove: 0.76,
      warmRadius: 0,
      lightRadius: 0,
      smoke: false,
      fireworks: false,
    },
    piece: { target: 'primary', water: undefined, size: [0, 1, 0] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 1, SurtlingCore: 1, Iron: 3 },
      station: 'forge',
    },
  },
  {
    id: 'surtling_lantern_2',
    base: true,
    type: 'piece',
    components: ['Fireplace'],
    subtype: 'fireplace',
    emoji: '',
    tier: 1,
    fireplace: {
      fuel: '',
      capacity: 0,
      burnTime: 0,
      minHeightAbove: 0.76,
      warmRadius: 0,
      lightRadius: 0,
      smoke: false,
      fireworks: false,
    },
    piece: { target: 'primary', water: undefined, size: [0.5, 0.5, 0.5] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 10, SurtlingCore: 1, Iron: 5 },
      station: 'forge',
    },
  },
  {
    id: 'surtling_lantern_3',
    base: true,
    type: 'piece',
    components: ['Fireplace'],
    subtype: 'fireplace',
    emoji: '',
    tier: 1,
    fireplace: {
      fuel: '',
      capacity: 0,
      burnTime: 0,
      minHeightAbove: 0.76,
      warmRadius: 0,
      lightRadius: 0,
      smoke: false,
      fireworks: false,
    },
    piece: { target: 'primary', water: undefined, size: [0.5, 0.5, 0.5] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 14, SurtlingCore: 2, Iron: 7 },
      station: 'forge',
    },
  },
  {
    id: 'surtling_lantern_4',
    base: true,
    type: 'piece',
    components: ['Fireplace'],
    subtype: 'fireplace',
    emoji: '',
    tier: 1,
    fireplace: {
      fuel: '',
      capacity: 0,
      burnTime: 0,
      minHeightAbove: 0.76,
      warmRadius: 0,
      lightRadius: 0,
      smoke: false,
      fireworks: false,
    },
    piece: { target: 'primary', water: undefined, size: [0.5, 0.5, 0.5] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 5, SurtlingCore: 2, Iron: 3 },
      station: 'forge',
    },
  },
  {
    id: 'surtling_lantern_5',
    base: true,
    type: 'piece',
    components: ['Fireplace'],
    subtype: 'fireplace',
    emoji: '',
    tier: 1,
    fireplace: {
      fuel: '',
      capacity: 0,
      burnTime: 0,
      minHeightAbove: 0.76,
      warmRadius: 0,
      lightRadius: 0,
      smoke: false,
      fireworks: false,
    },
    piece: { target: 'primary', water: undefined, size: [0.5, 0.5, 0.5] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { SurtlingCore: 1, Iron: 3 },
      station: 'forge',
    },
  },
  {
    id: 'stone_beam_short',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(1),
  },
  {
    id: 'stone_beam_long',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(2),
  },
  {
    id: 'stone_pole_short',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(1),
  },
  {
    id: 'stone_pole_long',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(2),
  },
  {
    id: 'iron_beam_short',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(1),
  },
  {
    id: 'iron_beam_long',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(2),
  },
  {
    id: 'iron_pole_short',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(1),
  },
  {
    id: 'iron_pole_long',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(2),
  },
  {
    id: 'rae_crystal_beam_short',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(1),
  },
  {
    id: 'rae_crystal_beam_long',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(2),
  },
  {
    id: 'rae_crystal_pole_short',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [1, 0, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(1),
  },
  {
    id: 'rae_crystal_pole_long',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [2, 0, 0] },
    wear: ironStructureWear,
    recipe: crystalStructureRecipe(2),
  },
  {
    id: 'stone_window_small',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: stoneStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 2, Stone: 5 },
      station: 'piece_stonecutter',
    },
  },
  {
    id: 'stone_window_big',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 4, 0] },
    wear: stoneStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Wood: 4, Stone: 10 },
      station: 'piece_stonecutter',
    },
  },
  {
    id: 'stone_arch_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [4, 4, 2] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(40),
  },
  {
    id: 'stone_arch_2_small',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 1] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(15),
  },
  {
    id: 'stone_table_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 1] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(12),
  },
  {
    id: 'stone_throne_1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [1, 2, 1] },
    wear: stoneStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Stone: 15, Iron: 10, Silver: 10 },
      station: 'piece_stonecutter',
    },
  },
  {
    id: 'stone_floor_1_new',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 0.5, 2] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(6),
  },
  {
    id: 'stonewall_hardrock_1x1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 1, 0.5] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(2),
  },
  {
    id: 'stonewall_hardrock_2x1',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 1, 0.5] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(4),
  },
  {
    id: 'stonewall_hardrock_4x2',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [4, 2, 0.5] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(12),
  },
  {
    id: 'stonewall_hardrock_arch',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 1, 0.5] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(2),
  },
  {
    id: 'stonewall_hardrock_pillar',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 2, 1] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(6),
  },
  {
    id: 'stonewall_hardrock_stairs',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 0.5, 2] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(6),
  },
  {
    id: 'big_pillar',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 4, 1] },
    wear: stoneStructureWear,
    recipe: stoneStructureRecipe(24),
  },
  {
    id: 'iron_dragon',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 2] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(35),
  },
  {
    id: 'rae_darkwood_iron_wolf',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 2] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(25),
  },
  {
    id: 'rae_darkwood_iron_raven',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 2] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(25),
  },
  {
    id: 'iron_gate_big',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 4, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(35),
  },
  {
    id: 'iron_gate_small',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [1, 2, 0] },
    wear: ironStructureWear,
    recipe: ironStructureRecipe(5),
  },
  {
    id: 'piece_woodgate_crystal',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 4,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: darkwoodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { FineWood: 10, Crystal: 3 },
      station: 'forge',
    },
  },
  {
    id: 'piece_woodgate_darkwood',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 5,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: darkwoodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { FineWood: 10, Tar: 3 },
      station: 'forge',
    },
  },
  {
    id: 'piece_woodgate_iron',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 3,
    piece: { target: 'random', water: undefined, size: [2, 2, 0] },
    wear: darkwoodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { FineWood: 10, Iron: 5 },
      station: 'forge',
    },
  },
  {
    id: 'rae_hidden_door',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 2,
    piece: { target: 'random', water: undefined, size: [2, 0, 2] },
    wear: darkwoodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { FineWood: 2 },
      station: 'piece_workbench',
    },
  },
  {
    id: 'rae_bigcrystal_w',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 5,
    piece: { target: 'random', water: undefined, size: [2, 2, 0.5] },
    wear: darkwoodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Crystal: 5, Tar: 2 },
      station: 'forge',
    },
  },
  {
    id: 'rae_crystal_floorslab',
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 5,
    piece: { target: 'random', water: undefined, size: [2, 0.5, 2] },
    wear: darkwoodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { Crystal: 6, Tar: 3 },
      station: 'forge',
    },
  },
  {
    id: 'rae_darkwood_gate_iron',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 5,
    piece: { target: 'random', water: undefined, size: [2, 4, 0] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { FineWood: 5, Iron: 35, Tar: 10 },
      station: 'forge',
    },
  },
  {
    id: 'rae_darkwood_gate_crystal',
    base: false,
    type: 'piece',
    components: ['Door'],
    subtype: 'door',
    tier: 5,
    piece: { target: 'random', water: undefined, size: [2, 4, 0] },
    wear: ironStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { FineWood: 5, Crystal: 15, Tar: 10 },
      station: 'forge',
    },
  },
];

const tools: Tool[] = [
  {
    id: 'odin_hammer',
    type: 'tool',
    special: 'build',
    tier: 1,
    weight: 2,
    maxLvl: 3,
    durability: [300, 200],
    produces: buildings.map(b => b.id),
  },
];

export const data: GameObject[] = [
  ...tools,
  ...buildings,
].map(p => ({ ...p, mod: 'OdinArchitect' }));

export const recipes: ItemRecipe[] = [
  workbenchRecipe(1, { Wood: 5, Stone: 5 }, { Wood: 1, Stone: 1 }, 'odin_hammer'),
];