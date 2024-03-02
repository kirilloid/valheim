import type { ItemRecipe } from '../types';
import {
  blackForgeRecipe,
  cauldronRecipe,
  forgeRecipe,
  genericRecipe,
  inventoryRecipe,
  mageTableRecipe,
  potionRecipe,
  smelterRecipe,
  haldorRecipe,
  hildirRecipe,
  workbenchRecipe,
} from '../model/recipe';
import { fishes } from './fish';

const allFishes = Object.fromEntries(fishes.map(f => [f.id, 1]));

const STONECUTTER_TIME = 2;
const KILN_TIME = 15;
const SPIN_WHEEL_TIME = 30;

export const recipes: ItemRecipe[] = [
  inventoryRecipe({ Wood: 3, Stone: 2 }, 'Hammer'),
  workbenchRecipe(0, { Wood: 6 }, { BoneFragments: 5 }, 'Club'),
  workbenchRecipe(0, { Wood: 5, Stone: 4 }, { Stone: 2 }, 'AxeStone'),
  workbenchRecipe(0, { Wood: 1, Resin: 1 }, {}, 'Torch'),
  // WORKBENCH
  workbenchRecipe(1, { Wood: 5, Stone: 2 }, { Wood: 1, Stone: 1 }, 'Hoe'),
  workbenchRecipe(1, { Wood: 4, Flint: 6 }, { Flint: 3, LeatherScraps: 2 }, 'AxeFlint'),
  workbenchRecipe(1, { Wood: 2, Flint: 4, LeatherScraps: 2 }, { Flint: 2 }, 'KnifeFlint'),
  workbenchRecipe(1, { Wood: 10, LeatherScraps: 8 }, { Wood: 5, LeatherScraps: 4, DeerHide: 1 }, 'Bow'),
  workbenchRecipe(1, { Wood: 3, Stone: 10 }, { Wood: 1, Stone: 5 }, 'PickaxeStone'),
  workbenchRecipe(1, { Wood: 10, HardAntler: 1 }, {}, 'PickaxeAntler'),
  workbenchRecipe(1, { Wood: 10, Resin: 4, LeatherScraps: 4 }, { Wood: 5, Resin: 2, LeatherScraps: 2 }, 'ShieldWood'),
  workbenchRecipe(1, { Wood: 10, LeatherScraps: 6 }, { Wood: 5, LeatherScraps: 3 }, 'ShieldWoodTower'),
  workbenchRecipe(1, { Wood: 5, Flint: 10, LeatherScraps: 2 }, { Wood: 3, Flint: 5, LeatherScraps: 1 }, 'SpearFlint'),
  workbenchRecipe(1, { LeatherScraps: 5 }, { LeatherScraps: 5 }, 'ArmorRagsLegs'),
  workbenchRecipe(1, { LeatherScraps: 5 }, { LeatherScraps: 5 }, 'ArmorRagsChest'),
  workbenchRecipe(1, { FineWood: 10, RoundLog: 10, DeerHide: 2 }, { FineWood: 5, RoundLog: 5, DeerHide: 2 }, 'BowFineWood'),
  workbenchRecipe(1, { LeatherScraps: 10, Coal: 4 }, {}, 'HelmetOdin'),
  workbenchRecipe(1, { LeatherScraps: 10, Coal: 4 }, {}, 'CapeOdin'),
  workbenchRecipe(1, { FineWood: 5, Resin: 2 }, {}, 'Tankard'),
  workbenchRecipe(1, { FineWood: 4, TrophyDeer: 1, Resin: 2 }, {}, 'TankardOdin'),
  workbenchRecipe(1, { Bronze: 2, TrollHide: 2, Iron: 2 }, {}, 'TankardAnniversary'),
  workbenchRecipe(1, { Silver: 1, Wisp: 1 }, {}, 'Demister'),
  workbenchRecipe(1, { Dandelion: 10 }, {}, 'HelmetMidsummerCrown'),
  workbenchRecipe(1, allFishes, allFishes, 'HelmetFishingHat'),
  // LEVEL 2
  workbenchRecipe(2, { DeerHide: 6 }, { DeerHide: 6, BoneFragments: 5 }, 'ArmorLeatherLegs'),
  workbenchRecipe(2, { DeerHide: 6 }, { DeerHide: 6, BoneFragments: 5 }, 'ArmorLeatherChest'),
  workbenchRecipe(2, { DeerHide: 6 }, { DeerHide: 6, BoneFragments: 5 }, 'HelmetLeather'),
  workbenchRecipe(2, { DeerHide: 4, BoneFragments: 5 }, { DeerHide: 4, BoneFragments: 5 }, 'CapeDeerHide'),
  workbenchRecipe(2, { RoundLog: 20, TrophyDeer: 5, LeatherScraps: 2 }, { RoundLog: 5, TrophyDeer: 2, LeatherScraps: 1, BoneFragments: 10 }, 'SledgeStagbreaker'),
  workbenchRecipe(2, { TrollHide: 5 }, { TrollHide: 2 }, 'ArmorTrollLeatherLegs'),
  workbenchRecipe(2, { TrollHide: 5 }, { TrollHide: 2 }, 'ArmorTrollLeatherChest'),
  workbenchRecipe(2, { TrollHide: 5, BoneFragments: 3 }, { TrollHide: 2, BoneFragments: 1 }, 'HelmetTrollLeather'),
  workbenchRecipe(2, { TrollHide: 10, BoneFragments: 10 }, { TrollHide: 5, BoneFragments: 5 }, 'CapeTrollHide'),
  workbenchRecipe(2, { Root: 10, ElderBark: 10, DeerHide: 2 }, { Root: 2, ElderBark: 5 }, 'ArmorRootLegs'),
  workbenchRecipe(2, { Root: 10, ElderBark: 10, DeerHide: 2 }, { Root: 2, ElderBark: 5 }, 'ArmorRootChest'),
  workbenchRecipe(2, { Root: 10, ElderBark: 10, LeatherScraps: 4 }, { Root: 2, ElderBark: 5 }, 'HelmetRoot'),
  workbenchRecipe(2, { FineWood: 8, Chitin: 30, LeatherScraps: 3 }, {}, 'SpearChitin'),
  workbenchRecipe(2, { FineWood: 8, Chitin: 30, LeatherScraps: 3 }, {}, 'KnifeChitin'),
  workbenchRecipe(2, { FineWood: 4, Chitin: 20, LeatherScraps: 2 }, { Chitin: 10 }, 'CapeLinen'),
  workbenchRecipe(2, { LoxPelt: 6, Silver: 2 }, { LoxPelt: 2 }, 'CapeLox'),
  workbenchRecipe(2, { WolfHairBundle: 20, WolfPelt: 5, LeatherScraps: 10 }, { WolfHairBundle: 5, WolfPelt: 3, LeatherScraps: 4 }, 'ArmorFenringLegs'),
  workbenchRecipe(2, { WolfHairBundle: 20, WolfPelt: 5, LeatherScraps: 10 }, { WolfHairBundle: 5, WolfPelt: 3, LeatherScraps: 4 }, 'ArmorFenringChest'),
  workbenchRecipe(2, { WolfHairBundle: 20, WolfPelt: 2, TrophyCultist: 1 }, { WolfHairBundle: 5, WolfPelt: 4 }, 'ArmorFenringChest'),
  // ARROWS
  workbenchRecipe(1, { Wood: 8 }, {}, 'ArrowWood', 20),
  workbenchRecipe(1, { Wood: 8, Resin: 2, Feathers: 2 }, {}, 'ArrowFire', 20),
  workbenchRecipe(1, { Wood: 8, Flint: 2, Feathers: 2 }, {}, 'ArrowFlint', 20),
  workbenchRecipe(3, { Wood: 8, Obsidian: 4, Feathers: 2 }, {}, 'ArrowObsidian', 20),
  workbenchRecipe(3, { Wood: 8, Obsidian: 4, Feathers: 2, Ooze: 2 }, {}, 'ArrowPoison', 20),
  workbenchRecipe(4, { Wood: 8, Obsidian: 4, Feathers: 2, FreezeGland: 1 }, {}, 'ArrowFrost', 20),
  workbenchRecipe(4, { Needle: 4, Feathers: 2 }, {}, 'ArrowNeedle', 20),
  workbenchRecipe(1, { LeatherScraps: 5, Ooze: 10, Resin: 3 }, {}, 'BombOoze', 5),
  workbenchRecipe(1, { Sap: 1, Bilebag: 1, Resin: 3 }, {}, 'BombBile', 3),
  // LEVEL 3
  workbenchRecipe(3, { Wood: 10, BoneFragments: 10, TrophySkeleton: 3 }, { Wood: 5, BoneFragments: 5 }, 'ShieldBoneTower'),
  // KILN
  genericRecipe('charcoal_kiln', 1, KILN_TIME, { Wood: 1 }, {}, 'Coal'),
  genericRecipe('charcoal_kiln', 1, KILN_TIME, { FineWood: 1 }, {}, 'Coal'),
  genericRecipe('charcoal_kiln', 1, KILN_TIME, { RoundLog: 1 }, {}, 'Coal'),
  genericRecipe('charcoal_kiln', 1, KILN_TIME, { ElderBark: 1 }, {}, 'Coal'),
  // COOKING STATION
  genericRecipe('piece_cookingstation', 1, 25, { RawMeat: 1 }, {}, 'CookedMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { NeckTail: 1 }, {}, 'NeckTailGrilled'),
  genericRecipe('piece_cookingstation', 1, 25, { FishRaw: 1 }, {}, 'FishCooked'),
  genericRecipe('piece_cookingstation', 1, 25, { DeerMeat: 1 }, {}, 'CookedDeerMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { WolfMeat: 1 }, {}, 'CookedWolfMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { HareMeat: 1 }, {}, 'CookedHareMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { ChickenMeat: 1 }, {}, 'CookedChickenMeat'),
  // IRON COOKING STATION
  genericRecipe('piece_cookingstation_iron', 1, 25, { RawMeat: 1 }, {}, 'CookedMeat'),
  genericRecipe('piece_cookingstation_iron', 1, 25, { NeckTail: 1 }, {}, 'NeckTailGrilled'),
  genericRecipe('piece_cookingstation_iron', 1, 25, { FishRaw: 1 }, {}, 'FishCooked'),
  genericRecipe('piece_cookingstation_iron', 1, 25, { DeerMeat: 1 }, {}, 'CookedDeerMeat'),
  genericRecipe('piece_cookingstation_iron', 1, 60, { SerpentMeat: 1 }, {}, 'SerpentMeatCooked'),
  genericRecipe('piece_cookingstation_iron', 1, 60, { LoxMeat: 1 }, {}, 'CookedLoxMeat'),
  genericRecipe('piece_cookingstation_iron', 1, 60, { BugMeat: 1 }, {}, 'CookedBugMeat'),
  genericRecipe('piece_cookingstation_iron', 1, 25, { HareMeat: 1 }, {}, 'CookedHareMeat'),
  genericRecipe('piece_cookingstation_iron', 1, 25, { ChickenMeat: 1 }, {}, 'CookedChickenMeat'),
  // CAULDRON
  cauldronRecipe(1, { RawMeat: 1, Honey: 1 }, 'BoarJerky', 2),
  cauldronRecipe(1, { Raspberry: 8, Blueberries: 6 }, 'QueensJam', 4),
  cauldronRecipe(1, { Mushroom: 1, Carrot: 3 }, 'CarrotSoup'),
  cauldronRecipe(1, { CookedDeerMeat: 1, Blueberries: 1, Carrot: 1 }, 'DeerStew'),
  cauldronRecipe(1, { RawMeat: 1, NeckTail: 1, Carrot: 1 }, 'MinceMeatSauce'),
  cauldronRecipe(1, allFishes, 'FishRaw', 1, true),
  // LEVEL 2
  cauldronRecipe(2, { RawMeat: 1, Turnip: 3 }, 'TurnipStew'),
  cauldronRecipe(2, { Bloodbag: 1, Honey: 1, Turnip: 1 }, 'BlackSoup'),
  cauldronRecipe(2, { Ooze: 1, Raspberry: 2, Blueberries: 2 }, 'ShocklateSmoothie'),
  cauldronRecipe(2, { Entrails: 2, RawMeat: 1, Thistle: 4 }, 'Sausages', 4),
  cauldronRecipe(2, { Mushroom: 1, SerpentMeatCooked: 1, Honey: 2 }, 'SerpentStew'),
  // LEVEL 3
  cauldronRecipe(3, { WolfMeat: 1, Mushroom: 2, Onion: 1 }, 'WolfMeatSkewer'),
  cauldronRecipe(3, { WolfMeat: 1, Honey: 1 }, 'WolfJerky', 2),
  cauldronRecipe(3, { GreydwarfEye: 3, FreezeGland: 1 }, 'Eyescream'),
  cauldronRecipe(3, { Onion: 3 }, 'OnionSoup'),
  cauldronRecipe(3, { MushroomJotunPuffs: 3, Onion: 3, Cloudberry: 3 }, 'Salad', 3),
  // LEVEL 4
  cauldronRecipe(4, { Bloodbag: 2, BarleyFlour: 4, Thistle: 2 }, 'BloodPudding'),
  cauldronRecipe(4, { BarleyFlour: 10 }, 'BreadDough', 2),
  cauldronRecipe(4, { FishCooked: 2, BarleyFlour: 4 }, 'FishWraps'),
  cauldronRecipe(4, { Cloudberry: 2, LoxMeat: 2, BarleyFlour: 4 }, 'LoxPieUncooked'),
  // LEVEL 5
  cauldronRecipe(5, { Sap: 4, Barley: 3, RoyalJelly: 2 }, 'YggdrasilPorridge'),
  cauldronRecipe(5, { BugMeat: 2, MushroomMagecap: 2, RoyalJelly: 2 }, 'SeekerAspic', 2),
  cauldronRecipe(5, { ChickenMeat: 1, Honey: 3, MushroomJotunPuffs: 2 }, 'HoneyGlazedChickenUncooked'),
  cauldronRecipe(5, { ChickenEgg: 3, MushroomJotunPuffs: 3 }, 'MushroomOmelette'),
  cauldronRecipe(5, { MushroomMagecap: 3, GiantBloodSack: 1, Turnip: 2 }, 'MagicallyStuffedShroomUncooked'),
  cauldronRecipe(5, { Fish9: 1, BreadDough: 2 }, 'FishAndBreadUncooked'),
  cauldronRecipe(5, { BugMeat: 1, LoxMeat: 1, HareMeat: 2 }, 'MeatPlatterUncooked'),
  // BAITS
  cauldronRecipe(1, { FishingBait: 20, TrophyFrostTroll: 1 }, 'FishingBaitForest', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophySerpent: 1 }, 'FishingBaitOcean', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyFenring: 1 }, 'FishingBaitCave', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyAbomination: 1 }, 'FishingBaitSwamp', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyGoblin: 1 }, 'FishingBaitPlains', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyLox: 1 }, 'FishingBaitMistlands', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophySutrling: 1 }, 'FishingBaitAshlands', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyHatchling: 1 }, 'FishingBaitDeepNorth', 20),
  // FERMENTER
  ...potionRecipe(
    1, { Honey: 10, Blueberries: 5, Raspberry: 10, Dandelion: 1 },
    'MeadBaseHealthMinor', 'MeadHealthMinor'
  ),
  ...potionRecipe(
    1, { Honey: 10, Bloodbag: 4, Raspberry: 10, Dandelion: 1 },
    'MeadBaseHealthMedium', 'MeadHealthMedium'
  ),
  ...potionRecipe(
    1, { Honey: 10, GiantBloodSack: 4, RoyalJelly: 5 },
    'MeadBaseHealthMajor', 'MeadHealthMajor'
  ),
  ...potionRecipe(
    1, { Honey: 10, Raspberry: 10, MushroomYellow: 10 },
    'MeadBaseStaminaMinor', 'MeadStaminaMinor'
  ),
  ...potionRecipe(
    1, { Honey: 10, Blueberries: 5, Raspberry: 10 },
    'MeadBaseTasty', 'MeadTasty'
  ),
  ...potionRecipe(
    1, { Honey: 10, Sap: 5, MushroomJotunPuffs: 2, MushroomMagecap: 5 },
    'MeadBaseEitrMinor', 'MeadEitrMinor'
  ),
  ...potionRecipe(
    1, { Honey: 10, Thistle: 5, Coal: 10, NeckTail: 1 },
    'MeadBasePoisonResist', 'MeadPoisonResist'
  ),
  ...potionRecipe(
    1, { Honey: 10, Thistle: 5, Bloodbag: 2, GreydwarfEye: 1 },
    'MeadBaseFrostResist', 'MeadFrostResist'
  ),
  ...potionRecipe(
    1, { Honey: 10, Cloudberry: 10, MushroomYellow: 10 },
    'MeadBaseStaminaMedium', 'MeadStaminaMedium'
  ),
  ...potionRecipe(
    1, { Sap: 10, Cloudberry: 10, MushroomJotunPuffs: 10 },
    'MeadBaseStaminaLingering', 'MeadStaminaLingering'
  ),
  ...potionRecipe(
    1, { Barley: 10, Cloudberry: 10 },
    'BarleyWineBase', 'BarleyWine'
  ),
  // SMELTER
  smelterRecipe('smelter', 'CopperOre', 'Copper'),
  smelterRecipe('smelter', 'CopperScrap', 'Copper'),
  smelterRecipe('smelter', 'TinOre', 'Tin'),
  smelterRecipe('smelter', 'IronScrap', 'Iron'),
  smelterRecipe('smelter', 'IronOre', 'Iron'),
  smelterRecipe('smelter', 'SilverOre', 'Silver'),
  // BLASTFURNACE
  smelterRecipe('blastfurnace', 'BlackMetalScrap', 'BlackMetal'),
  smelterRecipe('blastfurnace', 'FlametalOre', 'Flametal'),
  genericRecipe('eitrrefinery', 1, 40, { Sap: 1, Softtissue: 1 }, {}, 'Eitr'),
  // FORGE: BRONZE
  forgeRecipe(1, { Wood: 2, Copper: 8 }, { GreydwarfEye: 8, Copper: 4 }, 'KnifeCopper'),
  forgeRecipe(1, { Copper: 2, Tin: 1 }, {}, 'Bronze'),
  forgeRecipe(1, { RoundLog: 5, Bronze: 5 }, { RoundLog: 1, Bronze: 1 }, 'Cultivator'),
  forgeRecipe(1, { Wood: 2, Tin: 4 }, {}, 'KnifeButcher'),
  forgeRecipe(1, { Bronze: 1 }, {}, 'BronzeNails', 20),
  forgeRecipe(1, { Wood: 10, Bronze: 8, LeatherScraps: 2 }, { Bronze: 4 }, 'AtgeirBronze'),
  forgeRecipe(1, { Wood: 4, Bronze: 8, LeatherScraps: 2 }, { Bronze: 4, LeatherScraps: 1 }, 'AxeBronze'),
  forgeRecipe(1, { Wood: 4, Bronze: 8, LeatherScraps: 3 }, { Bronze: 4 }, 'MaceBronze'),
  forgeRecipe(1, { Wood: 5, Bronze: 6, DeerHide: 2 }, { Wood: 3, Bronze: 4, DeerHide: 1 }, 'SpearBronze'),
  forgeRecipe(1, { Wood: 2, Bronze: 8, LeatherScraps: 2 }, { Wood: 1, Bronze: 4, LeatherScraps: 1 }, 'SwordBronze'),
  forgeRecipe(1, { RoundLog: 3, Bronze: 10 }, { RoundLog: 1, Bronze: 5 }, 'PickaxeBronze'),
  forgeRecipe(1, { Wood: 4, Bronze: 10 }, { Wood: 1, Bronze: 5 }, 'ShieldBronzeBuckler'),
  forgeRecipe(1, { Bronze: 5, DeerHide: 2 }, { Bronze: 3 }, 'ArmorBronzeLegs'),
  forgeRecipe(1, { Bronze: 5, DeerHide: 2 }, { Bronze: 3 }, 'ArmorBronzeChest'),
  forgeRecipe(1, { Bronze: 5, DeerHide: 2 }, { Bronze: 3 }, 'HelmetBronze'),
  // IRON
  forgeRecipe(1, { Iron: 1 }, {}, 'IronNails', 10),
  forgeRecipe(2, { ElderBark: 30, Iron: 35, LeatherScraps: 4 }, { ElderBark: 5, Iron: 15 }, 'Battleaxe'),
  forgeRecipe(2, { Wood: 4, Iron: 20, LeatherScraps: 2 }, { Iron: 10, LeatherScraps: 1 }, 'AxeIron'),
  forgeRecipe(2, { Wood: 2, Iron: 20, LeatherScraps: 3 }, { Wood: 1, Iron: 10, LeatherScraps: 2 }, 'SwordIron'),
  forgeRecipe(2, { Wood: 4, Iron: 20, LeatherScraps: 3 }, { Iron: 10 }, 'MaceIron'),
  forgeRecipe(2, { ElderBark: 10, Iron: 30, YmirRemains: 4, TrophyDraugrElite: 1 }, { ElderBark: 2, Iron: 15, YmirRemains: 2 }, 'SledgeIron'),
  forgeRecipe(2, { TrollHide: 4, Iron: 10, ElderBark: 10, }, { TrollHide: 1, Iron: 5, ElderBark: 5 }, 'SpearElderbark'),
  forgeRecipe(2, { Wood: 10, Iron: 30, LeatherScraps: 2 }, { Iron: 15, LeatherScraps: 1 }, 'AtgeirIron'),
  forgeRecipe(1, { FineWood: 10, Iron: 20, Feathers: 10, DeerHide: 2 }, { FineWood: 5, Iron: 10, Feathers: 5, DeerHide: 2 }, 'BowHuntsman'),
  forgeRecipe(2, { RoundLog: 3, Iron: 20 }, { RoundLog: 1, Iron: 10 }, 'PickaxeIron'),
  forgeRecipe(2, { FineWood: 10, Iron: 8 }, { FineWood: 10, Iron: 4 }, 'ShieldBanded'),
  forgeRecipe(2, { FineWood: 15, Iron: 10 }, { FineWood: 10, Iron: 5 }, 'ShieldIronTower'),
  forgeRecipe(2, { FineWood: 15, Iron: 10 }, { FineWood: 10, Iron: 5 }, 'ShieldIronBuckler'),
  forgeRecipe(2, { Iron: 10, ElderBark: 4 }, { Iron: 5, ElderBark: 1 }, 'ArmorIronLegs'),
  forgeRecipe(2, { Iron: 20, DeerHide: 2 }, { Iron: 5 }, 'ArmorIronChest'),
  forgeRecipe(1, { Iron: 20, DeerHide: 2 }, { Iron: 5 }, 'HelmetIron'),
  forgeRecipe(2, { Silver: 20, WolfPelt: 5, WolfFang: 4 }, { Silver: 5, WolfPelt: 2, WolfFang: 1 }, 'ArmorWolfLegs'),
  forgeRecipe(2, { Silver: 20, WolfPelt: 5, Chain: 1 }, { Silver: 5, WolfPelt: 2 }, 'ArmorWolfChest'),
  forgeRecipe(1, { Silver: 20, WolfPelt: 2, TrophyHatchling: 2 }, { Silver: 5 }, 'HelmetDrake'),
  forgeRecipe(2, { Silver: 4, WolfPelt: 6, TrophyWolf: 1 }, { Silver: 2, WolfPelt: 4 }, 'CapeWolf'),
  forgeRecipe(3, { FineWood: 10, Iron: 4, SerpentScale: 8 }, { FineWood: 10, Iron: 2, SerpentScale: 4 }, 'ShieldSerpentscale'),
  // SILVER
  forgeRecipe(3, { WolfHairBundle: 10, WolfClaw: 6, Silver: 10 }, { WolfHairBundle: 1, WolfClaw: 1, Silver: 1 }, 'FistFenrirClaw'),
  forgeRecipe(3, { ElderBark: 40, Silver: 30, Crystal: 10 }, { ElderBark: 5, Silver: 15 }, 'BattleaxeCrystal'),
  forgeRecipe(3, { Wood: 2, Silver: 40, LeatherScraps: 3, Iron: 5 }, { Wood: 1, Silver: 20, LeatherScraps: 1, Iron: 3 }, 'SwordSilver'),
  forgeRecipe(3, { ElderBark: 10, WolfFang: 4, Silver: 2, LeatherScraps: 2 }, { ElderBark: 5, WolfFang: 2, Silver: 1, LeatherScraps: 1 }, 'SpearWolfFang'),
  forgeRecipe(3, { ElderBark: 10, Silver: 30, YmirRemains: 5, FreezeGland: 5 }, { Silver: 15 }, 'MaceSilver'),
  forgeRecipe(3, { Wood: 2, Silver: 10, LeatherScraps: 3, Iron: 2 }, { Wood: 1, Silver: 5, LeatherScraps: 1, Iron: 1 }, 'KnifeSilver'),
  forgeRecipe(2, { ElderBark: 10, Silver: 20, DeerHide: 2, Guck: 10, }, { ElderBark: 5, Silver: 10, DeerHide: 2, Guck: 2 }, 'BowDraugrFang'),
  forgeRecipe(3, { FineWood: 10, Silver: 8 }, { FineWood: 10, Silver: 4 }, 'ShieldSilver'),
  forgeRecipe(2, { Iron: 10, LinenThread: 20 }, { Iron: 3 }, 'ArmorPaddedGreaves'),
  forgeRecipe(2, { Iron: 10, LinenThread: 20 }, { Iron: 3 }, 'ArmorPaddedCuirass'),
  forgeRecipe(1, { Iron: 10, LinenThread: 15 }, { Iron: 5 }, 'HelmetPadded'),
  forgeRecipe(1, { LeatherScraps: 10, LinenThread: 20, BlackMetal: 15 }, {}, 'SaddleLox'),
  // BLACK METAL
  forgeRecipe(2, { YggdrasilWood: 3, BlackMetal: 25 }, { YggdrasilWood: 1, BlackMetal: 15 }, 'PickaxeBlackMetal'),
  forgeRecipe(4, { FineWood: 10, BlackMetal: 30, LinenThread: 5 }, { BlackMetal: 15, LinenThread: 5 }, 'AtgeirBlackmetal'),
  forgeRecipe(4, { FineWood: 6, BlackMetal: 20, LinenThread: 5 }, { BlackMetal: 10, LinenThread: 5 }, 'AxeBlackMetal'),
  forgeRecipe(4, { FineWood: 4, BlackMetal: 10, LinenThread: 5 }, { BlackMetal: 4, LinenThread: 5 }, 'KnifeBlackMetal'),
  forgeRecipe(4, { FineWood: 2, BlackMetal: 20, LinenThread: 5 }, { BlackMetal: 10, LinenThread: 5 }, 'SwordBlackmetal'),
  forgeRecipe(4, { FineWood: 5, Iron: 20, Needle: 5, LinenThread: 10 }, { Iron: 2, LinenThread: 2 }, 'MaceNeedle'),
  forgeRecipe(3, { FineWood: 10, BlackMetal: 8, Chain: 5 }, { FineWood: 10, BlackMetal: 4, Chain: 2 }, 'ShieldBlackmetal'),
  forgeRecipe(3, { FineWood: 15, BlackMetal: 10, Chain: 7 }, { FineWood: 15, BlackMetal: 6, Chain: 3 }, 'ShieldBlackmetalTower'),
  // EXTRA
  forgeRecipe(2, { FineWood: 2, Flametal: 20, SurtlingCore: 20, LeatherScraps: 3 }, { Flametal: 10, SurtlingCore: 10, LeatherScraps: 2 }, 'SwordIronFire'),
  forgeRecipe(2, { FineWood: 10, Iron: 6 }, { FineWood: 10, Iron: 3 }, 'ShieldIronSquare'),
  // ARROWS
  forgeRecipe(1, { Wood: 8, Bronze: 1, Feathers: 2 }, {}, 'ArrowBronze', 20),
  forgeRecipe(2, { Wood: 8, Iron: 1, Feathers: 2 }, {}, 'ArrowIron', 20),
  forgeRecipe(3, { Wood: 8, Silver: 1, Feathers: 2 }, {}, 'ArrowSilver', 20),
  // ARTISAN STATION
  genericRecipe('piece_artisanstation', 1, 3, { Eitr: 1, Iron: 3 }, {}, 'MechanicalSpring'),
  genericRecipe('piece_artisanstation', 1, 3, { RoundLog: 5, Feathers: 2 }, {}, 'TurretBoltWood', 5),
  genericRecipe('piece_artisanstation', 1, 3, { Wood: 10, BlackMetal: 1 }, {}, 'TurretBolt', 5),
  // BLACK FORGE
  blackForgeRecipe(1, { Bronze: 2, SurtlingCore: 1, Crystal: 1 }, {}, 'Lantern'),
  blackForgeRecipe(1, { FineWood: 10, BoneFragments: 40, Eitr: 10 }, { FineWood: 5, BoneFragments: 20 }, 'BowSpineSnap'),
  blackForgeRecipe(1, { Wood: 10, Iron: 8, Root: 4 }, { Wood: 5, Iron: 4, Root: 1 }, 'CrossbowArbalest'),
  blackForgeRecipe(1, { FineWood: 4, Iron: 10, BlackMetal: 10 }, { Iron: 4, BlackMetal: 4 }, 'KnifeSkollAndHati'),
  blackForgeRecipe(1, { FineWood: 3, Iron: 15, Eitr: 10, Wisp: 3 }, { Iron: 10, Eitr: 5, Wisp: 1 }, 'SwordMistwalker'),
  blackForgeRecipe(1, { YggdrasilWood: 10, Iron: 20, Eitr: 10 }, { YggdrasilWood: 2, Iron: 15, Eitr: 2 }, 'SledgeDemolisher'),
  blackForgeRecipe(1, { Iron: 30, Bronze: 20, ScaleHide: 5 }, { Iron: 15, Bronze: 10, ScaleHide: 5 }, 'THSwordKrom'),
  blackForgeRecipe(1, { YggdrasilWood: 10, Carapace: 4, Mandible: 2 }, { YggdrasilWood: 5, Carapace: 4, Mandible: 1 }, 'SpearCarapace'),
  blackForgeRecipe(1, { Carapace: 20, ScaleHide: 3, Iron: 5, Eitr: 4 }, { Carapace: 10, ScaleHide: 1, Eitr: 2 }, 'ArmorCarapaceLegs'),
  blackForgeRecipe(1, { Carapace: 20, ScaleHide: 3, Iron: 5, Eitr: 4 }, { Carapace: 10, ScaleHide: 1, Eitr: 2 }, 'ArmorCarapaceChest'),
  blackForgeRecipe(1, { Carapace: 16, ScaleHide: 3, Mandible: 2, Eitr: 4 }, { Carapace: 8, ScaleHide: 1, Eitr: 2 }, 'HelmetCarapace'),
  blackForgeRecipe(1, { Carapace: 20, ScaleHide: 3, Eitr: 10 }, { Carapace: 10, ScaleHide: 3, Eitr: 3 }, 'ShieldCarapace'),
  blackForgeRecipe(1, { Carapace: 16, ScaleHide: 3, Eitr: 10 }, { Carapace: 8, ScaleHide: 3, Eitr: 3 }, 'ShieldCarapaceBuckler'),
  blackForgeRecipe(1, { Carapace: 4, Feathers: 2, Wood: 8 }, {}, 'ArrowCarapace', 20),
  blackForgeRecipe(1, { BoneFragments: 8, Feathers: 2 }, {}, 'BoltBone', 20),
  blackForgeRecipe(1, { Wood: 8, Iron: 1, Feathers: 2 }, {}, 'BoltIron', 20),
  blackForgeRecipe(1, { BlackMetal: 2, Wood: 8, Feathers: 2 }, {}, 'BoltBlackmetal', 20),
  blackForgeRecipe(1, { Carapace: 2, Wood: 8, Feathers: 2 }, {}, 'BoltCarapace', 20),
  // MAGE TABLE
  mageTableRecipe(1, { LinenThread: 20, Eitr: 20, Feathers: 10, ScaleHide: 5 }, { LinenThread: 2, Eitr: 2, Feathers: 2, ScaleHide: 2 }, 'ArmorMageChest'),
  mageTableRecipe(1, { LinenThread: 20, Eitr: 20, ScaleHide: 5 }, { LinenThread: 2, Eitr: 2, ScaleHide: 2 }, 'ArmorMageLegs'),
  mageTableRecipe(1, { LinenThread: 15, Eitr: 15, Iron: 2 }, { LinenThread: 2, Eitr: 1, Iron: 1 }, 'HelmetMage'),
  mageTableRecipe(1, { Feathers: 10, ScaleHide: 5, Eitr: 20 }, { Feathers: 2, ScaleHide: 5, Eitr: 3 }, 'CapeFeather'),
  mageTableRecipe(1, { YggdrasilWood: 20, GiantBloodSack: 4, Eitr: 16 }, { YggdrasilWood: 10, GiantBloodSack: 2, Eitr: 8 }, 'StaffShield'),
  mageTableRecipe(1, { BoneFragments: 10, Eitr: 16, TrophySkeleton: 4 }, { BoneFragments: 5, Eitr: 8, TrophySkeleton: 2 }, 'StaffSkeleton'),
  mageTableRecipe(1, { YggdrasilWood: 20, SurtlingCore: 4, Eitr: 16 }, { YggdrasilWood: 10, SurtlingCore: 2, Eitr: 8 }, 'StaffFireball'),
  mageTableRecipe(1, { YggdrasilWood: 20, FreezeGland: 4, Eitr: 16 }, { YggdrasilWood: 10, FreezeGland: 2, Eitr: 8 }, 'StaffIceShards'),
  mageTableRecipe(1, { Crystal: 1, Resin: 1 }, {}, 'TorchMist'), // disabled
  mageTableRecipe(1, { DvergrKeyFragment: 9 }, {}, 'DvergrKey'),
  // MISC
  genericRecipe('piece_stonecutter', 1, STONECUTTER_TIME, { Stone: 5 }, {}, 'SharpeningStone'),
  genericRecipe('piece_spinningwheel', 1, SPIN_WHEEL_TIME, { Flax: 1 }, {}, 'LinenThread'),
  genericRecipe('windmill', 1, 10, { Barley: 5 }, {}, 'BarleyFlour'),
  genericRecipe('piece_oven', 1, 50, { BreadDough: 1 }, {}, 'Bread'),
  genericRecipe('piece_oven', 1, 50, { LoxPieUncooked: 1 }, {}, 'LoxPie'),
  genericRecipe('piece_oven', 1, 50, { FishAndBreadUncooked: 1 }, {}, 'FishAndBread'),
  genericRecipe('piece_oven', 1, 50, { MeatPlatterUncooked: 1 }, {}, 'MeatPlatter'),
  genericRecipe('piece_oven', 1, 50, { HoneyGlazedChickenUncooked: 1 }, {}, 'HoneyGlazedChicken'),
  genericRecipe('piece_oven', 1, 50, { MisthareSupremeUncooked: 1 }, {}, 'MisthareSupreme'),
  genericRecipe('piece_oven', 1, 50, { MagicallyStuffedShroom: 1 }, {}, 'MagicallyStuffedShroomUncooked'),
  // TRADER
  haldorRecipe(100, 'HelmetYule'),
  haldorRecipe(620, 'HelmetDverger'),
  haldorRecipe(950, 'BeltStrength'),
  haldorRecipe(120, 'YmirRemains', { killed: 'TheElder' }), 
  haldorRecipe(350, 'FishingRod'),
  haldorRecipe(10, 'FishingBait', { number: 20 }),
  haldorRecipe(50, 'Thunderstone', { killed: 'TheElder' }),
  haldorRecipe(1500, 'ChickenEgg', { killed: 'GoblinKing' }),
  // haldorRecipe(350, 'Chisel'),
  // HILDIR
  hildirRecipe(450, 'ArmorDress2', { killed: 'Fenring_Cultist_Hildir' }),
  hildirRecipe(550, 'ArmorDress3', { killed: 'GoblinBruteBros' }),
  hildirRecipe(450, 'ArmorDress5', { killed: 'Fenring_Cultist_Hildir' }),
  hildirRecipe(550, 'ArmorDress6', { killed: 'GoblinBruteBros' }),
  hildirRecipe(450, 'ArmorDress8', { killed: 'Fenring_Cultist_Hildir' }),
  hildirRecipe(550, 'ArmorDress9', { killed: 'GoblinBruteBros' }),
  hildirRecipe(250, 'ArmorDress10'),
  hildirRecipe(450, 'ArmorTunic2', { killed: 'Fenring_Cultist_Hildir' }),
  hildirRecipe(550, 'ArmorTunic3', { killed: 'GoblinBruteBros' }),
  hildirRecipe(450, 'ArmorTunic5', { killed: 'Fenring_Cultist_Hildir' }),
  hildirRecipe(550, 'ArmorTunic6', { killed: 'GoblinBruteBros' }),
  hildirRecipe(450, 'ArmorTunic8', { killed: 'Fenring_Cultist_Hildir' }),
  hildirRecipe(550, 'ArmorTunic9', { killed: 'GoblinBruteBros' }),
  hildirRecipe(250, 'ArmorTunic10'),
  hildirRecipe(350, 'ArmorDress1', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(350, 'ArmorDress4', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(350, 'ArmorDress7', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(350, 'ArmorTunic1', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(350, 'ArmorTunic4', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(350, 'ArmorTunic7', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(200, 'HelmetHat1', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(250, 'HelmetHat2', { killed: 'Fenring_Cultist_Hildir' }),
  hildirRecipe(200, 'HelmetHat3', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(250, 'HelmetHat4', { killed: 'Fenring_Cultist_Hildir' }),
  hildirRecipe(150, 'HelmetHat5'),
  hildirRecipe(250, 'HelmetHat6', { killed: 'Fenring_Cultist_Hildir' }),
  hildirRecipe(300, 'HelmetHat7', { killed: 'GoblinBruteBros' }),
  hildirRecipe(300, 'HelmetHat8', { killed: 'GoblinBruteBros' }),
  hildirRecipe(300, 'HelmetHat9', { killed: 'GoblinBruteBros' }),
  hildirRecipe(150, 'HelmetHat10'),
  hildirRecipe(50, 'FireworksRocket_White', { killed: 'GoblinBruteBros' }),
  hildirRecipe(150, 'Sparkler'),
  hildirRecipe(75, 'Ironpit'),
  hildirRecipe(600, 'BarberKit'),
];
