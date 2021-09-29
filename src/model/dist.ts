import type { EntityId, GeneralDrop, SimpleDrop } from '../types';

export type Distribution = number[];
export type DropDist = Record<EntityId, Distribution>;

export function add(a: Distribution, b: Distribution, p: number = 0.5, q: number = 1 - p): Distribution {
  if (b.length > a.length) {
    [b, a] = [a, b];
    [q, p] = [p, q];
  }
  return a.map((v, i) => v * p + (b[i] ?? 0) * q);
}

export function sum(xs: Distribution[]): Distribution {
  const len = Math.max(...xs.map(x => x.length));
  const result: Distribution = [];
  for (let i = 0; i < len; i++) {
    const val = xs.reduce((a, b) => a + (b[i] ?? 0), 0);
    result.push(val);
  }
  return result;
}

export function scale(x: Distribution, m: number): Distribution {
  return x.map(v => v * m);
}

export function mul(a: Distribution, b: Distribution): Distribution {
  const len = a.length + b.length - 1; 
  const c = Array.from({ length: len }, () => 0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      c[i + j] += a[i]! * b[j]!;
    }
  }
  return c;
}

export function power(base: Distribution, n: number): Distribution {
  let result = [1];
  while (n) {
    if (n & 1) result = mul(result, base);
    base = mul(base, base);
    n >>= 1;
  }
  return result;
}

export function average(x: Distribution): number {
  return x.reduce((a, v, i) => a + v * i, 0);
}

export function percentile(x: Distribution, percent: number): number {
  let total = 0;
  const frac = percent / 100;
  if (frac > 0.5) {
    total = 1;
    for (let i = x.length-1; i >= 0; i--) {
      total -= x[i]!;
      if (total < frac) return i;
    }
  }
  for (let i = 0; i < x.length; i++) {
    total += x[i]!;
    if (total >= frac) return i;
  }
  return x.length - 1;
}

function linearDist(min: number, max: number): Distribution {
  const result: Distribution = [];
  const singleProb = 1 / (max - min + 1);
  for (let i = 0; i < min; i++) result.push(0);
  for (let i = min; i <= max; i++) result.push(singleProb);
  return result;
}

export function addDist(a: DropDist, b: DropDist): DropDist {
  const copy = { ...a };
  for (const [key, val] of Object.entries(b)) {
    if (key in copy) {
      copy[key] = mul(copy[key]!, val);
    } else {
      copy[key] = val;
    }
  }
  return copy;
}

export function distributeDropNoReturn(drop: GeneralDrop): DropDist {
  const { chance = 1, num: [min, max], options } = drop;
  const prob = chance / (max - min + 1);
  const numbers = new Map(options.map(op => [op, 0]));
  function walk(currentOptions: GeneralDrop['options'], remaining: number, probability: number) {
    const totalWeight = currentOptions.reduce((accumWeight, option) => accumWeight + (option.weight ?? 1), 0);
    for (const option of currentOptions) {
      const p = (option.weight ?? 1) / totalWeight;
      numbers.set(option, numbers.get(option)! + p * probability);
      if (remaining > 1) {
        walk(
          currentOptions.filter(op => op !== option),
          remaining - 1,
          probability * p
        );
      }
    }
  }
  for (let n = min; n <= max; n++) {
    if (n < options.length) {
      walk(options, n, prob);
    } else {
      options.forEach(option => {
        numbers.set(option, numbers.get(option)! + prob);
      });
    }
  }
  const result: DropDist = {};
  for (const op of options) {
    const avgStacks = numbers.get(op) ?? 0;
    const opNum = op.num ?? [1, 1];
    const dist = add(linearDist(...opNum), [1], avgStacks);
    result[op.item] = mul(result[op.item] ?? [1], dist);
  }
  return result;
}

export function distributeDrop(drop: GeneralDrop): DropDist {
  if (drop.oneOfEach) return distributeDropNoReturn(drop);
  const { chance = 1, num: [min, max], options } = drop;

  const totalWeight = options.reduce((w, { weight = 1 }) => w + weight, 0);
  const result: DropDist = {};
  for (const opt of options) {
    const { item, num = [1, 1], weight = 1 } = opt;
    const dist = add(linearDist(...num), [1], weight / totalWeight);
    let curr = power(dist, min);
    const opts = [curr];
    for (let p = min; p < max; p++) {
      curr = mul(curr, dist);
      opts.push(curr);
    }
    result[item] = add(scale(sum(opts), 1 / (max - min + 1)), [1], chance);
  };

  return result; 
}

function materializeDropNoReturn(drop: GeneralDrop): SimpleDrop {
  const { chance = 1, num: [min, max], options } = drop;
  const prob = chance / (max - min + 1);
  const result: SimpleDrop = Object.fromEntries(options.map(({ item }) => [item, 0]));
  function walk(currentOptions: GeneralDrop['options'], remaining: number, probability: number) {
    const totalWeight = currentOptions.reduce((accumWeight, option) => accumWeight + (option.weight ?? 1), 0);
    for (const option of currentOptions) {
      const p = (option.weight ?? 1) / totalWeight;
      result[option.item] += p * probability;
      if (remaining > 1) {
        const restOptions = currentOptions.filter(op => op !== option);
        walk(restOptions, remaining - 1, probability * p);
      }
    }
  }
  for (let n = min; n <= max; n++) {
    if (n < options.length) {
      walk(options, n, prob);
    } else {
      options.forEach(({ item }) => { result[item] += prob; });
    }
  }
  return result;
}

export function materializeDrop(drop: GeneralDrop): SimpleDrop {
  if (drop.oneOfEach) return materializeDropNoReturn(drop);

  const { chance = 1, num: [min, max], options } = drop;

  const mul = chance * (min + max) / 2;
  const totalWeight = options.reduce((w, { weight = 1 }) => w + weight, 0); 
  return Object.fromEntries(options.map(opt => {
    const { item, num = [1, 1], weight = 1 } = opt;
    const avg = (num[0] + num[1]) / 2 * (weight / totalWeight);
    return [item, avg * mul];
  }));
}

export function addDrop(dropBase: SimpleDrop, dropAdd: SimpleDrop, numAdd: number = 1): SimpleDrop {
  const copy: SimpleDrop = { ...dropBase };
  for (const [key, val] of Object.entries(dropAdd)) {
    if (!(key in copy)) copy[key] = 0;
    copy[key] += val * numAdd;
  }
  return copy;
}
