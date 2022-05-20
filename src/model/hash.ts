const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ023456789';

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[n] = c;
}

export function crc32(str: string) {
  let crc = 0 ^ (-1);
  for (var i = 0; i < str.length; i++ ) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF]!;
  }
  return (crc ^ (-1)) | 0;
};

export function stableHashCode(str: string): number {
  let a = 5381;
  let b = a;
  for (let index = 0; index < str.length; index += 2) {
    a = (a << 5) + a ^ str.charCodeAt(index);
    if (index === str.length - 1) break;
    b = (b << 5) + b ^ str.charCodeAt(index + 1);
  }
  return (a + Math.imul(b, 1566083941)) | 0;
}

class MegaIntMap<T> {
  private _buckets: Map<number, T>[];

  constructor() {
    this._buckets = Array.from(Array(65536), () => new Map());
  }

  set(key: number, value: T) {
    this._buckets[key >>> 16]?.set(key & 65535, value);
  }

  get(key: number): T | undefined {
    return this._buckets[key >>> 16]?.get(key & 65535);
  }

  get size(): number {
    return this._buckets.reduce((a, b) => a + b.size, 0);
  }

  entries(): IterableIterator<[number, T]> {
    return (function*(self) {
      for (const [hi, bucket] of self._buckets.entries()) {
        for (const [lo, value] of bucket) {
          yield [(hi << 16) | lo, value];
        }
      }
    }(this));
  }
}

const map0 = new MegaIntMap<string>();
map0.set(5381, '');
const maps = {
  _data: [map0],
  get(numberOfLetters: number): MegaIntMap<string> {
    if (this._data.length > numberOfLetters) {
      return this._data[numberOfLetters]!;
    }
    const nextMap = new MegaIntMap<string>();
    for (const [k, v] of this.get(numberOfLetters - 1).entries()) {
      for (const c of letters) {
        nextMap.set(
          (k << 5) + k ^ c.charCodeAt(0),
          v + c,
        );
      }
    }
    this._data.push(nextMap);
    return nextMap;
  },
};

function zip(s1: string, s2: string): string {
  let result = '';
  for (let i = 0; i < s2.length; i++) result += s1[i]! + s2[i]!;
  if (s1.length > s2.length) result += s1.at(-1);
  return result;
}

function solveMaps(hash: number, chars: number): string {
  const mapEven = maps.get(chars);
  const mapOdd = maps.get(chars + 1);
  for (const [b, semi2] of mapEven.entries()) {
    const a = (hash - Math.imul(b, 1566083941)) >>> 0;
    const semi1 = mapOdd.get(a) ?? mapEven.get(a);
    if (semi1 != null) {
      return zip(semi1, semi2);
    }
  }
  return '';
}

export function solve(hash: number): string {
  return solveMaps(hash, 1)
      || solveMaps(hash, 2)
      || solveMaps(hash, 3)
      || solveMaps(hash, 4)
}
