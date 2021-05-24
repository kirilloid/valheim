// @ts-check

const ItemType2Hands = [
    'none', 'none', 'none', 'primary', 'bow', 'secondary', 'none', 'head', 'body', 'none', 'none',
    'none', 'legs', 'none',  'none', 'both', 'either', 'none', 'shoulders', 'util', 'both',
    'both',
];
const ItemType2Type = [
    'none', 'resource', 'resource', 'weapon', 'weapon', 'weapon', 'weapon', 'armor', 'armor', 'armor', 'armor',
    'none', 'armor', '???', 'resource', 'weapon', 'either', 'none', 'armor', 'weapon', 'tool',
    'none',
];
const ItemType = [
    'None', 'Material', 'Consumable', 'OneHandedWeapon', 'Bow', 'Shield', 'Helmet', 'Chest', ,'Ammo',
    'Customization', 'Legs', 'Hands', 'Trophie', 'TwoHandedWeapon', 'Torch', 'Misc', 'Shoulder', 'Utility', 'Tool',
    'Attach_Atgeir'
];
const AnimationState = [
    'Unarmed', 'OneHanded', 'TwoHandedClub', 'Bow', 'Shield', 'Torch', 'LeftTorch', 'Atgeir', 'TwoHandedAxe', 'FishingRod'
];
const SkillType = [
    'None', 'Swords', 'Knives', 'Clubs', 'Polearms', 'Spears', 'Blocking', 'Axes', 'Bows', 'FireMagic',
    'FrostMagic', 'Unarmed', 'Pickaxes', 'WoodCutting',
];
const DestructibleType = [
    'None', 'Default', 'Tree', 'Default & Tree',
    'Character', 'Default & Character', 'Default & Tree', 'All',
]
const AttackType = [
    'Horizontal', 'Vertical', 'Projectile', 'None', 'Area', 'TriggerProjectile',
];
const HitPointType = ['Closest', 'Average', 'First'];

/** @param {number} x */
function normFloat(x) {
  const s = x.toString();
  /** @type {RegExpMatchArray?} */
  const m = s.match(/^(-?\d+\.\d+?)(0{4,}|9{4,})\d+$/);
  if (!m) return x;
  const scale = m[1].split('.')[1].length;
  const mul = 10 ** scale;
  return Math.round(x * mul) / mul;
}

/** @param {number[]} vals */
function range(vals) {
  return vals[1] ? `[${vals.join(', ')}]` : String(vals[0]);
}


function weaponTemplate(i) {
    return `
    { type: '${ItemType2Type[i.itemType]}',
      hands: '${ItemType2Hands[i.itemType]}',
      id: '???',
      toolTier: ${i.toolTier},
      weight: ${i.weight}, stack: ${i.maxStackSize}, teleportable: ${i.teleportable},
      skill: SkillType.${i.skillType},
      damage: [{
        ${Object.entries(i.damages)
              .map(([name, val]) => `[DamageType.${name}]: ${val}`)
              .join(',\n        ')},
      }, {
        ${Object.entries(i.damagesPerLevel)
              .map(([name, val]) => `[DamageType.${name}]: ${val}`)
              .join(',\n        ')},
      }],
      attacks: [${i.attacks
      .filter(a => a.attackAnimation)
      .map(a => `{
        type: '${a.attackType}',
        chain: ${a.attackChainLevels},
        chainCombo: ${a.lastChainDamageMultiplier},
        stamina: ${a.attackStamina},
        range: ${a.attackRange},
        ${a.damageMultiplier !== 1 || a.forceMultiplier !== 1 || a.staggerMultiplier !== 1
          ? `mul: { damage: ${a.damageMultiplier}, force: ${a.forceMultiplier}, stagger: ${a.staggerMultiplier} },\n`
          : ''}      }`).join(', ')}],
      maxLvl: ${i.maxQuality},
      durability: ${range(i.maxDurability)},
      block: ${range(i.blockPower)},
      parryForce: ${range(i.deflectionForce)},
      parryBonus: ${i.timedBlockBonus},
      knockback: ${i.attackForce}, backstab: ${i.backstabBonus}, moveSpeed: ${i.movementModifier},
      recipe: {},
    }`;
}

function foodTemplate(i) {
  return `
  { type: 'food', id: '???', weight: ${i.weight}, stack: ${i.maxStackSize}, teleportable: ${i.teleportable},
    health: ${i.food}, stamina: ${i.foodStamina}, duration: ${i.foodBurnTime}, regen: ${i.foodRegen}, color: ${i.foodColor} },`
}

function itemTemplate(i) {
  return `
  { type: 'food', id: '???', weight: ${i.weight}, stack: ${i.maxStackSize}, teleportable: ${i.teleportable} }`;
}

class AssetReader {
    /**
     * @param {ArrayBuffer} buffer
     */
    constructor(buffer) {
        this.buffer = buffer;
        this.offset = 0;
        this.byteReader = new Uint8Array(buffer);
        this.intReader = new Int32Array(buffer);
        this.floatReader = new Float32Array(buffer);
    }

    /** @param {number} offset */
    getItem(offset) {
        this.offset = offset;
        return this.readItem();
    }

    readItem() {
/*      this is used when item is read generically, not as MonoBehavior
        const { parentId } = this.readObject(); // parent object
        this.readInt();
        this.readObject();
        this.readInt();
        */
        const autoPickup = this.readBool();
        const autoDestroy = this.readBool();
        // per-instance values
        this.readInt(); // stack
        this.readFloat(); // durability
        this.readInt(); // quality
        this.readInt(); // variant
        const name = this.readString();
        this.readString(); // dlc
        const itemType = this.readInt();
        this.readList(); // icons
        const attachOverride = this.readInt();
        const description = this.readString();
        const maxStackSize = this.readInt();
        const maxQuality = this.readInt();
        const weight = normFloat(this.readFloat());
        const value = this.readInt();
        const teleportable = this.readBool();
        const questItem = this.readBool();
        const equipDuration = normFloat(this.readFloat());
        const variants = this.readInt();
        // trophyPos
        this.readInt();
        this.readInt();
        this.readObject(); // buildPieces
        const centerCamera = this.readBool();
        const setName = this.readString();
        const setSize = this.readInt();
        this.readObject(); // setStatusEffect
        this.readObject(); // equipStatusEffect
        const movementModifier = normFloat(this.readFloat());
        const food = this.readFloat();
        const foodStamina = this.readFloat();
        const foodBurnTime = this.readFloat();
        const foodRegen = this.readFloat();
        const foodColor = this.readColor();
        this.readObject(); // armorMaterial
        const helmetHideHair = this.readBool();
        const armor = [this.readFloat(), this.readFloat()];
        const damageModifiers = this.readList(this.readDamageModifier);
        const blockPower = [this.readFloat(), this.readFloat()];
        const deflectionForce = [this.readFloat(), this.readFloat()];
        const timedBlockBonus = this.readFloat();
        // [Header("Weapon")]
        const animationState = AnimationState[this.readInt()];
        const skillType = SkillType[this.readInt()];
        const toolTier = this.readInt();
        const damages = this.readDamageTypes();
        const damagesPerLevel = this.readDamageTypes();
        const attackForce = this.readFloat();
        const backstabBonus = this.readFloat();
        const dodgeable = this.readBool();
        const blockable = this.readBool();
        this.readObject(); // attackStatusEffect
        this.readObject(); // public GameObject m_spawnOnHit;
        this.readObject(); // public GameObject m_spawnOnHitTerrain;
        // [Header("Attacks")]
        const attacks = [
            this.readAttack(),
            this.readAttack(),
        ];
        // [Header("Durability")]
        const useDurability = this.readBool();
        const destroyBroken = this.readBool();
        const canBeReparied = this.readBool();
        const maxDurability = [this.readFloat(), this.readFloat()];
        const useDurabilityDrain = this.readFloat();
        const durabilityDrain = this.readFloat();
        // [Header("Hold")]
        const holdDurationMin = this.readFloat();
        const holdStaminaDrain = this.readFloat();
        const holdAnimationState = this.readString();
        // [Header("Ammo")]
        const ammoType = this.readString();
        // [Header("AI")]
        this.readFloat(); // aiAttackRange = 2f;
        this.readFloat(); // aiAttackRangeMin;
        this.readFloat(); // aiAttackInterval = 2f;
        this.readFloat(); // aiAttackMaxAngle = 5f;
        this.readBool(); // aiWhenFlying = true;
        this.readBool(); // aiWhenWalking = true;
        this.readBool(); // aiWhenSwiming = true;
        this.readBool(); // aiPrioritized;
        this.readInt(); // AiTarget m_aiTargetType;
        this.readList(this.readEffect); // hitEffect
        this.readList(this.readEffect); // hitTerrainEffect
        this.readList(this.readEffect); // blockEffect
        this.readList(this.readEffect); // startEffect
        this.readList(this.readEffect); // holdStartEffect
        this.readList(this.readEffect); // triggerEffect
        this.readList(this.readEffect); // trailStartEffect
        const consumeEffectId = this.readObject();

        const item = {
            // parentId,
            autoPickup,
            autoDestroy,
            name,
            itemType,
            attachOverride,
            description,
            maxStackSize,
            maxQuality,
            weight,
            value,
            teleportable,
            questItem,
            equipDuration,
            variants,
            centerCamera,
            setName,
            setSize,
            movementModifier,
            food,
            foodStamina,
            foodBurnTime,
            foodRegen,
            foodColor,
            helmetHideHair,
            armor,
            damageModifiers,
            blockPower,
            deflectionForce,
            timedBlockBonus,
            animationState,
            skillType,
            toolTier,
            damages,
            damagesPerLevel,
            attackForce,
            backstabBonus,
            dodgeable,
            blockable,
            attacks,
            useDurability,
            destroyBroken,
            canBeReparied,
            maxDurability,
            useDurabilityDrain,
            durabilityDrain,
            holdDurationMin,
            holdStaminaDrain,
            holdAnimationState,
            ammoType,
            consumeEffectId,
        }
        console.log(weaponTemplate(item));
        return item;
    }

    readAttack() {
        // [Header("Common")]
        const attackType = AttackType[this.readInt()];
        const attackAnimation = this.readString();
        const attackRandomAnimations = this.readInt();
        const attackChainLevels = this.readInt();
        const consumeItem = this.readBool();
        const hitTerrain = this.readBool(); //  = true;
        const attackStamina = this.readFloat(); // = 20f;
        const speedFactor = normFloat(this.readFloat()); // = 0.2f;
        const speedFactorRotation = normFloat(this.readFloat()); // = 0.2f;
        const attackStartNoise = this.readFloat(); // = 10f;
        const attackHitNoise = this.readFloat(); // = 30f;
        const damageMultiplier = this.readFloat(); // = 1f;
        const forceMultiplier = this.readFloat(); // = 1f;
        const staggerMultiplier = this.readFloat(); // = 1f;
        // [Header("Misc")]
        const attackOriginJoint = this.readString();
        const attackRange = normFloat(this.readFloat()); // = 1.5f;
        const attackHeight = normFloat(this.readFloat()); // = 0.6f;
        const attackOffset = this.readFloat();
        this.readObject(); // public GameObject m_spawnOnTrigger;
        // [Header("Melee/AOE")]
        const attackAngle = this.readFloat(); // = 90f;
        const attackRayWidth = normFloat(this.readFloat());
        const maxYAngle = this.readFloat();
        const lowerDamagePerHit = this.readBool(); // = true;
        const hitPointtype = HitPointType[this.readInt()];
        const hitThroughWalls = this.readBool();
        const multiHit = this.readBool(); // = true;
        const lastChainDamageMultiplier = this.readFloat(); // = 2f;
        this.readInt(); // DestructibleType resetChainIfHit;
        // [Header("Melee special-skill")]
        const specialHitSkill = SkillType[this.readInt()];
        const specialHitType = DestructibleType[this.readInt()]; // DestructibleType
        // [Header("Projectile")]
        this.readObject(); // attackProjectile;
        const projectileVel = this.readFloat(); // = 10f;
        const projectileVelMin = this.readFloat(); // = 2f;
        const projectileAccuracy = this.readFloat(); // = 10f;
        const projectileAccuracyMin = this.readFloat(); // = 20f;
        const useCharacterFacing = this.readBool();
        const useCharacterFacingYAim = this.readBool();
        const launchAngle = this.readFloat();
        const projectiles = this.readInt();
        const projectileBursts = this.readInt();
        const burstInterval = this.readFloat();
        const destroyPreviousProjectile = this.readBool();
        // [Header("Attack-Effects")]
        this.readList(this.readEffect); // hitEffect
        this.readList(this.readEffect); // hitTerrainEffect
        this.readList(this.readEffect); // startEffect
        this.readList(this.readEffect); // triggerEffect
        this.readList(this.readEffect); // trailStartEffect
        return {
            attackType,
            attackAnimation,
            attackRandomAnimations,
            attackChainLevels,
            consumeItem,
            hitTerrain,
            attackStamina,
            speedFactor,
            speedFactorRotation,
            attackStartNoise,
            attackHitNoise,
            damageMultiplier,
            forceMultiplier,
            staggerMultiplier,
            attackRange,
            attackHeight,
            attackOffset,
            attackAngle,
            attackRayWidth,
            maxYAngle,
            lowerDamagePerHit,
            hitPointtype,
            hitThroughWalls,
            multiHit,
            lastChainDamageMultiplier,
            specialHitSkill,
            specialHitType,
            projectileVel,
            projectileVelMin,
            projectileAccuracy,
            projectileAccuracyMin,
            useCharacterFacing,
            useCharacterFacingYAim,
            launchAngle,
            projectiles,
            projectileBursts,
            burstInterval,
            destroyPreviousProjectile,
        }
    }

    /** @returns {Record<string, number>} */
    readDamageTypes() {
        /** @type {Object} obj */
        const obj = {
            damage: this.readFloat(),
            blunt: this.readFloat(),
            slash: this.readFloat(),
            pierce: this.readFloat(),
            chop: this.readFloat(),
            pickaxe: this.readFloat(),
            fire: this.readFloat(),
            frost: this.readFloat(),
            lightning: this.readFloat(),
            poison: this.readFloat(),
            spirit: this.readFloat(),
        };
        return Object.fromEntries(Object.entries(obj).filter(p => p[1]));
    }

    /** @returns {Object} */
    readObject() {
        this.readInt();
        const id = this.readInt();
        this.readInt();
        return { id };
    }

    readDamageModifier() {
        const types = ['blunt', 'slash', 'pierce', 'chop', 'pickaxe', 'Fire', 'Frost', 'Lightning', 'Poison', 'Spirit'];
        const mods = ['Normal', 'Resistant', 'Weak', 'Immune', 'Ignore', 'VeryResistant', 'VeryWeak'];
        const res = {};
        const typeMask = this.readInt();
        const mod = mods[this.readInt()];
        for (let i = 0; i < types.length; i++) {
            if (typeMask & (1 << i)) {
                res[types[i]] = mod;
            }
        }
        return res;
    }

    readEffect() {
        const obj = this.readObject();
        for (let i = 0; i < 6; i++)
            this.readInt();
        return obj;
    }

    /**
     * @param {() => Object} reader
     * @returns {Object[]}
     */ 
    readList(reader = this.readObject) {
        const len = this.readInt();
        const res = [];
        for (let i = 0; i < len; i++) {
            res.push(reader.call(this));
        }
        return res;
    }

    /** @returns {string} */
    readColor() {
        const components = [
            this.readFloat(),
            this.readFloat(),
            this.readFloat(),
            this.readFloat(),
        ];
        return '#' + components.map(
            x => Math.round(x * 255)
                    .toString(16)
                    .padStart(2, '0')
        ).join('');
    }

    /** @returns {number} */
    readFloat() {
        const val = this.floatReader[this.offset >> 2];
        if (Math.abs(val) < 0.01 && val !== 0) {
            console.error(`Invalid float value: ${val}`);
        }
        this.offset += 4;
        return val;
    }

    /** @returns {number} */
    readInt() {
        const val = this.intReader[this.offset >> 2];
        if (val > 0x00100000) {
            console.error(`Invalid intval ${val}`);
        }
        this.offset += 4;
        return val;
    }

    /** @returns {number} */
    readByte() {
        const val = this.byteReader[this.offset];
        this.offset += 1;
        return val;
    }

    /** @returns {boolean} */
    readBool() {
        const val = this.readInt();
        if (val !== 0 && val !== 1) {
            console.error(`Invalid boolean: intval ${val}`);
        }
        return val === 1;
    }

    /** @returns {string} */
    readString() {
        const len = this.readInt();
        const bytes = [];
        for (let i = 0; i < len; i++) {
            bytes.push(this.readByte());
        }
        // align
        while (this.offset & 3) this.offset++;
        return String.fromCharCode(...bytes);
    }
}

const elements = {
    drop: document.getElementById('drop'), 
    run: document.getElementById('run'),
    input: document.getElementById('input'),
    output: document.getElementById('json'),
};
/** @type {AssetReader?} */
let reader;

/** @param {DragEvent} e */
function dropHandler(e) {
    e.preventDefault();
    elements.run.disabled = true;
    elements.input.disabled = true;
    if (e.dataTransfer.files.length < 1) return;
    // e.dataTransfer.files[0].stream
    e.dataTransfer.files[0].arrayBuffer().then((buffer) => {
        reader = new AssetReader(buffer);
        elements.run.disabled = false;
        elements.input.disabled = false;
    });
};

function readOffset() {
    const offset = parseInt(elements.input.value);
    const obj = reader.getItem(offset);
    elements.output.innerText = JSON.stringify(obj, null, 2);
}

elements.drop.ondrop = dropHandler;
elements.drop.ondragover = () => false;
elements.run.onclick = readOffset;
