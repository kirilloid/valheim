export class BitMap {
  private bits: Uint8Array;
  constructor(
    public readonly width: number,
    public readonly height: number,
    uintArray?: Uint8Array,
  ) {
    const size = width * height;
    const bytes = Math.ceil(size / 8);
    if (uintArray != null) {
      if (uintArray.length !== bytes) throw new RangeError(`Incorrect array provided for bitmap, expected = ${bytes}, actual = ${uintArray.length}`);
      this.bits = uintArray;
    } else {
      this.bits = new Uint8Array(bytes);
    }
  }

  private check(x: number, y: number): void {
    if (x < 0) throw new RangeError('reading x out of boundary: ' + x);
    if (x >= this.width) throw new RangeError('reading x out of boundary: ' + x);
    if (y < 0) throw new RangeError('reading y out of boundary: ' + y);
    if (y >= this.height) throw new RangeError('reading y out of boundary: ' + y);
  }

  get(x: number, y: number): boolean {
    this.check(x, y);
    const offset = y * this.width + x;
    const byte = offset >> 3;
    const bit = offset & 7;
    return ((this.bits[byte]! >> bit) & 1) !== 0;
  }

  set(x: number, y: number, value: boolean) {
    this.check(x, y);
    const offset = y * this.width + x;
    const byte = offset >> 3;
    const bit = offset & 7;
    if (value) {
      this.bits[byte] |= (1 << bit);
    } else {
      this.bits[byte] &= (255 & (1 << bit));
    }
  }
}

export function getMatchScore(template: BitMap, value: BitMap): number {
  let score = 0;
  for (let ty = 0; ty < template.height; ty++) {
    const vy = Math.round(ty * value.height / template.height);
    for (let tx = 0; tx < template.width; tx++) {
      const vx = Math.round(tx * value.width / template.width);
      const templateOn = template.get(tx, ty);
      const valueOn = value.get(vx, vy);
      const delta = valueOn
        ? (templateOn ? +1 : -100)
        : 0;
      score += delta;
    }
  }
  return score;
}