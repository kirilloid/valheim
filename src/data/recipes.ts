import type { EntityId, ItemRecipe } from '../types';
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
  bogWitchRecipe,
  prepTableRecipe,
} from '../model/recipe';
import { GAME_DAY } from '../model/game';
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
  workbenchRecipe(1, { DeerHide: 6 }, { DeerHide: 6 }, '-'),
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
  workbenchRecipe(2, { WolfHairBundle: 20, WolfPelt: 2, TrophyCultist: 1 }, { WolfHairBundle: 5, WolfPelt: 4 }, 'HelmetFenring'),
  // ARROWS & BOMBS
  workbenchRecipe(1, { Wood: 8 }, {}, 'ArrowWood', 20),
  workbenchRecipe(1, { Wood: 8, Resin: 2, Feathers: 2 }, {}, 'ArrowFire', 20),
  workbenchRecipe(1, { Wood: 8, Flint: 2, Feathers: 2 }, {}, 'ArrowFlint', 20),
  workbenchRecipe(3, { Wood: 8, Obsidian: 4, Feathers: 2 }, {}, 'ArrowObsidian', 20),
  workbenchRecipe(3, { Wood: 8, Obsidian: 4, Feathers: 2, Ooze: 2 }, {}, 'ArrowPoison', 20),
  workbenchRecipe(4, { Wood: 8, Obsidian: 4, Feathers: 2, FreezeGland: 1 }, {}, 'ArrowFrost', 20),
  workbenchRecipe(4, { Needle: 4, Feathers: 2 }, {}, 'ArrowNeedle', 20),
  workbenchRecipe(1, { LeatherScraps: 5, Ooze: 10, Resin: 3 }, {}, 'BombOoze', 5),
  workbenchRecipe(1, { Sap: 1, Bilebag: 1, Resin: 3 }, {}, 'BombBile', 3),
  workbenchRecipe(1, { AskHide: 1, AskBladder: 1, ProustitePowder: 3 }, {}, 'BombLava', 5),
  workbenchRecipe(1, { AskHide: 2, SulfurStone: 2, ProustitePowder: 3 }, {}, 'BombSiege', 5),
  workbenchRecipe(1, { MushroomSmokePuff: 1, AskBladder: 1 }, {}, 'BombSmoke', 10),
  // FIREWORKS
  workbenchRecipe(1, { FireworksRocket_White: 1, Blueberries: 1 }, {}, 'FireworksRocket_Blue'),
  workbenchRecipe(1, { FireworksRocket_White: 1, GreydwarfEye: 1 }, {}, 'FireworksRocket_Cyan'),
  workbenchRecipe(1, { FireworksRocket_White: 1, Guck: 1 }, {}, 'FireworksRocket_Green'),
  workbenchRecipe(1, { FireworksRocket_White: 1, Turnip: 1 }, {}, 'FireworksRocket_Purple'),
  workbenchRecipe(1, { FireworksRocket_White: 1, Raspberry: 1 }, {}, 'FireworksRocket_Red'),
  workbenchRecipe(1, { FireworksRocket_White: 1, Dandelion: 1 }, {}, 'FireworksRocket_Yellow'),

  // LEVEL 3
  workbenchRecipe(3, { Wood: 10, BoneFragments: 10, TrophySkeleton: 3 }, { Wood: 5, BoneFragments: 5 }, 'ShieldBoneTower'),
  // KILN
  genericRecipe('charcoal_kiln', 1, KILN_TIME, { Wood: 1 }, {}, 'Coal'),
  genericRecipe('charcoal_kiln', 1, KILN_TIME, { FineWood: 1 }, {}, 'Coal'),
  genericRecipe('charcoal_kiln', 1, KILN_TIME, { RoundLog: 1 }, {}, 'Coal'),
  // genericRecipe('charcoal_kiln', 1, KILN_TIME, { ElderBark: 1 }, {}, 'Coal'),
  // COOKING STATION
  genericRecipe('piece_cookingstation', 1, 25, { RawMeat: 1 }, {}, 'CookedMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { NeckTail: 1 }, {}, 'NeckTailGrilled'),
  genericRecipe('piece_cookingstation', 1, 25, { FishRaw: 1 }, {}, 'FishCooked'),
  genericRecipe('piece_cookingstation', 1, 25, { DeerMeat: 1 }, {}, 'CookedDeerMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { WolfMeat: 1 }, {}, 'CookedWolfMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { HareMeat: 1 }, {}, 'CookedHareMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { ChickenMeat: 1 }, {}, 'CookedChickenMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { VoltureMeat: 1 }, {}, 'CookedVoltureMeat'),
  genericRecipe('piece_cookingstation', 1, 25, { AsksvinMeat: 1 }, {}, 'CookedAsksvinMeat'),
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
  genericRecipe('piece_cookingstation_iron', 1, 25, { AsksvinMeat: 1 }, {}, 'CookedAsksvinMeat'),
  genericRecipe('piece_cookingstation_iron', 1, 25, { VoltureMeat: 1 }, {}, 'CookedVoltureMeat'),
  genericRecipe('piece_cookingstation_iron', 1, 60, { BoneMawSerpentMeat: 1 }, {}, 'CookedBoneMawSerpentMeat'),
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
  prepTableRecipe(1, { Cloudberry: 2, LoxMeat: 2, BarleyFlour: 4 }, 'LoxPieUncooked'),
  // LEVEL 5
  cauldronRecipe(5, { Sap: 4, Barley: 3, RoyalJelly: 2 }, 'YggdrasilPorridge'),
  cauldronRecipe(5, { BugMeat: 2, MushroomMagecap: 2, RoyalJelly: 2 }, 'SeekerAspic', 2),
  prepTableRecipe(1, { ChickenMeat: 1, Honey: 3, MushroomJotunPuffs: 2 }, 'HoneyGlazedChickenUncooked'),
  cauldronRecipe(5, { ChickenEgg: 3, MushroomJotunPuffs: 3 }, 'MushroomOmelette'),
  prepTableRecipe(1, { MushroomMagecap: 3, GiantBloodSack: 1, Turnip: 2 }, 'MagicallyStuffedShroomUncooked'),
  prepTableRecipe(1, { Fish9: 1, BreadDough: 2 }, 'FishAndBreadUncooked'),
  prepTableRecipe(1, { BugMeat: 1, LoxMeat: 1, HareMeat: 2 }, 'MeatPlatterUncooked'),
  prepTableRecipe(1, { HareMeat: 1, MushroomJotunPuffs: 3, Carrot: 2 }, 'MisthareSupremeUncooked'),
  // LEVEL 6
  cauldronRecipe(5, { AsksvinMeat: 1, Vineberry: 2, MushroomSmokePuff: 1 }, 'FierySvinstew'),
  cauldronRecipe(6, { Sap: 3, MushroomMagecap: 2, Fiddleheadfern: 2, MushroomSmokePuff: 2 }, 'MarinatedGreens'),
  cauldronRecipe(6, { AsksvinMeat: 1, VoltureMeat: 1, Fiddleheadfern: 1 }, 'MashedMeat'),
  prepTableRecipe(1, { AsksvinMeat: 2, Vineberry: 2, BarleyFlour: 4 }, 'PiquantPieUncooked'),
  prepTableRecipe(1, { Vineberry: 2, VoltureEgg: 1, BarleyFlour: 4 }, 'RoastedCrustPieUncooked'),
  cauldronRecipe(6, { MushroomJotunPuffs: 3, Onion: 3, Fiddleheadfern: 3 }, 'ScorchingMedley', 3),
  cauldronRecipe(5, { Sap: 3, Fiddleheadfern: 2, Vineberry: 2 }, 'SizzlingBerryBroth'),
  cauldronRecipe(6, { Sap: 4, Vineberry: 2, MushroomSmokePuff: 2, MushroomMagecap: 2 }, 'SparklingShroomshake'),
  cauldronRecipe(5, { Vineberry: 3, Honey: 1, Fiddleheadfern: 1 }, 'SpicyMarmalade'),
  // BAITS
  cauldronRecipe(1, { FishingBait: 20, TrophyFrostTroll: 1 }, 'FishingBaitForest', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophySerpent: 1 }, 'FishingBaitOcean', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyFenring: 1 }, 'FishingBaitCave', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyAbomination: 1 }, 'FishingBaitSwamp', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyGoblin: 1 }, 'FishingBaitPlains', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyLox: 1 }, 'FishingBaitMistlands', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyCharredMelee: 1 }, 'FishingBaitAshlands', 20),
  cauldronRecipe(1, { FishingBait: 20, TrophyHatchling: 1 }, 'FishingBaitDeepNorth', 20),
  // prep table
  prepTableRecipe(1, { CookedDeerMeat: 2, CookedMeat: 5, Dandelion: 4, SpiceForests: 1 }, 'FeastMeadows', 10),
  prepTableRecipe(1, { DeerStew: 3, Thistle: 5, QueensJam: 4, SpiceForests: 1 }, 'FeastBlackforest', 10),
  prepTableRecipe(1, { FishCooked: 5, Thistle: 4, SerpentMeatCooked: 2, SpiceOceans: 1 }, 'FeastOceans', 10),
  prepTableRecipe(1, { Sausages: 8, Bloodbag: 4, TurnipStew: 2, SpiceForests: 1 }, 'FeastSwamps', 10),
  prepTableRecipe(1, { WolfMeatSkewer: 2, Carrot: 4, SpiceMountains: 1 }, 'FeastMountains', 10),
  prepTableRecipe(1, { Bread: 3, LoxPie: 2, Cloudberry: 5, SpicePlains: 1 }, 'FeastPlains', 10),
  prepTableRecipe(1, { MisthareSupreme: 1, CookedBugMeat: 3, YggdrasilPorridge: 1, SpiceMistlands: 1 }, 'FeastMistlands', 10),
  prepTableRecipe(1, { CookedAsksvinMeat: 3, Vineberry: 5, ScorchingMedley: 2, SpiceAshlands: 1 }, 'FeastAshlands', 10),
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
  ...potionRecipe(
    1, { Cloudberry: 10, Fish7: 3, FragrantBundle: 1 },
    'MeadBaseBugRepellent', 'MeadBugRepellent'
  ),
  ...potionRecipe(
    1, { Mushroom: 10, MushroomYellow: 10, MushroomBzerker: 1 },
    'MeadBaseBzerker', 'MeadBzerker'
  ),
  ...potionRecipe(
    1, { Honey: 10, Blueberries: 10, CuredSquirrelHamstring: 1 },
    'MeadBaseHasty', 'MeadHasty'
  ),
  ...potionRecipe(
    1, { TrophyHare: 1, Feathers: 10, MushroomMagecap: 5 },
    'MeadBaseLightfoot', 'MeadLightfoot'
  ),
  ...potionRecipe(
    1, { Fish5: 2, Honey: 10, PowderedDragonEgg: 1 },
    'MeadBaseStrength', 'MeadStrength'
  ),
  ...potionRecipe(
    1, { Dandelion: 10, Fish1: 2, FreshSeaweed: 1 },
    'MeadBaseSwimmer', 'MeadSwimmer'
  ),
  ...potionRecipe(
    1, { Onion: 5, Carrot: 10, PungentPebbles: 1 },
    'MeadBaseTamer', 'MeadTamer'
  ),
  ...potionRecipe(
    1, { Sap: 10, Vineberry: 10, MushroomMagecap: 10 },
    'MeadBaseEitrLingering', 'MeadEitrLingering'
  ),
  ...potionRecipe(
    1, { Sap: 10, Vineberry: 10, MushroomSmokePuff: 10 },
    'MeadBaseHealthLingering', 'MeadHealthLingering'
  ),
  // SMELTER
  smelterRecipe('smelter', 'CopperOre', 'Copper'),
  smelterRecipe('smelter', 'CopperScrap', 'Copper'),
  smelterRecipe('smelter', 'TinOre', 'Tin'),
  smelterRecipe('smelter', 'BronzeScrap', 'Bronze'),
  smelterRecipe('smelter', 'IronScrap', 'Iron'),
  smelterRecipe('smelter', 'IronOre', 'Iron'),
  smelterRecipe('smelter', 'SilverOre', 'Silver'),
  // BLASTFURNACE
  smelterRecipe('blastfurnace', 'BlackMetalScrap', 'BlackMetal'),
  smelterRecipe('blastfurnace', 'FlametalOreNew', 'FlametalNew'),
  // smelterRecipe('blastfurnace', 'FlametalOre', 'Flametal'),
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
  forgeRecipe(2, { ScytheHandle: 1, Silver: 6 }, { Silver: 5 }, 'Scythe'),
  // BLACK METAL
  forgeRecipe(2, { YggdrasilWood: 3, BlackMetal: 25 }, { YggdrasilWood: 1, BlackMetal: 15 }, 'PickaxeBlackMetal'),
  forgeRecipe(4, { FineWood: 10, BlackMetal: 30, LinenThread: 5 }, { BlackMetal: 15, LinenThread: 5 }, 'AtgeirBlackmetal'),
  forgeRecipe(4, { FineWood: 6, BlackMetal: 20, LinenThread: 5 }, { BlackMetal: 10, LinenThread: 5 }, 'AxeBlackMetal'),
  forgeRecipe(4, { FineWood: 4, BlackMetal: 10, LinenThread: 5 }, { BlackMetal: 4, LinenThread: 5 }, 'KnifeBlackMetal'),
  forgeRecipe(4, { FineWood: 2, BlackMetal: 20, LinenThread: 5 }, { BlackMetal: 10, LinenThread: 5 }, 'SwordBlackmetal'),
  forgeRecipe(4, { FineWood: 5, Iron: 20, Needle: 5, LinenThread: 10 }, { Iron: 2, LinenThread: 2 }, 'MaceNeedle'),
  forgeRecipe(3, { FineWood: 10, BlackMetal: 8, Chain: 5 }, { FineWood: 10, BlackMetal: 4, Chain: 2 }, 'ShieldBlackmetal'),
  forgeRecipe(3, { FineWood: 15, BlackMetal: 10, Chain: 7 }, { FineWood: 15, BlackMetal: 6, Chain: 3 }, 'ShieldBlackmetalTower'),
  forgeRecipe(1, { LeatherScraps: 10, LinenThread: 20, BlackMetal: 15 }, {}, 'SaddleLox'),
  // EXTRA
  forgeRecipe(2, { FineWood: 2, Flametal: 20, SurtlingCore: 20, LeatherScraps: 3 }, { Flametal: 10, SurtlingCore: 10, LeatherScraps: 2 }, 'SwordIronFire'),
  forgeRecipe(2, { FineWood: 10, Iron: 6 }, { FineWood: 10, Iron: 3 }, 'ShieldIronSquare'),
  // ARROWS
  forgeRecipe(1, { Wood: 8, Bronze: 1, Feathers: 2 }, {}, 'ArrowBronze', 20),
  forgeRecipe(2, { Wood: 8, Iron: 1, Feathers: 2 }, {}, 'ArrowIron', 20),
  forgeRecipe(3, { Wood: 8, Silver: 1, Feathers: 2 }, {}, 'ArrowSilver', 20),
  // ARTISAN STATION
  genericRecipe('piece_artisanstation', 1, 3, { Eitr: 1, Iron: 3 }, {}, 'MechanicalSpring'),
  genericRecipe('piece_artisanstation', 1, 3, { RoundLog: 5, Feathers: 2 }, {}, 'TurretBoltWood', 20),
  genericRecipe('piece_artisanstation', 1, 3, { Wood: 10, BlackMetal: 1 }, {}, 'TurretBolt', 20),
  genericRecipe('piece_artisanstation', 1, 3, { Blackwood: 10, FlametalNew: 1 }, {}, 'TurretBoltFlametal', 20),
  genericRecipe('piece_artisanstation', 2, 3, { BlackMarble: 5 }, {}, 'CeramicPlate', 5),
  genericRecipe('piece_artisanstation', 2, 3, { BlackCore: 1, SurtlingCore: 1, CeramicPlate: 5 }, {}, 'ShieldCore'),

  // BLACK FORGE
  blackForgeRecipe(1, { Bronze: 2, SurtlingCore: 1, Crystal: 1 }, {}, 'Lantern'),
  blackForgeRecipe(1, { YggdrasilWood: 10, Eitr: 15, Silver: 5, Mandible: 2 }, { Eitr: 15, Silver: 5, Mandible: 2 }, 'AtgeirHimminAfl'),
  blackForgeRecipe(1, { YggdrasilWood: 5, Iron: 15, Bilebag: 3, Eitr: 10 }, { Iron: 10, Bilebag: 1, Eitr: 1 }, 'AxeJotunBane'),
  blackForgeRecipe(1, { BellFragment: 3 }, {}, 'Bell'),
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
  blackForgeRecipe(2, { FlametalNew: 6, LinenThread: 20, MorgenSinew: 4 }, {}, 'SaddleAsksvin'),
  // ASH
  // BowAshlands
  blackForgeRecipe(3, { Blackwood: 10, CharredBone: 16, FlametalNew: 5, BonemawSerpentTooth: 5 },
                      { Blackwood: 5, CharredBone: 10, FlametalNew: 5, BonemawSerpentTooth: 5 }, 'BowAshlands'),
  blackForgeRecipe(4, { BowAshlands: 1, FlametalNew: 5, GemstoneRed: 1 }, { FlametalNew: 5, GemstoneRed: 1 }, 'BowAshlandsBlood'),
  blackForgeRecipe(4, { BowAshlands: 1, FlametalNew: 5, GemstoneBlue: 1 }, { FlametalNew: 5, GemstoneBlue: 1 }, 'BowAshlandsLightning'),
  blackForgeRecipe(4, { BowAshlands: 1, FlametalNew: 5, GemstoneGreen: 1 }, { FlametalNew: 5, GemstoneGreen: 1 }, 'BowAshlandsNature'),
  // CrossbowRipper
  blackForgeRecipe(3, { Blackwood: 10, MorgenSinew: 2, FlametalNew: 8, BonemawSerpentTooth: 4 },
                      { Blackwood: 5, MorgenSinew: 1, FlametalNew: 4, BonemawSerpentTooth: 4 }, 'CrossbowRipper'),
  blackForgeRecipe(4, { CrossbowRipper: 1, FlametalNew: 8, GemstoneRed: 1 }, { FlametalNew: 8, GemstoneRed: 1 }, 'CrossbowRipperBlood'),
  blackForgeRecipe(4, { CrossbowRipper: 1, FlametalNew: 8, GemstoneBlue: 1 }, { FlametalNew: 8, GemstoneBlue: 1 }, 'CrossbowRipperLightning'),
  blackForgeRecipe(4, { CrossbowRipper: 1, FlametalNew: 8, GemstoneGreen: 1 }, { FlametalNew: 8, GemstoneGreen: 1 }, 'CrossbowRipperNature'),
  // SpearSplitner
  blackForgeRecipe(3, { Blackwood: 10, FlametalNew: 6, AskHide: 2, BonemawSerpentTooth: 3 },
                      { Blackwood: 5, FlametalNew: 6, AskHide: 1, BonemawSerpentTooth: 3 }, 'SpearSplitner'),
  blackForgeRecipe(4, { SpearSplitner: 1, FlametalNew: 6, GemstoneRed: 1 }, { FlametalNew: 6, GemstoneRed: 1 }, 'SpearSplitner_Blood'),
  blackForgeRecipe(4, { SpearSplitner: 1, FlametalNew: 6, GemstoneBlue: 1 }, { FlametalNew: 6, GemstoneBlue: 1 }, 'SpearSplitner_Lightning'),
  blackForgeRecipe(4, { SpearSplitner: 1, FlametalNew: 6, GemstoneGreen: 1 }, { FlametalNew: 6, GemstoneGreen: 1 }, 'SpearSplitner_Nature'),
  // AxeBerzerkr
  blackForgeRecipe(3, { CharredBone: 15, FlametalNew: 24, AskHide: 3 }, { FlametalNew: 15, AskHide: 1 }, 'AxeBerzerkr'),
  blackForgeRecipe(4, { AxeBerzerkr: 1, FlametalNew: 5, GemstoneRed: 1 }, { FlametalNew: 5, GemstoneRed: 1 }, 'AxeBerzerkrBlood'),
  blackForgeRecipe(4, { AxeBerzerkr: 1, FlametalNew: 5, GemstoneBlue: 1 }, { FlametalNew: 5, GemstoneBlue: 1 }, 'AxeBerzerkrLightning'),
  blackForgeRecipe(4, { AxeBerzerkr: 1, FlametalNew: 5, GemstoneGreen: 1 }, { FlametalNew: 5, GemstoneGreen: 1 }, 'AxeBerzerkrNature'),
  // MaceEldner
  blackForgeRecipe(3, { CharredBone: 10, FlametalNew: 15, SulfurStone: 5, AskHide: 3 },
                      { CharredBone: 5, FlametalNew: 8, SulfurStone: 3, AskHide: 2 }, 'MaceEldner'),
  blackForgeRecipe(4, { MaceEldner: 1, FlametalNew: 8, GemstoneRed: 1 }, { FlametalNew: 8, GemstoneRed: 1 }, 'MaceEldnerBlood'),
  blackForgeRecipe(4, { MaceEldner: 1, FlametalNew: 8, GemstoneBlue: 1 }, { FlametalNew: 8, GemstoneBlue: 1 }, 'MaceEldnerLightning'),
  blackForgeRecipe(4, { MaceEldner: 1, FlametalNew: 8, GemstoneGreen: 1 }, { FlametalNew: 8, GemstoneGreen: 1 }, 'MaceEldnerNature'),
  // SwordNiedhogg
  blackForgeRecipe(3, { CharredBone: 3, FlametalNew: 12, AskHide: 3 }, { FlametalNew: 10, AskHide: 2 }, 'SwordNiedhogg'),
  blackForgeRecipe(4, { SwordNiedhogg: 1, FlametalNew: 6, GemstoneRed: 1 }, { FlametalNew: 6, GemstoneRed: 1 }, 'SwordNiedhoggBlood'),
  blackForgeRecipe(4, { SwordNiedhogg: 1, FlametalNew: 6, GemstoneBlue: 1 }, { FlametalNew: 6, GemstoneBlue: 1 }, 'SwordNiedhoggLightning'),
  blackForgeRecipe(4, { SwordNiedhogg: 1, FlametalNew: 6, GemstoneGreen: 1 }, { FlametalNew: 6, GemstoneGreen: 1 }, 'SwordNiedhoggNature'),
  // SwordSlayer
  blackForgeRecipe(3, { FlametalNew: 30, AskHide: 5, MorgenSinew: 3 }, { FlametalNew: 15, AskHide: 5, MorgenSinew: 3 }, 'THSwordSlayer'),
  blackForgeRecipe(4, { THSwordSlayer: 1, FlametalNew: 15, GemstoneRed: 1 }, { FlametalNew: 15, GemstoneRed: 1 }, 'THSwordSlayerBlood'),
  blackForgeRecipe(4, { THSwordSlayer: 1, FlametalNew: 15, GemstoneBlue: 1 }, { FlametalNew: 15, GemstoneBlue: 1 }, 'THSwordSlayerLightning'),
  blackForgeRecipe(4, { THSwordSlayer: 1, FlametalNew: 15, GemstoneGreen: 1 }, { FlametalNew: 15, GemstoneGreen: 1 }, 'THSwordSlayerNature'),

  blackForgeRecipe(4, { DyrnwynHiltFragment: 1, DyrnwynBladeFragment: 1, DyrnwynTipFragment: 1,
                        FlametalNew: 20, GemstoneRed: 1 },
                      { FlametalNew: 10, GemstoneRed: 1 }, 'SwordDyrnwyn'),

  blackForgeRecipe(3, { FlametalNew: 20, AskHide: 3, CharredBone: 5 }, { FlametalNew: 10, AskHide: 1 }, 'ArmorFlametalLegs'),
  blackForgeRecipe(3, { FlametalNew: 20, AskHide: 3, CharredBone: 5, MorgenHeart: 1 }, { FlametalNew: 10, AskHide: 1 }, 'ArmorFlametalChest'),
  blackForgeRecipe(3, { FlametalNew: 16, AskHide: 3, CharredBone: 2, Eitr: 4 }, { FlametalNew: 8, AskHide: 1, Eitr: 2 }, 'HelmetFlametal'),
  blackForgeRecipe(3, { LinenThread: 15, LoxPelt: 4, AskHide: 10 }, { LinenThread: 10, LoxPelt: 2, AskHide: 5 }, 'ArmorAshlandsMediumlegs'),
  blackForgeRecipe(3, { LinenThread: 15, LoxPelt: 4, AskHide: 10 }, { LinenThread: 10, LoxPelt: 2, AskHide: 5 }, 'ArmorAshlandsMediumChest'),
  blackForgeRecipe(3, { LinenThread: 15, LoxPelt: 4, AskHide: 10 }, { LinenThread: 10, LoxPelt: 2, AskHide: 5 }, 'HelmetAshlandsMediumHood'),
  blackForgeRecipe(3, { FlametalNew: 5, MorgenSinew: 2, AskHide: 6 }, { AskHide: 2 }, 'CapeAsh'),

  blackForgeRecipe(3, { Blackwood: 10, FlametalNew: 8, AskHide: 2 }, { Blackwood: 10, FlametalNew: 4, AskHide: 2 }, 'ShieldFlametal'),
  blackForgeRecipe(3, { Blackwood: 15, FlametalNew: 10, AskHide: 5 }, { Blackwood: 10, FlametalNew: 4, AskHide: 2 }, 'ShieldFlametalTower'),

  blackForgeRecipe(1, { CharredBone: 2, Blackwood: 8, Feathers: 2 }, {}, 'BoltCharred', 20),
  blackForgeRecipe(1, { CharredBone: 4, Blackwood: 8, Feathers: 2 }, {}, 'ArrowCharred', 20),

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
  mageTableRecipe(2, { LinenThread: 16, Eitr: 15, AskHide: 2 },
                     { LinenThread: 8, Eitr: 5, }, 'HelmetMage_Ashlands'),
  mageTableRecipe(2, { LinenThread: 20, Eitr: 20, AskHide: 10, FlametalNew: 5 },
                     { LinenThread: 10, Eitr: 5, FlametalNew: 2 }, 'ArmorMageChest_Ashlands'),
  mageTableRecipe(2, { LinenThread: 20, Eitr: 20, AskHide: 10 },
                     { LinenThread: 10, Eitr: 5, }, 'ArmorMageLegs_Ashlands'),
  mageTableRecipe(2, { CharredBone: 15, Blackwood: 5, ProustitePowder: 8 },
                     { CharredBone: 5, Blackwood: 3, ProustitePowder: 1 }, 'StaffClusterbomb'),
  mageTableRecipe(2, { Blackwood: 15, Fiddleheadfern: 10, CelestialFeather: 3, GemstoneGreen: 1 },
                     { Blackwood: 5, Fiddleheadfern: 2, CelestialFeather: 3, GemstoneGreen: 1 }, 'StaffGreenRoots'),
  mageTableRecipe(2, { Blackwood: 10, FlametalNew: 4, CelestialFeather: 3, GemstoneRed: 1 },
                     { Blackwood: 5, FlametalNew: 2, CelestialFeather: 3, GemstoneRed: 1 }, 'StaffLightning'),
  mageTableRecipe(2, { AskHide: 6, MorgenSinew: 2 }, { AskHide: 2 }, 'CapeAsksvin'),
  mageTableRecipe(2, { CharredBone: 15, TrophyFrostTroll: 1, FlametalNew: 3, GemstoneRed: 1 },
                     { CharredBone: 5, TrophyFrostTroll: 1, FlametalNew: 3, GemstoneRed: 1 }, 'StaffRedTroll'),

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
  genericRecipe('piece_oven', 1, 50, { MagicallyStuffedShroomUncooked: 1 }, {}, 'MagicallyStuffedShroom'),
  genericRecipe('piece_oven', 1, 50, { PiquantPieUncooked: 1 }, {}, 'PiquantPie'),
  genericRecipe('piece_oven', 1, 50, { RoastedCrustPieUncooked: 1 }, {}, 'RoastedCrustPie'),
  // TRADER
  haldorRecipe(100, 'HelmetYule'),
  haldorRecipe(620, 'HelmetDverger'),
  haldorRecipe(950, 'BeltStrength'),
  haldorRecipe(120, 'YmirRemains', { killed: 'TheElder' }), 
  haldorRecipe(350, 'FishingRod'),
  haldorRecipe(10, 'FishingBait', { number: 20 }),
  haldorRecipe(50, 'Thunderstone', { killed: 'TheElder' }),
  haldorRecipe(1500, 'ChickenEgg', { killed: 'GoblinKing' }),
  haldorRecipe(100, 'BarrelRings', { number: 3 }),
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
  hildirRecipe(550, 'ArmorHarvester1', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(550, 'ArmorHarvester2', { killed: 'Skeleton_Hildir' }),
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
  hildirRecipe(300, 'HelmetStrawHat', { killed: 'Skeleton_Hildir' }),
  hildirRecipe(50, 'FireworksRocket_White', { killed: 'GoblinBruteBros' }),
  hildirRecipe(150, 'Sparkler'),
  hildirRecipe(75, 'Ironpit'),
  hildirRecipe(600, 'BarberKit'),
  // BOG WITCH
  bogWitchRecipe(100, 'CandleWick', { number: 50 }),
  bogWitchRecipe(200, 'ScytheHandle', { killed: 'GoblinKing' }),
  bogWitchRecipe(110, 'MeadTrollPheromones', { number: 5 }),
  bogWitchRecipe(85, 'MushroomBzerker', { killed: 'Dragon' }),
  bogWitchRecipe(140, 'FragrantBundle', { number: 5, killed: 'Dragon' }),
  bogWitchRecipe(75, 'FreshSeaweed', { number: 5 }),
  bogWitchRecipe(80, 'CuredSquirrelHamstring', { number: 5 }),
  bogWitchRecipe(120, 'PowderedDragonEgg', { number: 5 }),
  bogWitchRecipe(125, 'PungentPebbles', { number: 5 }),
  bogWitchRecipe(65, 'VineGreenSeeds', { number: 3 }),
  bogWitchRecipe(140, 'Feaster'),
  bogWitchRecipe(120, 'SpiceForests', { number: 5, killed: 'gd_king' }),
  bogWitchRecipe(130, 'SpiceOceans', { number: 5, killed: 'Serpent' }),
  bogWitchRecipe(140, 'SpiceMountains', { number: 5, killed: 'Dragon' }),
  bogWitchRecipe(160, 'SpicePlains', { number: 5, killed: 'GoblinKing' }),
  bogWitchRecipe(180, 'SpiceMistlands', { number: 5, killed: 'SeekerQueen' }),
  bogWitchRecipe(200, 'SpiceAshlands', { number: 5, killed: 'Fader' }),
  // PRODUCERS
  genericRecipe('piece_beehive', 1, GAME_DAY, {}, {}, 'Honey', 1),
  genericRecipe('piece_wisplure', 1, 30, {}, {}, 'Wisp', 1),
  genericRecipe('piece_sapcollector', 1, 60, {}, {}, 'Sap', 1),
];

const recipeMap = new Map(recipes.map(r => [r.item, r]));

export function getRecipe(id: EntityId): ItemRecipe | undefined {
  return recipeMap.get(id);
}