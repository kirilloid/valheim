import { random } from './random';

import { locations } from '../data/location';
import { LocationConfig } from '../types';
import { Quaternion, stableHashCode, Vector2i, Vector3 } from './utils';
import { WATER_LEVEL, ZONE_SIZE } from './game';
import { Biome as BiomeEnum, BiomeArea, WorldGenerator } from './world-generator';
import { zoneId } from './zdo-selectors';
import { objects } from '../data/objects';
import { Heightmap } from './heightmap';

export type RegisteredLocation = {
  location: LocationConfig;
  pos: Vector3;
};

type ClearArea = {
  center: Vector3;
  radius: number;
};

export class ZoneSystem {
  locationCount: Record<string, number> = {};
  locationInstances = new Uint32Array(); 
  
  private _locationInstances: Map<number, RegisteredLocation> = new Map();
  private _prefabIndex: Map<string, RegisteredLocation[]> = new Map();
  private _groupIndex: Map<string, RegisteredLocation[]> = new Map([['', []]]);

  constructor(private worldGenerator: WorldGenerator) {}

  private _getLocationIn(zone: Vector2i): RegisteredLocation | undefined {
    const id = zoneId(zone);
    return this._locationInstances.get(id);
  }

  public *generateLocations(seed: number): Generator<number, RegisteredLocation[], void> {
/*    if (!Application.isPlaying)
    {
      console.log("Setting up locations");
      this.SetupLocations();
    } */
    // console.log("Generating locations");
    const now = Date.now();
    // this.CheckLocationDuplicates();
    // this.ClearNonPlacedLocations();
    for (const [i, location] of locations.sort((a, b) => +b.prioritized - +a.prioritized).entries()) {
      if (location.quantity !== 0) {
        this.generateLocation(seed, location);
        yield (i + 1) / locations.length;
      }
    }
    // console.log(`Done generating locations, duration: ${Date.now() - now} ms`);
    return [...this._locationInstances.values()];
  }

  public _getLeviathans(seed: number): Vector3[] {
    const result: Vector3[] = [];
    const veg = objects.find(d => d.id === 'Leviathan')?.grow?.[0];
    if (veg == null) return [];
    const INNER_SIZE_2 = Math.ceil((10000 / ZONE_SIZE + Math.SQRT2) ** 2);
    const prefabHash = stableHashCode('Leviathan');
    const state = random.getState();
    const margin = ZONE_SIZE / 2 - veg.groupRadius;
    for (let y = -156; y <= 156; y++) {
      for (let x = -156; x <= 156; x++) {
        if (x * x + y * y > INNER_SIZE_2) continue;
        if (this.worldGenerator._getZoneBiomeMask(x, y) === (1 << BiomeEnum.Ocean)) {
          random.init(seed + x * 4271 + y * 9187 + prefabHash);
          if (random.random() > veg.num[1]) continue;
          const groupSize = random.rangeInt(veg.group[0], veg.group[1] + 1);
          const p = {
            x: x * ZONE_SIZE + random.rangeFloat(-margin, margin),
            y: 0,
            z: y * ZONE_SIZE + random.rangeFloat(-margin, margin),
          };
          p.y = this.worldGenerator.getHeight(p.x, p.z) - WATER_LEVEL;
          if (p.y > veg.altitude[1] || p.y < veg.altitude[0]) continue;
          result.push(p);
        }
      }
    }
    random.setState(state);
    return result;
  }

  private countNrOfLocation(location: LocationConfig): number {
    return this.locationCount[location.id] ?? 0;
  }

  private getRandomZone(range: number): Vector2i {
    const max = Math.floor(range / ZONE_SIZE);
    let x, y;
    const MAX_SIZE_2 = (10000 / ZONE_SIZE) ** 2;
    do {
      x = random.rangeInt(-max, max);
      y = random.rangeInt(-max, max);
    } while (x * x + y * y >= MAX_SIZE_2);
    return { x, y };
  }

  getRandomPointInZone(zone: Vector2i, locationRadius: number): Vector3 {
    const x = zone.x * ZONE_SIZE;
    const y = zone.y * ZONE_SIZE;
    const size2 = ZONE_SIZE / 2;
    const dc = size2 - locationRadius;
    const dx = random.rangeFloat(-dc, dc);
    const dy = random.rangeFloat(-dc, dc);
    return {
      x: x + dx,
      y: 0.0,
      z: y + dy,
    };
  }

  private generateLocation(seed: number, location: LocationConfig): void {
    const now = Date.now();
    const state = random.getState();
    random.init(seed + stableHashCode(location.id));
    this._prefabIndex.set(location.id, []);
    if (location.group.length > 0 && this._groupIndex.get(location.group) == null) {
      this._groupIndex.set(location.group, []);
    }

    let errorLocationInZone = 0;
    let errorCenterDistance = 0;
    let errorBiome = 0;
    let errorBiomeArea = 0;
    let errorAlt = 0;
    let errorForest = 0;
    let errorSimilar = 0;
    let errorTerrainDelta = 0;
    let locationRadius = Math.max(location.radius[0], location.radius[1]);
    let iterations = location.prioritized ? 200_000 : 100_000;
    let attempts = 0;
    let placed = this.countNrOfLocation(location);
    let range = 10000;
    if (location.centerFirst) range = location.distance[0];
    if (location.unique && placed > 0)
      return;
    const [minDistance, maxDistance] = location.distance;
    for (let iteration = 0; iteration < iterations && placed < location.quantity; ++iteration)
    {
      const zone = this.getRandomZone(range);
      if (location.centerFirst) ++range;
      if (this._getLocationIn(zone) != null) {
        ++errorLocationInZone;
        continue;
      }
      // if (this.isZoneGenerated(zone)) continue;
      const biomeArea = this.worldGenerator.getBiomeArea(zone.x, zone.y);
      if ((location.biomeArea & biomeArea) === 0) {
        ++errorBiomeArea;
        continue;
      }
      const minDistance2 = minDistance * minDistance;
      const maxDistance2 = maxDistance * maxDistance;
      for (let index2 = 0; index2 < 20; ++index2) {
        ++attempts;
        const point = this.getRandomPointInZone(zone, locationRadius);
        const { x, z } = point;
        const magnitude2 = x * x + z * z;
        if ((minDistance2 !== 0 && magnitude2 < minDistance2)
        ||  (maxDistance2 !== 0 && magnitude2 > maxDistance2)) {
          ++errorCenterDistance;
          continue;
        }
        const biome = this.worldGenerator.getBiome(x, z);
        if (!location.biomes.includes(BiomeEnum[biome] as any)) {
          ++errorBiome;
          continue;
        }
        point.y = this.worldGenerator.getHeight(point.x, point.z);
        const altitude = point.y - WATER_LEVEL;
        if (altitude < location.altitude[0] || altitude > location.altitude[1]) {
          ++errorAlt;
          continue;
        }
        if (location.inForest != null) {
          const forestFactor = this.worldGenerator.getForestFactor(x, z);
          if (forestFactor < location.inForest[0] || forestFactor > location.inForest[1]) {
            ++errorForest;
            continue;
          }
        }
        const delta = this.worldGenerator.getTerrainDelta(point, location.radius[1]);
        if (delta < location.terrainDelta[0] || delta > location.terrainDelta[1])
          ++errorTerrainDelta;
        else if (location.minApart > 0 && this.haveLocationInRange(location.id, location.group, point, location.minApart)) {
          ++errorSimilar;
        } else {
          this.registerLocation(location, point, false);
          ++placed;
          break;
        }
      }
    }
    if (placed < location.quantity) {
      console.warn("Failed to place all " + location.id + ", placed " + placed + " out of " + location.quantity, {
        errorLocationInZone,
        errorCenterDistance,
        errorBiome,
        errorBiomeArea,
        errorAlt,
        errorForest,
        errorSimilar,
        errorTerrainDelta
      });
    }
    const timeSpan = Date.now() - now;
    // console.log("time spent on location " + location.id + ": " + timeSpan);
    random.setState(state);
  }

  private getZone(point: Vector3): Vector2i  {
    return {
      x: Math.floor((point.x + ZONE_SIZE / 2) / ZONE_SIZE),
      y: Math.floor((point.z + ZONE_SIZE / 2) / ZONE_SIZE),
    };
  }

  private registerLocation(location: LocationConfig, pos: Vector3, generated: boolean): void {
    const locationInstance = { location, pos };
    const zone = this.getZone(pos);
    if (this._getLocationIn(zone)) {
      console.warn(`Location already exist in zone ${JSON.stringify(zone)}`);
      return;
    }
    this._locationInstances.set(zoneId(zone), locationInstance);
    this._prefabIndex.get(location.id)!.push(locationInstance);
    if (location.group.length > 0) {
      this._groupIndex.get(location.group)!.push(locationInstance);
    }
  }

  private haveLocationInRange(prefabName: string, group: string, p: Vector3, radius: number): boolean {
    const radius2 = radius * radius;

    const sameLocations = this._prefabIndex.get(prefabName)!;
    for (const { pos } of sameLocations) {
      const dx = pos.x - p.x;
      const dy = pos.y - p.y; // always 0 ?
      const dz = pos.z - p.z;
      if (dx * dx + dy * dy + dz * dz < radius2) return true;
    }

    if (group === '') return false;
    const groupLocations = this._groupIndex.get(group)!;
    for (const { pos } of groupLocations) {
      const dx = pos.x - p.x;
      const dy = pos.y - p.y; // always 0 ?
      const dz = pos.z - p.z;
      if (dx * dx + dy * dy + dz * dz < radius2) return true;
    }

    return false;
  }

  private getRandomPointInRadius(center: Vector3, radius: number): Vector3 {
    const f = random.random() * Math.PI * 2;
    const num = random.rangeFloat(0, radius);
    return {
      x: center.x + Math.sin(f) * num,
      y: center.y,
      z: center.z + Math.cos(f) * num,
    };
  }

  public getGroundData(
    p: Vector3,
  ): {
    normal: Vector3,
    biome: BiomeEnum,
    biomeArea: number,
    hmap?: Heightmap,
  } {
    let biome: BiomeEnum = -1;
    let biomeArea = 3;
    let normal = { x: 0, y: 0, z: 0 };
    let hmap: Heightmap | undefined = undefined;
    // if (Physics.Raycast(p + Vector3.up * 5000f, Vector3.down, out hitInfo, 10000f, this.m_terrainRayMask))
    {
      // p.y = hitInfo.point.y;
      // normal = hitInfo.normal;
      const component: Heightmap = new Heightmap(this.worldGenerator, p);
      biome = component.getBiome(p);
      biomeArea = component.getBiomeArea();
      hmap = component;
    }
    // else
    //   normal = { x: 0, y: 1, z: 0 };
    return { normal, biome, biomeArea, hmap };
  }

  private isBlocked(point: Vector3): boolean {
    return false;
  }

  private placeVegetation(
    seed: number,
    zone: Vector2i,
    zoneCenterPos: Vector3,
    // Transform parent,
    // Heightmap hmap,
    clearAreas: ClearArea[],
    // ZoneSystem.SpawnMode mode,
    // List<GameObject> spawnedObjects
  ) {
    const state = random.getState();
    const ZONE_SIZE_2 = ZONE_SIZE / 2;
    let num2 = 1;
    for (const zoneVegetation of objects) {
      ++num2;
      if (zoneVegetation.disabled) continue;
      for (const grow of zoneVegetation.grow ?? []) {
        const _seed = seed + zone.x * 4271 + zone.y * 9187 + stableHashCode(zoneVegetation.id);
        random.init(_seed);
        let number = 1;
        if (grow.num[1] < 1.0) {
          if (random.random() > grow.num[1])
            continue;
        } else {
          number = random.rangeInt(grow.num[0], grow.num[1] + 1);
        }
        const flag1 = zoneVegetation.components?.includes('ZNetView');
        const minSideNormal = Math.cos(Math.PI * grow.tilt[0] / 180);
        const maxSideNormal = Math.cos(Math.PI * grow.tilt[1] / 180);
        const margin = ZONE_SIZE_2 - grow.groupRadius;
        const attempts = grow.forcePlacement ? number * 50 : number;
        let placedNumber = 0;
        for (let index1 = 0; index1 < attempts; ++index1) {
          const center: Vector3 = {
            x: zoneCenterPos.x + random.rangeFloat(-margin, margin),
            y: 0,
            z: zoneCenterPos.z + random.rangeFloat(-margin, margin),
          };
          const groupSize = random.rangeInt(grow.group[0], grow.group[1] + 1);
          let placed = false;
          for (let index2 = 0; index2 < groupSize; ++index2) {
            const p = index2 === 0 ? center : this.getRandomPointInRadius(center, grow.groupRadius);
            const angle = random.rangeInt(0, 360);
            const scale = random.rangeFloat(grow.scale[0], grow.scale[1]);
            const { randTilt } = grow;
            const x = random.rangeFloat(-randTilt, randTilt);
            const z = random.rangeFloat(-randTilt, randTilt);
            if (grow.blockCheck && this.isBlocked(p)) {
              continue;
            }
            const { normal, biome, biomeArea, hmap } = this.getGroundData(p);
            if (!grow.locations.includes(BiomeEnum[biome] as any)
            ||  !(grow.biomeArea & biomeArea)) {
              continue;
            }
            const altitude = p.y - WATER_LEVEL;
            if (altitude < grow.altitude[0] || altitude > grow.altitude[1]) {
              continue;
            }
            if (grow.oceanDepth[0] != grow.oceanDepth[1]) {
              const oceanDepth = hmap?.getOceanDepth(p) ?? 0;
              if (oceanDepth < grow.oceanDepth[0] || oceanDepth > grow.oceanDepth[1])
                continue;
            }
            if (normal.y < minSideNormal || normal.y > maxSideNormal) continue;
            if (grow.terrainDeltaRadius > 0) {
              const delta = this.worldGenerator.getTerrainDelta(p, grow.terrainDeltaRadius);
              if (delta > grow.terrainDelta[1] || delta < grow.terrainDelta[0])
                continue;
            }

            if (grow.inForest) {
              const forestFactor = this.worldGenerator.getForestFactor(p.x, p.z);
              if (forestFactor < grow.inForest[0] || forestFactor > grow.inForest[1])
                continue;
            }

            if (!this.insideClearArea(clearAreas, p)) {
              if (grow.onSurface) p.y = WATER_LEVEL;
              p.y += grow.offset;
              const rotation: Quaternion = grow.chanceToUseGroundTilt <= 0.0 || random.random() > grow.chanceToUseGroundTilt
                // this is complete BS, but we don't use angles now
                ? { x, y: angle, z, w: 0 }
                : { ...normal, w: angle };
              const veg = {
                id: zoneVegetation.id,
                pos: p,
                rotation
              };
              placed = true;
            }
          }
          if (placed) ++placedNumber;
          if (placedNumber >= number) break;
        }
      }
    }
    random.setState(state);
  }

  private insideClearArea(areas: ClearArea[], point: Vector3): boolean {
    return areas.some(
      area => Math.abs(point.x - area.center.x) < area.radius
           && Math.abs(point.z - area.center.z) < area.radius
    );
  }
}
