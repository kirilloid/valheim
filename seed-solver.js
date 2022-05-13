// @ts-check

/**
 * @param {number} value
 * @returns {Generator<[string, number]>}
 */
// function* findNextChar(value) {
//   for (const c of letters) {
//     if (((value ^ c.charCodeAt(0)) & 31) === 0) {
//       yield [c, (value ^ c.charCodeAt(0)) >> 5];
//     }
//   }
// }

/**
 * @param {number} value
 * @returns {string[]}
 */
// function sameHashDfs(value) {
//   /**
//    * @param {number} value
//    * @param {string[]} chars
//    * @returns {Generator<string[]>}
//    */
//   function* recursive(value, chars) {
//     for (const [c, newVal] of findNextChar(value)) {
//       if (newVal === 0) yield chars;
//       if (newVal < 128) {
//         const nc = String.fromCharCode(newVal);
//         if (letters.includes(nc)) yield [nc, c, ...chars];
//       } else {
//         yield* recursive(newVal, [c, ...chars]);
//       }
//     }
//   }
//   for (const r of recursive(value, [])) return r;
//   return [];
// }

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ023456789';

function randomStr() {
  let result = [];
  for (let i = 0; i < 10; i++) {
    result.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }
  return result.join('');
}

/**
 * @param {string} str
 * @returns {number}
 */
function stableHashCode(str) {
  let a = 5381;
  let b = a;
  for (let index = 0; index < str.length; index += 2) {
    a = (a << 5) + a ^ str.charCodeAt(index);
    if (index === str.length - 1) break;
    b = (b << 5) + b ^ str.charCodeAt(index + 1);
  }
  return (a + Math.imul(b, 1566083941)) >>> 0;
}

/** @param {string} str */
function semiHash(str) {
  let a = 5381;
  for (let index = 0; index < str.length; index++) {
    a = (a << 5) + a ^ str.charCodeAt(index);
  }
  return a;
}

/* INIT */

/** @template T */
class MegaIntMap {
  constructor() {
    /** @type {Map<number, T>[]} */
    this._buckets = Array.from(Array(65536), () => new Map());
  }

  /**
   * @param {number} key
   * @param {T} value
   */
  set(key, value) {
    this._buckets[key >>> 16].set(key & 65535, value);
  }

  /**
   * @param {number} key
   * @returns {T}
   */
  get(key) {
    return this._buckets[key >>> 16].get(key & 65535);
  }

  /** @returns {number} */
  get size() {
    return this._buckets.reduce((a, b) => a + b.size, 0);
  }

  /**
   * @returns {IterableIterator<[number, T]>}
   */
  entries() {
    return (function*(self) {
      for (const [hi, bucket] of self._buckets.entries()) {
        for (const [lo, value] of bucket) {
          yield [(hi << 16) | lo, value];
        }
      }
    }(this));
  }
}

/** @type {MegaIntMap<string>[]} */
const maps = [
  new MegaIntMap(),
  new MegaIntMap(),
  new MegaIntMap(),
  new MegaIntMap(),
  new MegaIntMap(),
  new MegaIntMap(),
];

for (const a of letters) {
  const str = a;
  maps[1].set(semiHash(str), str);
  for (const b of letters) {
    const str = a + b;
    maps[2].set(semiHash(str), str);
    for (const c of letters) {
      const str = a + b + c;
      maps[3].set(semiHash(str), str);
      for (const d of letters) {
        const str = a + b + c + d;
        maps[4].set(semiHash(str), str);
        for (const e of letters) {
          const str = a + b + c + d + e;
          maps[5].set(semiHash(str), str);
        }
      }
    }
  }
}

/**
 * @param {string} s1
 * @param {string} s2
 * @returns {string}
 */
function zip(s1, s2) {
  let result = '';
  for (let i = 0; i < s2.length; i++) result += s1[i] + s2[i];
  if (s1.length > s2.length) result += s1.at(-1);
  return result;
}

/**
 * @param {number} hash
 * @param {MegaIntMap<string>} mapLo
 * @param {MegaIntMap<string>} mapHi
 * @returns {string}
 */
function solveMaps(hash, mapLo, mapHi) {
  for (const [a, semi1] of mapHi.entries()) {
    // 1786162797 is divisor of 1566083941 mod 2^32
    const b = Math.imul(hash - a, 1786162797) >>> 0;
    const semi2 = mapHi.get(b) ?? mapLo.get(b);
    if (semi2 != null) {
      return zip(semi1, semi2);
    }
  }
  return '';
}

/**
 * @param {string} str
 * @returns {string}
 */
function solve(str) {
  const hash = stableHashCode(str);
  return solveMaps(hash, maps[1], maps[2])
      || solveMaps(hash, maps[2], maps[3])
      || solveMaps(hash, maps[3], maps[4])
      || solveMaps(hash, maps[4], maps[5])
}

// const lengths = new Map([0, 0,0,0,0,0, 0,0,0,0,0].map(i => [i, 0]));
// for (let i = 0; i < 1000; i++) {
//   const str = randomStr();
//   const length = solve(str).length;
//   lengths.set(length, lengths.get(length) + 1);
// }
// lengths;
