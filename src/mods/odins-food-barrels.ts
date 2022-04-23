import type { EntityId, GameObject, ItemRecipe, Piece } from '../types';
import { woodStructureWear } from '../model/building';

const sizes: Record<'barrel' | 'basket', [number, number, number]> = {
  barrel: [1, 1, 1],
  basket: [0.5, 0.5, 0],
};

const building = (id: EntityId, type: 'barrel' | 'basket', tier: number, resourceType: EntityId): Piece => ({
  id,
  iconId: `resource/${resourceType}`,
  base: false,
  type: 'piece',
  subtype: 'structure',
  tier,
  piece: {
    target: 'random',
    water: undefined,
    size: sizes[type],
  },
  wear: woodStructureWear,
  recipe: {
    type: 'craft_piece',
    materials: { [resourceType]: 50 },
    station: 'piece_workbench',
  },
});

const buildings: Piece[] = [
  building('OH_Raspberries', 'barrel', 1, 'Raspberry'),
  building('OH_Blue_Mushrooms', 'basket', 3, 'MushroomBlue'),
  building('OH_Blueberries', 'barrel', 2, 'Blueberries'),
  building('OH_Carrots', 'barrel', 2, 'Carrot'),
  building('OH_CloudBerries', 'barrel', 5, 'Cloudberry'),
  building('OH_Fish', 'barrel', 2, 'FishRaw'),
  building('OH_Honey', 'barrel', 1, 'Honey'),
  building('OH_Red_Mushrooms', 'basket', 1, 'Mushroom'),
  building('OH_Turnips', 'barrel', 3, 'Turnip'),
  building('OH_Yellow_Mushrooms', 'basket', 2, 'MushroomYellow'),
  building('OH_Dandelion', 'basket', 2, 'Dandelion'),
  building('OH_Thistle', 'basket', 2, 'Thistle'),
  building('OH_Barley', 'basket', 5, 'Barley'),
  building('OH_Flax', 'basket', 5, 'Flax'),
  building('OH_Onions', 'barrel', 4, 'Onion'),
  {
    id: 'OH_Seedbag',
    components: ['Container'],
    base: false,
    type: 'piece',
    subtype: 'structure',
    tier: 1,
    piece: {
      target: 'random',
      water: undefined,
      size: [1, 1, 1],
    },
    wear: woodStructureWear,
    recipe: {
      type: 'craft_piece',
      materials: { DeerHide: 5 },
      station: 'piece_workbench',
    },
  }
];

export const data: GameObject[] = [
  ...buildings,
].map(p => ({ ...p, mod: 'OdinsFoodBarrels' }));

export const recipes: ItemRecipe[] = [];
