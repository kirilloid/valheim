import { CraftingStation, DamageModifier, DamageModifiers, DamageType, Ship } from "../types";
import { lerp, lerpStep, Vector3, mul, norm, add, clamp01, clamp } from "./utils";

const shipDamageModifiers: DamageModifiers = {
  [DamageType.Blunt]: DamageModifier.Normal,
  [DamageType.Slash]: DamageModifier.Normal,
  [DamageType.Pierce]: DamageModifier.Resistant,
  [DamageType.Chop]: DamageModifier.Immune,
  [DamageType.Pickaxe]: DamageModifier.Immune,
  [DamageType.Fire]: DamageModifier.Weak,
  [DamageType.Frost]: DamageModifier.Resistant,
  [DamageType.Lightning]: DamageModifier.Normal,
  [DamageType.Poison]: DamageModifier.Immune,
  [DamageType.Spirit]: DamageModifier.Immune,
};

export enum Sail {
  Slow,
  Half,
  Full,
};

export const ships: Ship[] = [
  {
    type: 'ship',
    id: 'Raft',
    wear: {
      hp: 300,
      damageModifiers: shipDamageModifiers,
    },
    sail: {
      forceDistance: 2,
      force: 0.5,
      damping: 0.05,
      dampingSideway: 0.1,
      dampingForward: 0.005,
      angularDamping: 0.05,
      sailForceOffset: 0.5,
      sailForceFactor: 0.05,
      rudderForce: 0.5,
      waterLevelOffset: 1.5,
      disableLevel: -0.5,
    },
    recipe: {
      materials: { Wood: 20, Resin: 6, LeatherScraps: 6 },
      station: CraftingStation.Workbench,
    },
  },
  {
    type: 'ship',
    id: 'Karve',
    wear: {
      hp: 500,
      damageModifiers: shipDamageModifiers,
    },
    sail: {
      forceDistance: 2,
      force: 1,
      damping: 0.05,
      dampingSideway: 0.15,
      dampingForward: 0.001,
      angularDamping: 0.05,
      sailForceOffset: 1,
      sailForceFactor: 0.03,
      rudderForce: 0.2,
      waterLevelOffset: 1.5,
      disableLevel: -0.5,
    },
    recipe: {
      materials: {
        FineWood: 30,
        DeerHide: 10,
        Resin: 20,
        BronzeNails: 80,
      },
      station: CraftingStation.Workbench,
    },
  },
  {
    type: 'ship',
    id: 'VikingShip',
    wear: {
      hp: 1000,
      damageModifiers: shipDamageModifiers,
    },
    sail: {
      forceDistance: 3,
      force: 1,
      damping: 0.05,
      dampingSideway: 0.15,
      dampingForward: 0.001,
      angularDamping: 0.3,
      sailForceOffset: 2,
      sailForceFactor: 0.05,
      rudderForce: 0.2,
      waterLevelOffset: 1.5,
      disableLevel: -0.5,
    },
    recipe: {
      materials: {
        IronNails: 100,
        DeerHide: 10,
        FineWood: 40,
        ElderBark: 40,
      },
      station: CraftingStation.Workbench,
    },
  },
];

const getWindAngleFactor = (angleCos: number) => {
  return lerp(0.7, 1, 1 - Math.abs(angleCos)) * (1 - lerpStep(0.75, 0.8, angleCos));
}

// Raft: 0.05, Karve: 0.03, 
const sailForceFactor = 0.03;

const getSailForce = (sail: Sail.Half | Sail.Full, windIntensity: number, windAngle: number) => {
  const sailSize = sail === Sail.Full ? 1 : 0.5; 
  const windDir: Vector3 = { x: Math.sin(windAngle), y: 0, z: -Math.cos(windAngle) };
  const wind = lerp(0.25, 1, windIntensity);
  const windEff = getWindAngleFactor(Math.cos(windAngle)) * wind;
  const forward = { x: 0, y: 0, z: 1 };
  return mul(norm(add(windDir, forward)), windEff * sailForceFactor * sailSize);
};

const fixedDeltaTime = 1 / 50;

export const getSailSpeed = (sail: Ship['sail'], sailState: Sail, windIntensity: number, windAngle: number): Vector3 => {
  let velocity: Vector3 = { x: 0, y: 0, z: 0 };
  // let angularVelocity = 0;
  const floatLevel = -1;
  const dampFactor: number = clamp01(Math.abs(floatLevel) / sail.forceDistance);
  if (floatLevel > sail.disableLevel) return velocity;
  const sailForce = sailState === Sail.Slow
    ? { x: 0, y: 0, z: sail.rudderForce * fixedDeltaTime }
    : getSailForce(sailState, windIntensity, windAngle);
  /* for (let i = 0; i < 2500; i++) {
    // this.m_body.AddForceAtPosition(Vector3.up * this.m_force * num5 * num4, worldCenterOfMass, (ForceMode) 2);
    const vx = velocity.x;
    const vy = velocity.y;
    const vz = velocity.z;
    const Fx: number = vx * vx * Math.sign(vx) * sail.dampingSideway * dampFactor;
    const Fy: number = vy * vy * Math.sign(vy) * sail.damping * dampFactor;
    const Fz: number = vz * vz * Math.sign(vz) * sail.dampingForward * dampFactor;
    let newVelocity: Vector3 = {
      x: velocity.x - clamp(Fx, -1, 1),
      y: velocity.y - clamp(Fy, -1, 1),
      z: velocity.z - clamp(Fz, -1, 1),
    };
    // if (magnitude(newVelocity) > magnitude(velocity))
    //  newVelocity = norm(newVelocity, magnitude(velocity));
    velocity = newVelocity;
    // angularVelocity *= (1 - sail.angularDamping * dampFactor);
    velocity.x += sailForce.x;
    velocity.y += sailForce.y;
    velocity.z += sailForce.z;
  }
  return velocity; */
  return {
    x: Math.sqrt(Math.abs(sailForce.x) / (sail.dampingSideway * dampFactor)),
    y: Math.sqrt(sailForce.y / (sail.damping * dampFactor)),
    z: Math.sqrt(sailForce.z / (sail.dampingForward * dampFactor)),
  };
}

export const getSailSpeeds = (sail: Ship['sail'], sailState: Sail, windIntensity: number, windAngle: number, maxSeconds: number): number[] => {
  let velocity = 0;
  const result = [velocity];
  // let angularVelocity = 0;
  const floatLevel = -1;
  const dampFactor: number = clamp01(Math.abs(floatLevel) / sail.forceDistance);
  if (floatLevel > sail.disableLevel) return [];
  const sailForce = sailState === Sail.Slow
    ? { x: 0, y: 0, z: sail.rudderForce * fixedDeltaTime }
    : getSailForce(sailState, windIntensity, windAngle);
  for (let s = 0; s < maxSeconds; s++) {
    for (let t = 1 / fixedDeltaTime; t > 0; t--) {
      const Fx: number = (velocity ** 2) * sail.dampingForward * dampFactor;
      velocity -= clamp(Fx, -1, 1);
      velocity += sailForce.z;
    }
    result.push(velocity);
  }
  return result;
}