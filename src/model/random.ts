import type { Vector2i } from './utils';

type RandomState = {
  a: number;
  b: number;
  c: number;
  d: number;
}

/**
 * @see https://forum.unity.com/threads/how-does-unityengine-random-initialize-the-state-parameters-of-xorshift-in-random-initstate.1042252/
 */ 
export class Random {
  private state: RandomState;

  constructor(seed: number) {
    this.state = this.init(seed);
  }

  public init(seed: number) {
    const a = seed >>> 0;
    const b = (Math.imul(a, 1812433253) + 1) >>> 0;
    const c = (Math.imul(b, 1812433253) + 1) >>> 0;
    const d = (Math.imul(c, 1812433253) + 1) >>> 0;
    return (this.state = { a, b, c, d });
  }
  
  private next() {
    const t = this.state.a ^ (this.state.a << 11);
    this.state.a = this.state.b;
    this.state.b = this.state.c;
    this.state.c = this.state.d;
    this.state.d = this.state.d ^ (this.state.d >>> 19) ^ t ^ (t >>> 8);
    return this.state.d;
  };

  public getState(): RandomState {
    return this.state;
  }
  
  public setState(state: RandomState) {
    this.state = state;
  }
  
  public random() {
    const value = (this.next() << 9) >>> 0;
    return value / 0xfffffe00; // (2 ** 32 - 2 ** 9)
  };

  // In Unity, random range uses 1.0 - value for some reason.
  public rangeFloat(min: number, max: number) {
    return max - this.random() * (max - min);
  }

  public rangeInt(min: number, max: number) {
    return min + (this.next() >>> 0) % (max - min)
  }

  public insideUnitCircle(): Vector2i {
    const angle = this.rangeFloat(0, Math.PI * 2);
    const radius = Math.sqrt(this.rangeFloat(0, 1));
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  }
};

export const random = new Random(0);
