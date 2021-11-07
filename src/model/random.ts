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
    const b = (Math.imul(a, 1812433253) + 1);
    const c = (Math.imul(b, 1812433253) + 1);
    const d = (Math.imul(c, 1812433253) + 1);
    return (this.state = { a, b, c, d });
  }
  
  private next() {
    const t1 = this.state.a ^ (this.state.a << 11);
    const t2 = t1 ^ (t1 >>> 8);
    this.state = {
      a: this.state.b,
      b: this.state.c,
      c: this.state.d,
      d: this.state.d ^ (this.state.d >>> 19) ^ t2,
    };
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
    return (value / 4294967295);
  };

  public element<T>(arr: T[]): T {
    const index = Math.floor(this.random() * arr.length);
    return arr[index]!;
  }

  // In Unity, random range uses 1.0 - value for some reason.
  public range(min: number, max: number) {
    return max - this.random() * (max - min);
  }
};
  