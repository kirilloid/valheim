import { Biome, BiomeArea, WorldGenerator } from './world-generator';
import { lerp, Vector2i, Vector3 } from './utils';
import { WATER_LEVEL, ZONE_SIZE } from './game';

export class Heightmap {
  private cornerBiomes: [Biome, Biome, Biome, Biome] = [-1, -1, -1, -1];
  private oceanDepth: [number, number, number, number];
  private sector: Vector2i;

  constructor(
    private worldGenerator: WorldGenerator,
    point: Vector3,
  ) {
    const x = Math.round(point.x / ZONE_SIZE);
    const y = Math.round(point.z / ZONE_SIZE);
    this.sector = { x, y };
    this.cornerBiomes = [
      this.worldGenerator.getBiome(x * ZONE_SIZE, y * ZONE_SIZE),
      this.worldGenerator.getBiome((x + 1) * ZONE_SIZE, y * ZONE_SIZE),
      this.worldGenerator.getBiome(x * ZONE_SIZE, (y + 1) * ZONE_SIZE),
      this.worldGenerator.getBiome((x + 1) * ZONE_SIZE, (y + 1) * ZONE_SIZE),
    ];
    this.oceanDepth = [
      this.worldGenerator.getHeight((x - 0.5) * ZONE_SIZE, (y + 0.5) * ZONE_SIZE),
      this.worldGenerator.getHeight((x + 0.5) * ZONE_SIZE, (y + 0.5) * ZONE_SIZE),
      this.worldGenerator.getHeight((x + 0.5) * ZONE_SIZE, (y - 0.5) * ZONE_SIZE),
      this.worldGenerator.getHeight((x - 0.5) * ZONE_SIZE, (y - 0.5) * ZONE_SIZE),
    ];
    this.oceanDepth[0] = Math.max(0, this.oceanDepth[0] - WATER_LEVEL);
    this.oceanDepth[1] = Math.max(0, this.oceanDepth[1] - WATER_LEVEL);
    this.oceanDepth[2] = Math.max(0, this.oceanDepth[2] - WATER_LEVEL);
    this.oceanDepth[3] = Math.max(0, this.oceanDepth[3] - WATER_LEVEL);
  };

  getBiome(point: Vector3): Biome {
    // return this.worldGenerator.getBiome(point.x, point.z);
    if (this.cornerBiomes[0] == this.cornerBiomes[1]
     && this.cornerBiomes[0] == this.cornerBiomes[2]
     && this.cornerBiomes[0] == this.cornerBiomes[3]) {
      return this.cornerBiomes[0];
    }
    const x = (point.x / ZONE_SIZE) - this.sector.x + 0.5;
    const y = (point.z / ZONE_SIZE) - this.sector.y + 0.5;
    const tempBiomeWeights = [0, 0, 0, 0];
    tempBiomeWeights[0] += this.distance(x, y, 0, 0);
    tempBiomeWeights[1] += this.distance(x, y, 1, 0);
    tempBiomeWeights[2] += this.distance(x, y, 0, 1);
    tempBiomeWeights[3] += this.distance(x, y, 1, 1);
    let bestIndex = 0;
    let bestWeight = -99999;
    for (let index = 0; index < 4; ++index) {
      if (tempBiomeWeights[index]! > bestWeight) {
        bestIndex = index;
        bestWeight = tempBiomeWeights[index]!;
      }
    }
    return this.cornerBiomes[bestIndex]!;
  }

  getBiomeArea(): BiomeArea {
    return this.isBiomeEdge() ? BiomeArea.Edge : BiomeArea.Median;
  }

  getOceanDepth(point: Vector3): number {
    const x = Math.round(point.x - this.sector.x * ZONE_SIZE) + ZONE_SIZE / 2;
    const y = Math.round(point.z - this.sector.y * ZONE_SIZE) + ZONE_SIZE / 2;
    const t1 = x / ZONE_SIZE;
    const t2 = y / ZONE_SIZE;
    return lerp(
      lerp(this.oceanDepth[3], this.oceanDepth[2], t1),
      lerp(this.oceanDepth[0], this.oceanDepth[1], t1),
      t2,
    );
  }

  public isBiomeEdge(): boolean {
    return this.cornerBiomes[0] != this.cornerBiomes[1]
        || this.cornerBiomes[0] != this.cornerBiomes[2]
        || this.cornerBiomes[0] != this.cornerBiomes[3];
  }

  private distance(x: number, y: number, rx: number, ry: number): number {
    const num3 = 1.414 - Math.hypot(x - rx, y - ry);
    return num3 * num3 * num3;
  }

}