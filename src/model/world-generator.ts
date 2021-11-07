import { Random } from './random';
import { clamp01, lerp, lerpStep, smoothStep, stableHashCode } from './utils';
import { perlinNoise } from './perlin';

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


export class WorldGenerator {
  private _random: Random;

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

  _riverPoints = new Map<string, RiverPoint[]>();
  _cachedRiverPoints: RiverPoint[] = [];
  _cachedRiverGrid = new Vector2(-999999, -999999);

  private readonly minMountainDistance = 1000;

  constructor(seed: string) {
    const numSeed: number = stableHashCode(seed);
    this._random = new Random(numSeed);
    
    this.offset0 = this._random.range(-10000, 10000);
    this.offset1 = this._random.range(-10000, 10000);
    this.offset2 = this._random.range(-10000, 10000);
    this.offset3 = this._random.range(-10000, 10000);
    this.riverSeed = this._random.range(INT_MIN_VAL, INT_MAX_VAL);
    this.streamSeed = this._random.range(INT_MIN_VAL, INT_MAX_VAL);
    this.offset4 = this._random.range(-10000, 10000);
    this.pregenerate();
  }

  private pregenerate(): void {
    this.findMountainsAndLakes();
    this._rivers = this.placeRivers();
    this._streams = this.placeStreams();
  }

  private findMountainsAndLakes(): void {
    for (let y = -10000; y <= 10000; y += 128) {
      for (let x = -10000; x <= 10000; x += 128) {
        if (Math.hypot(x, y) > 10000) continue;
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
    const vector2List: Vector2[] = [];
    let startIndex = 0;
    while (startIndex < points.length) {
      let p = points[startIndex++]!;
      while (startIndex < points.length) {
        const index = this.findClosest(points, p, range, startIndex);
        if (index === points.length - 1) {

        }
        if (index === -1) break;
        p = p.mid(points[index]!);
        points[index] = points[points.length - 1]!;
        points.pop();
      }
      vector2List.push(p);
    }
    return vector2List;
  }

  private findClosest(points: Vector2[], p: Vector2, maxDistance: number, startIndex: number): number {
    let bestIndex = -1;
    let bestDistance = 99999.0;
    for (let index = startIndex; index < points.length; index++) {
      const point = points[index]!
      if (point == p) continue;
      const distance = Math.hypot(p.x - point.x, p.y - point.y);
      if (distance < maxDistance && distance < bestDistance) {
        bestIndex = index;
        bestDistance = distance;
      }
    }
    return bestIndex;
  }

  private placeStreams(): River[] {
    const state = this._random.getState();
    const rivers: River[] = [];
    // DateTime now = DateTime.Now;
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
            curveWidth: distance,
            curveWavelength: distance,
          };
          rivers.push(river);
        }
      }
    }
    this.renderRivers(rivers);
    this._random.setState(state);
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
    for (let index = 0; index < iterations; ++index) {
      const num2 = lerp(maxLength, minLength, (index + 1) / iterations);
      const f = this._random.range(0, Math.PI * 2);
      const vector2 = start.add(new Vector2(Math.sin(f), Math.cos(f)).mul(num2));
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
      const x = this._random.range(-10000, 10000);
      const y = this._random.range(-10000, 10000);
      const height = this.getHeight(x, y);
      if (minHeight < height && height < maxHeight) {
        return new Vector2(x, y);
      }
    }
  }

  private placeRivers(): River[] {
    const state = this._random.getState();
    this._random.init(this.riverSeed);
    // DateTime now = DateTime.Now;
    const rivers: River[] = [];
    const vector2List = [...this._lakes];
    while (vector2List.length > 1)
    {
      const vector2 = vector2List[0]!;
      let randomRiverEnd = this.findRandomRiverEnd(rivers, this._lakes, vector2, 2000, 0.4, 128);
      if (randomRiverEnd == -1 && !this.haveRiver1(rivers, vector2)) {
        randomRiverEnd = this.findRandomRiverEnd(rivers, this._lakes, vector2, 5000, 0.4, 128);
      }
      if (randomRiverEnd != -1) {
        const p0 = vector2;
        const p1 = this._lakes[randomRiverEnd]!;
        const widthMax = this._random.range(60, 100);
        const widthMin = this._random.range(60, widthMax);
        const length = p0.distance(p1);
        rivers.push({
          p0,
          p1,
          center: p0.mid(p1),
          widthMin,
          widthMax,
          curveWidth: length / 15,
          curveWavelength: length / 20,
        });
      } else {
        vector2List.shift();
      }
    }
    this.renderRivers(rivers);
    // TimeSpan timeSpan = DateTime.Now - now;
    this._random.setState(state);
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
      if (!(point == p) && p.distance(point) < maxDistance
      && !this.haveRiver2(rivers, p, point)
      && this.isRiverAllowed(p, point, checkStep, heightLimit)) {
        indexList.push(index);
      }
    }
    return indexList.length === 0 ? -1 : this._random.element(indexList);
  }

  private haveRiver1(rivers: River[], point: Vector2): boolean {
    return rivers.some(r => r.p0 === point || r.p1 === point);
  }

  private haveRiver2(rivers: River[], p0: Vector2, p1: Vector2): boolean {
    return rivers.some(r => r.p0 === p0 && r.p1 === p1
                         || r.p0 === p1 && r.p1 === p0);
  }

  private isRiverAllowed(p0: Vector2, p1: Vector2, step: number, heightLimit: number): boolean {
    const distance = p0.distance(p1);
    const normalized = p1.sub(p0).normalized();
    let flag: boolean = true;
    for (let num2 = step; num2 <= distance - step; num2 += step)
    {
      const vector2 = p0.add(normalized.mul(num2));
      const baseHeight = this.getBaseHeight(vector2.x, vector2.y);
      if (baseHeight > heightLimit) return false;
      if (baseHeight > 0.05) flag = false;
    }
    return !flag;
  }

  private renderRivers(rivers: River[]): void {
    // DateTime now = DateTime.Now;
    const riverPoints = new Map<string, RiverPoint[]>();
    for (const river of rivers) {
      const width8 = river.widthMin / 8;
      const normalized = river.p1.sub(river.p0).normalized();
      const vector2 = new Vector2(-normalized.y, normalized.x);
      const num2 = river.p0.distance(river.p1);
      for (let num3 = 0.0; num3 <= num2; num3 += width8) {
        const f = num3 / river.curveWavelength;
        const num4 = Math.sin(f) * Math.sin(f * 0.63412) * Math.sin(f * 0.33412) * river.curveWidth;
        const r = this._random.range(river.widthMin, river.widthMax);
        const p = river.p0.add(normalized.mul(num3)).add(vector2.mul(num4));
        this.addRiverPoint(riverPoints, p, r, river);
      }
    }
    for (const [key, rp] of riverPoints.entries()) {
      const riverPointArray = this._riverPoints.get(key);
      if (riverPointArray != null) {
        const riverPointList: RiverPoint[] = [...riverPointArray];
        riverPointList.push(...rp);
        this._riverPoints.get(key)
        this._riverPoints.set(key, riverPointList);
      }
      else
      {
        const array: RiverPoint[] = rp;
        this._riverPoints.set(key, array);
      }
    }
    // TimeSpan timeSpan = DateTime.Now - now;
  }

  private addRiverPoint(
    riverPoints: Map<string, RiverPoint[]>,
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
    riverPoints: Map<string, RiverPoint[]>,
    gridPos: Vector2,
    p: Vector2,
    r: number,
    river: River,
  ): void {
    const { x, y } = gridPos;
    const key = `${x}_${y}`;
    const riverPointList = riverPoints.get(key);
    const rp = { p, w: r, w2: r ** 2 };
    if (riverPointList != null) {
      riverPointList.push(rp);
    } else {
      riverPoints.set(key, [rp]);
    }
  }

  /// RIVERS
  public insideRiverGrid(grid: Vector2, p: Vector2, r: number): boolean {
    const vector2_1 = new Vector2(grid.x * 64, grid.y * 64);
    const vector2_2 = p.sub(vector2_1);
    return Math.abs(vector2_2.x) < r + 32.0
        && Math.abs(vector2_2.y) < r + 32.0;
  }

  public getRiverGrid(wx: number, wy: number): Vector2 {
    return new Vector2(
      Math.floor(wx / 64 + 0.5),
      Math.floor(wy / 64 + 0.5)
    );
  }

  private getRiverWeight(wx: number, wy: number /*, out float weight, out float width*/): [number, number] {
    const riverGrid: Vector2 = this.getRiverGrid(wx, wy);
    // this._riverCacheLock.EnterReadLock();
    if (riverGrid == this._cachedRiverGrid) {
      if (this._cachedRiverPoints != null) {
        return this.getWeight(this._cachedRiverPoints, wx, wy);
      } else {
        return [0, 0];
      }
      // this.m_riverCacheLock.ExitReadLock();
    } else {
      // this.m_riverCacheLock.ExitReadLock();
      const { x, y } = riverGrid;
      const key = `${x}_${y}`;
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
    for (let index = 0; index < points.length; ++index) {
      const point = points[index]!;
      const f = (point.p.x - wx) ** 2 + (point.p.y - wy) ** 2;
      if (f < point.w2) {
        const num3 = (1.0 - Math.sqrt(f) / point.w);
        if (num3 > weight) weight = num3;
        num1 += point.w * num3;
        num2 += num3;
      }
    }
    if (num2 <= 0.0) return [weight, width];
    width = num1 / num2;
    return [weight, width]
  }

  public getBiomeArea(x: number, y: number): BiomeArea {
    const biomes = new Set([
      this.getBiome(x,      y),
      this.getBiome(x - 64, y - 64),
      this.getBiome(x + 64, y - 64),
      this.getBiome(x + 64, y + 64),
      this.getBiome(x - 64, y + 64),
      this.getBiome(x - 64, y),
      this.getBiome(x + 64, y),
      this.getBiome(x,      y - 64),
      this.getBiome(x,      y + 64),
    ])
    return biomes.size === 1
      ? BiomeArea.Median
      : BiomeArea.Edge;
  }

  public getBiome(wx: number, wy: number): Biome {
    const magnitude = Math.hypot(wx, wy);
    const baseHeight = this.getBaseHeight(wx, wy);
    const num = this.worldAngle(wx, wy) * 100;
    if (Math.hypot(wx, wy - 4000) > 12000.0 + num)
      return Biome.Ashlands;
    if (baseHeight <= 0.02)
      return Biome.Ocean;
    if (Math.hypot(wx, wy + 4000) > 12000.0 + num)
      return baseHeight > 0.4 ? Biome.Mountain : Biome.DeepNorth;
    if (baseHeight > 0.4)
      return Biome.Mountain;
    if (perlinNoise(this.offset0 + wx, this.offset0 + wy, 0.001) > 0.6
    && magnitude > 2000 && magnitude < 8000
    && baseHeight > 0.05 && baseHeight < 0.25)
      return Biome.Swamp;
    if (perlinNoise(this.offset4 + wx, this.offset4 + wy, 0.001) > 0.5
    && magnitude > 6000 + num && magnitude < 10000)
      return Biome.Mistlands;
    if (perlinNoise(this.offset1 + wx, this.offset1 + wy, 0.001) > 0.4
    && magnitude > 3000 + num && magnitude < 8000)
      return Biome.Plains;
    return perlinNoise(this.offset2 + wx, this.offset2 + wy, 0.001) > 0.4
    && magnitude > 600 + num && magnitude < 6000 || magnitude > 5000 + num
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
    const base = perlinNoise(wx, wy, 0.002) * perlinNoise(wx, wy, 0.0015);
    const base2 = base + perlinNoise(wx, wy, 0.002) * perlinNoise(wx, wy, 0.003) * base * 0.9;
    let result = (base2 + perlinNoise(wx, wy, 0.005) * perlinNoise(wx, wy, 0.01) * 0.5 * base2 - 0.07)
      * (1 - (1 - lerpStep(
        0.02,
        0.12,
        Math.abs(
          perlinNoise(wx + 246, wy + 302.46, 0.0005) -
          perlinNoise(wx + 642, wy + 462, 0.0005)
        )
      )) * smoothStep(744, 1000, distance));
    if (distance > 10000) {
      const t1 = lerpStep(10000, 10500, distance);
      result = lerp(result, -0.2, t1);
      let l = 10490;
      if (distance > l) {
        const t2 = lerpStep(l, 10500, distance);
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
    const base = perlinNoise(wx, wy, 0.04) * perlinNoise(wx, wy, 0.08);
    const h = baseHeight + base * 0.03;
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx, wy, 0.1) * 0.01
      + perlinNoise(wx, wy, 0.4) * 0.003;
  }

  private getMeadowsHeight(wx1: number, wy1: number): number {
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const wx = wx1 + 100000 + this.offset3;
    const wy = wy1 + 100000 + this.offset3;
    const base = perlinNoise(wx, wy, 0.01) * perlinNoise(wx, wy, 0.02);
    const base2 = base + perlinNoise(wx, wy, 0.05) * perlinNoise(wx, wy, 0.1) * base * 0.5;
    let h = baseHeight + base2 * 0.1;
    const num3 = h - 0.15;
    const num4 = clamp01(baseHeight / 0.4);
    if (num3 > 0) h -= (num3 * (1 - num4) * 0.75);
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx, wy, 0.1) * 0.01
      + perlinNoise(wx, wy, 0.4) * 0.003;
  }

  private getForestHeight(wx1: number, wy1: number): number {
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const base = perlinNoise(wx2, wy2, 0.01) * perlinNoise(wx2, wy2, 0.02);
    const base2 = base + perlinNoise(wx2, wy2, 0.05) * perlinNoise(wx2, wy2, 0.1) * base * 0.5;
    const h = baseHeight + base2 * 0.1;
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx2, wy2, 0.1) * 0.01
      + perlinNoise(wx2, wy2, 0.4) * 0.003;
  }

  private getPlainsHeight(wx1: number, wy1: number): number {
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const base = perlinNoise(wx2, wy2, 0.01) * perlinNoise(wx2, wy2, 0.02);
    const base2 = base + perlinNoise(wx2, wy2, 0.05) * perlinNoise(wx2, wy2, 0.1) * base * 0.5;
    let h = baseHeight + base2 * 0.1;
    const num3 = h - 0.15;
    const num4 = clamp01(baseHeight / 0.4);
    if (num3 > 0) h -= (num3 * (1 - num4) * 0.75);
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx2, wy2, 0.1) * 0.01
      + perlinNoise(wx2, wy2, 0.4) * 0.003;
  }

  private getAshlandsHeight(wx1: number, wy1: number): number {
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const base = perlinNoise(wx2, wy2, 0.01) * perlinNoise(wx2, wy2, 0.02);
    const base2 = base + perlinNoise(wx2, wy2, 0.05) * perlinNoise(wx2, wy2, 0.1) * base * 0.5;
    const h = baseHeight + base2 * 0.1
      + 0.1
      + perlinNoise(wx2, wy2, 0.1) * 0.01
      + perlinNoise(wx2, wy2, 0.4) * 0.003;
    return this.addRivers(wx1, wy1, h);
  }

  private getSnowMountainHeight(wx1: number, wy1: number): number {
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const baseHeight2 = (2 * baseHeight - 0.4);
    const tilt = this.baseHeightTilt(wx1, wy1);
    const base = perlinNoise(wx2, wy2, 0.01) * perlinNoise(wx2, wy2, 0.02);
    const base2 = base + perlinNoise(wx2, wy2, 0.05) * perlinNoise(wx2, wy2, 0.1) * base * 0.5;
    const h = baseHeight2 + base2 * 0.2;
    return this.addRivers(wx1, wy1, h)
      + perlinNoise(wx2, wy2, 0.1) * 0.01
      + perlinNoise(wx2, wy2, 0.4) * 0.003
      + perlinNoise(wx2, wy2, 0.2) * 2 * tilt;
  }

  private getDeepNorthHeight(wx1: number, wy1: number): number {
    const wx2 = wx1 + 100000 + this.offset3;
    const wy2 = wy1 + 100000 + this.offset3;
    const baseHeight = this.getBaseHeight(wx1, wy1);
    const num2 = baseHeight + Math.max(0.0, baseHeight - 0.4);
    const base = perlinNoise(wx2, wy2, 0.01) * perlinNoise(wx2, wy2, 0.02);
    const base2 = base + (perlinNoise(wx2, wy2, 0.05) * perlinNoise(wx2, wy2, 0.1) * base * 0.5);
    const h = num2 + base2 * 0.2;
    return this.addRivers(wx1, wy1, h * 1.2)
      + perlinNoise(wx2, wy2, 0.1) * 0.01
      + perlinNoise(wx2, wy2, 0.4) * 0.003;
  }

  private getOceanHeight(wx: number, wy: number): number {
    return this.getBaseHeight(wx, wy);
  }

  private baseHeightTilt(wx: number, wy: number): number {
    const baseHeight1 = this.getBaseHeight(wx - 1, wy);
    const baseHeight2 = this.getBaseHeight(wx + 1, wy);
    const baseHeight3 = this.getBaseHeight(wx, wy - 1);
    const baseHeight4 = this.getBaseHeight(wx, wy + 1);
    return Math.abs((baseHeight2 - baseHeight1)) + Math.abs(baseHeight3 - baseHeight4);
  }
}
