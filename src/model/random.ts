/**
 * @see https://forum.unity.com/threads/how-does-unityengine-random-initialize-the-state-parameters-of-xorshift-in-random-initstate.1042252/
 */ 
export function createRNG(seed: number) {
  let a = seed >>> 0;
  let b = (Math.imul(a, 1812433253) + 1);
  let c = (Math.imul(b, 1812433253) + 1);
  let d = (Math.imul(c, 1812433253) + 1);
  
  const next = () => {
    const t1 = a ^ (a << 11);
    const t2 = t1 ^ (t1 >>> 8);
    a = b; b = c; c = d;
    d = d ^ (d >>> 19) ^ t2;
    return d;
  };
  
  const random = () => {
    const value = (next() << 9) >>> 0;
    return (value / 4294967295);
  };
  // In Unity, random range uses 1.0 - value for some reason.
  const randomRange = () => {
    return 1.0 - random();
  };
  
  return {
    random,
    randomRange
  };
};
  