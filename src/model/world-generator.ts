import { random } from './random';
import { clamp01, lerp, lerpStep, smoothStep, Vector3 } from './utils';
import { perlinNoise, fbm } from './perlin';
import { WORLD_RADIUS, ZONE_SIZE } from './game';

const INT_MIN_VAL = 1 << 31;
const INT_MAX_VAL = ((1 << 31) >>> 0) - 1;

enum BiomeArea {
  Edge = 1,
  Median = 2,
  Everything = 3,
};

export enum Biome {
  Meadows,
  BlackForest,
  Swamp,
  Mountain,
  Plains,
  Ocean,
  Mistlands,
  Ashlands,
  DeepNorth,
};

class Vector2 {
  static ZERO = new Vector2(0, 0);
  constructor(public x: number, public y: number) {}
  mul(m: number): Vector2 {
    return new Vector2(this.x * m, this.y * m);
  }
  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }
  normalized(): Vector2 {
    const length = Math.hypot(this.x, this.y);
    return this.mul(1 / length);
  }
  mid(v: Vector2): Vector2 {
    return new Vector2(
      (this.x + v.x) / 2,
      (this.y + v.y) / 2,
    );
  }
  distance(v: Vector2): number {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }
  equal(v: Vector2): boolean {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy < 1e-10;
  }
}
type RiverPoint = {
  p: Vector2;
  w: number;
  w2: number;
};
type River = {
  p0: Vector2;
  p1: Vector2;
  center: Vector2;
  widthMin: number;
  widthMax: number;
  curveWidth: number;
  curveWavelength: number;
};

class PointMap {
  private bucketSize: number;
  private bucketNr: number;
  private buckets: number[][][];
  private size: number;
  constructor(maxRange: number) {
    this.bucketSize = maxRange;
    this.bucketNr = Math.ceil(20000 / maxRange);
    this.buckets = Array.from({ length: this.bucketNr }, () => Array.from({ length: this.bucketNr }, () => []));
    this.size = 0;
  }

  private cc(val: number): number {
    return Math.floor((val + 10000) / this.bucketSize);
  }

  private getBucket(point: Vector2): number[] {
    const { x, y } = point;
    return this.buckets[this.cc(y)]![this.cc(x)]!;
  }

  private updatePointIndex(point: Vector2, indexFrom: number, indexTo: number): void {
    const bucket = this.getBucket(point);
    const indexInBucket = bucket.indexOf(indexFrom);
    if (indexInBucket !== -1) {
      bucket[indexInBucket] = indexTo;
    }
  }

  private removePointIndex(point: Vector2, index: number): void {
    const bucket = this.getBucket(point);
    const indexInBucket = bucket.indexOf(index);
    if (indexInBucket === -1) return; // ERRROR!
    if (indexInBucket === bucket.length - 1) {
      bucket.pop();
    } else {
      bucket[indexInBucket] = bucket.pop()!;
    }
  }

  public add(point: Vector2): void {
    this.getBucket(point).push(this.size++);
  }

  public merge(points: Vector2[]): Vector2[] {
    const vector2List: Vector2[] = [];
    points.forEach(this.add, this);
    let startIndex = 0;
    while (startIndex < points.length) {
      let p = points[startIndex++]!;
      while (startIndex < points.length) {
        const closest = this.findClosest(points, p, startIndex);
        if (closest === -1) break;
        p = p.mid(points[closest]!);
        const endIdx = points.length - 1;
        if (closest === endIdx) {
          this.removePointIndex(points.pop()!, endIdx);  
        } else {
          this.removePointIndex(points[closest]!, closest);
          points[closest] = points.pop()!;
          this.updatePointIndex(points[closest]!, endIdx, closest);
        }
      }
      vector2List.push(p);
    }
    return vector2List;
  }

  private findClosest(points: Vector2[], p: Vector2, minIndex: number): number {
    // walk through others in order
    const hashX = this.cc(p.x);
    const hashY = this.cc(p.y);
    const indices = [];
    for (let by = Math.max(hashY - 1, 0); by <= Math.min(hashY + 1, this.bucketNr - 1); by++) {
      for (let bx = Math.max(hashX - 1, 0); bx <= Math.min(hashX + 1, this.bucketNr - 1); bx++) {
        indices.push(...this.buckets[by]![bx]!);
      }
    }

    let bestIndex = -1;
    let bestDistance2 = 99999.0 ** 2;
    for (const index of indices) {
      const point = points[index]!;
      if (index < minIndex) continue;
      if (point === p) continue;
      const distance2 = (p.x - point.x) ** 2 + (p.y - point.y) ** 2;
      if (distance2 >= this.bucketSize * this.bucketSize) continue;
      if (distance2 < bestDistance2
      || (distance2 === bestDistance2 && index < bestIndex)) {
        bestIndex = index;
        bestDistance2 = distance2;
      }
    }
    return bestIndex;
  }
}

export class WorldGenerator {
  offset0: number;
  offset1: number;
  offset2: number;
  offset3: number;
  offset4: number;
  riverSeed: number;
  streamSeed: number;
  
  private _mountains: Vector2[] = [];
  private _lakes: Vector2[] = [];
  private _rivers: River[] = [];
  private _streams: River[] = [];

  _riverPoints = new Map<number, RiverPoint[]>();
  _cachedRiverPoints: RiverPoint[] = [];
  _cachedRiverGrid = new Vector2(-999999, -999999);

  private readonly minMountainDistance = 1000;

  private _biomeAreas = new Uint8Array(313 * 313);

  constructor(seed: number) {
    const state = random.getState();
    random.init(seed);
    
    this.offset0 = random.rangeInt(-10000, 10000);
    this.offset1 = random.rangeInt(-10000, 10000);
    this.offset2 = random.rangeInt(-10000, 10000);
    this.offset3 = random.rangeInt(-10000, 10000);
    this.riverSeed = random.rangeInt(INT_MIN_VAL, INT_MAX_VAL);
    this.streamSeed = random.rangeInt(INT_MIN_VAL, INT_MAX_VAL);
    this.offset4 = random.rangeInt(-10000, 10000);
    this.pregenerate();
    random.setState(state);
  }

  private pregenerate(): void {
    this.findMountainsAndLakes();
    this._rivers = this.placeRivers();
    this._streams = this.placeStreams();
    this._calculateBiomeAreas();
  }

  private _calculateBiomeAreas() {
    const time = Date.now();
    const OUTER_SIZE_2 = Math.ceil((10000 / ZONE_SIZE + Math.sqrt(2)) ** 2);
    const INNER_SIZE_2 = Math.ceil((10000 / ZONE_SIZE) ** 2);
    const biomes = new Uint8Array(315 * 315);
    for (let y = -157; y <= 157; y++) {
      for (let x = -157; x <= 157; x++) {
        if (x * x + y * y > OUTER_SIZE_2) continue;
        biomes[(y + 157) * 315 + x + 157] = this.getBiome(x * 64, y * 64);
      }
    }
    for (let y = -156; y <= 156; y++) {
      for (let x = -156; x <= 156; x++) {
        if (x * x + y * y > INNER_SIZE_2) continue;
        const pos = (y + 157) * 315 + x + 157;
        const DY = 315;
        const DX = 1;
        const adjacentBiomes = new Set([
          biomes[pos],
          biomes[pos - DX - DY],
          biomes[pos + DX - DY],
          biomes[pos + DX + DY],
          biomes[pos - DX + DY],
          biomes[pos - DX],
          biomes[pos + DX],
          biomes[pos - DY],
          biomes[pos + DY],
        ])
        this._biomeAreas[(y + 156) * 313 + x + 156] =
          adjacentBiomes.size === 1 ? BiomeArea.Median : BiomeArea.Edge;
      }
    }
    // console.info(`Pre-calculated biome areas in ${Date.now() - time}ms`);
  }

  private findMountainsAndLakes(): void {
    for (let y = -10000; y <= 10000; y += 128) {
      for (let x = -10000; x <= 10000; x += 128) {
        if (x * x + y * y > 100e6) continue;
        const baseHeight = this.getBaseHeight(x, y);
        if (baseHeight > 0.45) {
          this._mountains.push(new Vector2(x, y));
        } else if (baseHeight < 0.05) {
          this._lakes.push(new Vector2(x, y));
        }
      }
    }
    this._mountains = this.mergePoints(this._mountains, 800);
    this._lakes = this.mergePoints(this._lakes, 800);
  }

  private mergePoints(points: Vector2[], range: number): Vector2[] {
    const pointMap = new PointMap(range);
    return pointMap.merge(points);
  }

  private placeStreams(): River[] {
    const state = random.getState();
    random.init(this.streamSeed);
    const rivers: River[] = [];
    // const time = Date.now();
    for (let index = 0; index < 3000; ++index) {
      let p0: Vector2 | undefined = Vector2.ZERO;
      let p1: Vector2 | undefined = Vector2.ZERO;
      if ((p0 = this.findStreamStartPoint(100, 26, 31))
      &&  (p1 = this.findStreamEndPoint(100, 36, 44, p0, 80, 200))) {
        const mid: Vector2 = p0.mid(p1);
        const height = this.getHeight(mid.x, mid.y);
        if (height >= 26 && height <= 44) {
          const distance = p0.distance(p1);
          const river: River = {
            p0,
            p1,
            center: mid,
            widthMax: 20,
            widthMin: 20,
            curveWidth: distance / 15,
            curveWavelength: distance / 20,
          };
          rivers.push(river);
        }
      }
    }
    this.renderRivers(rivers);
    random.setState(state);
    return rivers;
  }

  private findStreamEndPoint(
    iterations: number,
    minHeight: number,
    maxHeight: number,
    start: Vector2,
    minLength: number,
    maxLength: number,
  ): Vector2 | undefined {
    const dt = (maxLength - minLength) / iterations;
    let t = maxLength;
    for (let index = 0; index < iterations; ++index) {
      t -= dt;
      const f = random.rangeFloat(0, 2 * Math.PI);
      const vector2 = start.add(new Vector2(Math.sin(f), Math.cos(f)).mul(t));
      const height = this.getHeight(vector2.x, vector2.y);
      if (height > minHeight && height < maxHeight) {
        return vector2;
      }
    }
  }

  private findStreamStartPoint(
    iterations: number,
    minHeight: number,
    maxHeight: number,
  ): Vector2 | undefined {
    for (let index = 0; index < iterations; ++index) {
      const x = random.rangeFloat(-10000, 10000);
      const y = random.rangeFloat(-10000, 10000);
      const height = this.getHeight(x, y);
      if (minHeight < height && height < maxHeight) {
        return new Vector2(x, y);
      }
    }
  }

  private placeRivers(): River[] {
    const state = random.getState();
    random.init(this.riverSeed);
    // const time = Date.now();
    const rivers: River[] = [];
    const copy = [...this._lakes];
    while (copy.length > 1) {
      const vector2 = copy[0]!;
      let randomRiverEnd = this.findRandomRiverEnd(rivers, this._lakes, vector2, 2000, 0.4, 128);
      if (randomRiverEnd === -1 && !this.haveRiver1(rivers, vector2)) {
        randomRiverEnd = this.findRandomRiverEnd(rivers, this._lakes, vector2, 5000, 0.4, 128);
      }
      if (randomRiverEnd !== -1) {
        const p0 = vector2;
        const p1 = this._lakes[randomRiverEnd]!;
        const widthMax = random.rangeFloat(60, 100);
        const widthMin = random.rangeFloat(60, widthMax);
        const size = p0.distance(p1);
        rivers.push({
          p0,
          p1,
          center: p0.mid(p1),
          widthMin,
          widthMax,
          curveWidth: size / 15,
          curveWavelength: size / 20,
        });
      } else {
        copy.shift();
      }
    }
    this.renderRivers(rivers);
    // const timeSpan = Date.now() - time;
    random.setState(state);
    return rivers;
  }

  private findClosestRiverEnd(
    rivers: River[],
    points: Vector2[],
    p: Vector2,
    maxDistance: number,
    heightLimit: number,
    checkStep: number
  ): number {
    let bestIndex = -1;
    let bestDistance = 99999;
    for (const [index, point] of points.entries()) {
      if (points[index] === p) continue;
      const distance = p.distance(point);
      if (distance < maxDistance && distance < bestDistance
      && !this.haveRiver2(rivers, p, point)
      && this.isRiverAllowed(p, point, checkStep, heightLimit)) {
        bestIndex = index;
        bestDistance = distance;
      }
    }
    return bestIndex;
  }

  private findRandomRiverEnd(
    rivers: River[],
    points: Vector2[],
    p: Vector2,
    maxDistance: number,
    heightLimit: number,
    checkStep: number
  ): number {
    const indexList: number[] = [];
    for (const [index, point] of points.entries()) {
      const distance = p.distance(point);
      if (distance > 1e-5
      && distance < maxDistance
      && !this.haveRiver2(rivers, p, point)
      && this.isRiverAllowed(p, point, checkStep, heightLimit)) {
        indexList.push(index);
      }
    }
    return indexList.length === 0 ? -1 : indexList[random.rangeInt(0, indexList.length)]!;
  }

  private haveRiver1(rivers: River[], point: Vector2): boolean {
    return rivers.some(
      r => r.p0.equal(point)
        || r.p1.equal(point)
    );
  }

  private haveRiver2(rivers: River[], p0: Vector2, p1: Vector2): boolean {
    return rivers.some(
      r => (r.p0.equal(p0) && r.p1.equal(p1))
        || (r.p0.equal(p1) && r.p1.equal(p0))
    );
  }

  private isRiverAllowed(p0: Vector2, p1: Vector2, step: number, heightLimit: number): boolean {
    const distance = p0.distance(p1);
    const normalized = p1.sub(p0).normalized();
    let flag: boolean = true;
    for (let num2 = step; num2 <= distance - step; num2 += step) {
      const vector2 = p0.add(normalized.mul(num2));
      const baseHeight = this.getBaseHeight(vector2.x, vector2.y);
      if (baseHeight > heightLimit) return false;
      if (baseHeight > 0.05) flag = false;
    }
    return !flag;
  }

  private renderRivers(rivers: River[]): void {
    // const time = Date.now();
    const riverPoints = new Map<number, RiverPoint[]>();
    for (const river of rivers) {
      const width8 = river.widthMin / 8;
      const normalized = river.p1.sub(river.p0).normalized();
      const vector2 = new Vector2(-normalized.y, normalized.x);
      const num2 = river.p0.distance(river.p1);
      for (let num3 = 0.0; num3 <= num2; num3 += width8) {
        const f = num3 / river.curveWavelength;
        const num4 = Math.sin(f) * Math.sin(f * 0.63412) * Math.sin(f * 0.33412) * river.curveWidth;
        const r = random.rangeFloat(river.widthMin, river.widthMax);
        const p = river.p0.add(normalized.mul(num3)).add(vector2.mul(num4));
        this.addRiverPoint(riverPoints, p, r, river);
      }
    }
    for (const [key, rp] of riverPoints.entries()) {
      const riverPointArray = this._riverPoints.get(key);
      if (riverPointArray != null) {
        riverPointArray.push(...rp);
      } else {
        this._riverPoints.set(key, rp);
      }
    }
    // const timeSpan = Date.now() - time;
  }

  private addRiverPoint(
    riverPoints: Map<number, RiverPoint[]>,
    p: Vector2,
    r: number,
    river: River,
  ): void {
    const riverGrid = this.getRiverGrid(p.x, p.y);
    const num = Math.ceil(r / 64);
    for (let _y = riverGrid.y - num; _y <= riverGrid.y + num; ++_y) {
      for (let _x = riverGrid.x - num; _x <= riverGrid.x + num; ++_x) {
        const grid = new Vector2(_x, _y);
        if (this.insideRiverGrid(grid, p, r))
          this.addRiverPointWithGrid(riverPoints, grid, p, r, river);
      }
    }
  }

  private addRiverPointWithGrid(
    riverPoints: Map<number, RiverPoint[]>,
    gridPos: Vector2,
    p: Vector2,
    r: number,
    river: River,
  ): void {
    const key = gridPos.x + (gridPos.y << 8);
    const riverPointList = riverPoints.get(key);
    const rp = { p, w: r, w2: r * r };
    if (riverPointList != null) {
      riverPointList.push(rp);
    } else {
      riverPoints.set(key, [rp]);
    }
  }

  /// RIVERS
  public insideRiverGrid(grid: Vector2, p: Vector2, r: number): boolean {
    const x = p.x - grid.x * 64;
    const y = p.y - grid.y * 64;
    return Math.abs(x) < r + 32
        && Math.abs(y) < r + 32;
  }

  public getRiverGrid(wx: number, wy: number): Vector2 {
    return new Vector2(
      Math.round(wx / 64),
      Math.round(wy / 64),
    );
  }

  private getRiverWeight(wx: number, wy: number /*, out float weight, out float width*/): [number, number] {
    const riverGrid: Vector2 = this.getRiverGrid(wx, wy);
    // this._riverCacheLock.EnterReadLock();
    if (riverGrid === this._cachedRiverGrid) {
      if (this._cachedRiverPoints != null) {
        return this.getWeight(this._cachedRiverPoints, wx, wy);
      } else {
        return [0, 0];
      }
      // this.m_riverCacheLock.ExitReadLock();
    } else {
      // this.m_riverCacheLock.ExitReadLock();
      const key = riverGrid.x + (riverGrid.y << 8);
      const points = this._riverPoints.get(key);
      if (points != null) {
        const result = this.getWeight(points, wx, wy);
        // this._riverCacheLock.EnterWriteLock();
        this._cachedRiverGrid = riverGrid;
        this._cachedRiverPoints = points;
        // this._riverCacheLock.ExitWriteLock();
        return result;
      } else {
        // this._riverCacheLock.EnterWriteLock();
        this._cachedRiverGrid = riverGrid;
        this._cachedRiverPoints = [];
        // this.m_riverCacheLock.ExitWriteLock();
        return [0, 0];
      }
    }
  }
  
  private getWeight(points: RiverPoint[], wx: number, wy: number): [number, number] {
    let weight = 0;
    let width = 0;
    let num1 = 0;
    let num2 = 0;
    for (const point of points) {
      const f = (point.p.x - wx) ** 2 + (point.p.y - wy) ** 2;
      if (f < point.w2) {
        const num4 = (1.0 - Math.sqrt(f) / point.w);
        if (num4 > weight) weight = num4;
        num1 += point.w * num4;
        num2 += num4;
      }
    }
    if (num2 <= 0.0) return [weight, width];
    width = num1 / num2;
    return [weight, width]
  }

  public getBiomeArea(x: number, y: number): BiomeArea {
    return this._biomeAreas[(y + 156) * 313 + x + 156]!;
  }

  public getBiome(wx: number, wy: number): Biome {
    const magnitude2 = wx * wx + wy * wy;
    const baseHeight = this.getBaseHeight(wx, wy);
    const angle = this.worldAngle(wx, wy) * 100;
    if (wx * wx + (wy - 4000) * (wy - 4000) > (12e3 + angle) ** 2)
      return Biome.Ashlands;
    if (baseHeight <= 0.02)
      return Biome.Ocean;
    if (wx * wx + (wy + 4000) * (wy + 4000) > (12e3 + angle) ** 2)
      return baseHeight > 0.4 ? Biome.Mountain : Biome.DeepNorth;
    if (baseHeight > 0.4)
      return Biome.Mountain;
    if (perlinNoise((this.offset0 + wx) * 0.001, (this.offset0 + wy) * 0.001) > 0.6
      && magnitude2 > 2e3 ** 2 && magnitude2 < 8e3 ** 2
      && baseHeight > 0.05 && baseHeight < 0.25)
      return Biome.Swamp;
    if (perlinNoise((this.offset4 + wx) * 0.001, (this.offset4 + wy) * 0.001) > 0.5
      && magnitude2 > (6e3 + angle) * (6e3 + angle)
      && magnitude2 < 10e3 ** 2)
      return Biome.Mistlands;
    if (perlinNoise((this.offset1 + wx) * 0.001, (this.offset1 + wy) * 0.001) > 0.4
      && magnitude2 > (3e3 + angle) * (3e3 + angle)
      && magnitude2 < 8e3 ** 2)
      return Biome.Plains;
    return (perlinNoise((this.offset2 + wx) * 0.001, (this.offset2 + wy) * 0.001) > 0.4
      && magnitude2 > (600 + angle) * (600 + angle)
      && magnitude2 < 6e3 ** 2)
      || magnitude2 > (5e3 + angle) * (5e3 + angle)
        ? Biome.BlackForest
        : Biome.Meadows;
    }

  private worldAngle(wx: number, wy: number): number {
    return Math.sin(Math.atan2(wx, wy) * 20);
  }
  
  private getBaseHeight(wx: number, wy: number): number {
    const distance = Math.hypot(wx, wy);
    wx += 100000 + this.offset0;
    wy += 100000 + this.offset1;
    const base = perlinNoise(wx * 0.001, wy * 0.001) * perlinNoise(wx * 0.0015, wy * 0.0015);
    const base2 = base + perlinNoise(wx * 0.002, wy * 0.002) * perlinNoise(wx * 0.003, wy * 0.003) * base * 0.9;
    let result = (base2 + perlinNoise(wx * 0.005, wy * 0.005) * perlinNoise(wx * 0.01, wy * 0.01) * 0.5 * base2 - 0.07)
      * (1 - (1 - lerpStep(
        0.02,
        0.12,
        Math.abs(
          perlinNoise(wx * 0.0005 + 0.123, wy * 0.0005 + 0.15123) -
          perlinNoise(wx * 0.0005 + 0.321, wy * 0.0005 + 0.231)
        )
      )) * smoothStep(744, 1000, distance));
    if (distance > 10000) {
      const t1 = lerpStep(10000, WORLD_RADIUS, distance);
      result = lerp(result, -0.2, t1);
      let l = 10490;
      if (distance > l) {
        const t2 = lerpStep(l, WORLD_RADIUS, distance);
        result = lerp(result, -2, t2);
      }
    }
    if (distance < this.minMountainDistance && result > 0.28) {
      result = lerp(
        lerp(0.28, 0.38, clamp01((result - 0.28) * 10)),
        result,
        lerpStep(this.minMountainDistance - 400, this.minMountainDistance, distance)
      );
    }
    return result;
  }

  private addRivers(wx: number, wy: number, h: number): number {
    let [weight, width] = this.getRiverWeight(wx, wy);
    if (weight <= 0.0) return h;
    const t1 = lerpStep(20, 60, width);
    const b1 = lerp(0.14, 0.12, t1);
    const b2 = lerp(0.139, 0.128, t1);
    if (h > b1) h = lerp(h, b1, weight);
    if (h > b2) {
      const t2 = lerpStep(0.85, 1, weight);
      h = lerp(h, b2, t2);
    }
    return h;
  }

  public getHeight(wx: number, wy: number) {
    return this.getBiomeHeight(this.getBiome(wx, wy), wx, wy);
  }

  public getBiomeHeight(biome: Biome, wx: number, wy: number): number {
    switch (biome) {
      case Biome.Meadows:
        return this.getMeadowsHeight(wx, wy) * 200;
      case Biome.BlackForest:
        return this.getForestHeight(wx, wy) * 200;
      case Biome.Swamp:
        return this.getMarshHeight(wx, wy) * 200;
      case Biome.Mountain:
        return this.getSnowMountainHeight(wx, wy) * 200;
      case Biome.Plains:
        return this.getPlainsHeight(wx, wy) * 200;
      case Biome.Ocean:
        return this.getOceanHeight(wx, wy) * 200;
      case Biome.Mistlands:
        return this.getForestHeight(wx, wy) * 200;
      case Biome.Ashlands:
        return this.getAshlandsHeight(wx, wy) * 200;
      case Biome.DeepNorth:
        return this.getDeepNorthHeight(wx, wy) * 200;
      default:
        return 0.0;
    }
  }

  private getMarshHeight(wx1: number, wy1: number): number {
    const wx = wx1 + 100000;
    const wy = wy1 + 100000;
    const baseHeight = 0.137;
    const base = perlinNoise(wx * 0.04, wy * 0.04) * perlinNoise(wx * 0.08, wy * 0.08);
    const h = baseHeight + base * 0.03;
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx * 0.1, wy * 0.1) * 0.01
      + perlinNoise(wx * 0.4, wy * 0.4) * 0.003;
  }

  private getMeadowsHeight(wx1: number, wy1: number): number {
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const wx = wx1 + 100000 + this.offset3;
    const wy = wy1 + 100000 + this.offset3;
    const base = perlinNoise(wx * 0.01, wy * 0.01) * perlinNoise(wx * 0.02, wy * 0.02);
    const base2 = base + perlinNoise(wx * 0.05, wy * 0.05) * perlinNoise(wx * 0.1, wy * 0.1) * base * 0.5;
    let h = baseHeight + base2 * 0.1;
    const num3 = h - 0.15;
    const num4 = clamp01(baseHeight / 0.4);
    if (num3 > 0) h -= (num3 * (1 - num4) * 0.75);
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx * 0.1, wy * 0.1) * 0.01
      + perlinNoise(wx * 0.4, wy * 0.4) * 0.003;
  }

  private getForestHeight(wx1: number, wy1: number): number {
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const base = perlinNoise(wx2 * 0.01, wy2 * 0.01) * perlinNoise(wx2 * 0.02, wy2 * 0.02);
    const base2 = base + perlinNoise(wx2 * 0.05, wy2 * 0.05) * perlinNoise(wx2 * 0.1, wy2 * 0.1) * base * 0.5;
    const h = baseHeight + base2 * 0.1;
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx2 * 0.1, wy2 * 0.1) * 0.01
      + perlinNoise(wx2 * 0.4, wy2 * 0.4) * 0.003;
  }

  private getPlainsHeight(wx1: number, wy1: number): number {
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const base = perlinNoise(wx2 * 0.01, wy2 * 0.01) * perlinNoise(wx2 * 0.02, wy2 * 0.02);
    const base2 = base + perlinNoise(wx2 * 0.05, wy2 * 0.05) * perlinNoise(wx2 * 0.1, wy2 * 0.1) * base * 0.5;
    let h = baseHeight + base2 * 0.1;
    const num3 = h - 0.15;
    const num4 = clamp01(baseHeight / 0.4);
    if (num3 > 0) h -= (num3 * (1 - num4) * 0.75);
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx2 * 0.1, wy2 * 0.1) * 0.01
      + perlinNoise(wx2 * 0.4, wy2 * 0.4) * 0.003;
  }

  private getAshlandsHeight(wx1: number, wy1: number): number {
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const base = perlinNoise(wx2 * 0.01, wy2 * 0.01) * perlinNoise(wx2 * 0.02, wy2 * 0.02);
    const base2 = base + perlinNoise(wx2 * 0.05, wy2 * 0.05) * perlinNoise(wx2 * 0.1, wy2 * 0.1) * base * 0.5;
    const h = baseHeight + base2 * 0.1
      + 0.1
      + perlinNoise(wx2 * 0.1, wy2 * 0.1) * 0.01
      + perlinNoise(wx2 * 0.4, wy2 * 0.4) * 0.003;
    return this.addRivers(wx1, wy1, h);
  }

  private getSnowMountainHeight(wx1: number, wy1: number): number {
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const baseHeight2 = (2 * baseHeight - 0.4);
    const tilt = this.baseHeightTilt(wx1, wy1);
    const base = perlinNoise(wx2 * 0.01, wy2 * 0.01) * perlinNoise(wx2 * 0.02, wy2 * 0.02);
    const base2 = base + perlinNoise(wx2 * 0.05, wy2 * 0.05) * perlinNoise(wx2 * 0.1, wy2 * 0.1) * base * 0.5;
    const h = baseHeight2 + base2 * 0.2;
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx2 * 0.1, wy2 * 0.1) * 0.01
      + perlinNoise(wx2 * 0.4, wy2 * 0.4) * 0.003
      + perlinNoise(wx2 * 0.2, wy2 * 0.2) * 2 * tilt;
  }

  private getDeepNorthHeight(wx1: number, wy1: number): number {
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const num2 = baseHeight + Math.max(0.0, baseHeight - 0.4);
    const base = perlinNoise(wx2 * 0.01, wy2 * 0.01) * perlinNoise(wx2 * 0.02, wy2 * 0.02);
    const base2 = base + (perlinNoise(wx2 * 0.05, wy2 * 0.05) * perlinNoise(wx2 * 0.1, wy2 * 0.1) * base * 0.5);
    const h = num2 + base2 * 0.2;
    return this.addRivers(wx1, wy1, h * 1.2)
      + perlinNoise(wx2 * 0.1, wy2 * 0.1) * 0.01
      + perlinNoise(wx2 * 0.4, wy2 * 0.4) * 0.003;
  }

  private getOceanHeight(wx: number, wy: number): number {
    return this.getBaseHeight(wx, wy);
  }

  public getForestFactor(wx: number, wy: number): number {
    return fbm(wx * 0.004, wy * 0.004);
  }

  public getTerrainDelta(center: Vector3, radius: number): number {
    let probes = 10;
    let maxHeight = -999999;
    let minHeight = +999999;
    for (let probe = 0; probe < probes; ++probe) {
      const { x, y } = random.insideUnitCircle();
      const wx = center.x + x * radius;
      const wy = center.z + y * radius;
      const height = this.getHeight(wx, wy);
      if (height < minHeight) minHeight = height;
      if (height > maxHeight) maxHeight = height;
    }
    return maxHeight - minHeight;
  }

  private baseHeightTilt(wx: number, wy: number): number {
    const baseHeight1 = this.getBaseHeight(wx - 1, wy);
    const baseHeight2 = this.getBaseHeight(wx + 1, wy);
    const baseHeight3 = this.getBaseHeight(wx, wy - 1);
    const baseHeight4 = this.getBaseHeight(wx, wy + 1);
    return Math.abs((baseHeight2 - baseHeight1)) + Math.abs(baseHeight3 - baseHeight4);
  }
}
