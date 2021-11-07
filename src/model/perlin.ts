import { lerp } from './utils';

function fade(t: number): number {
  return t ** 3 * (t * (t * 6 - 15) + 10);
}

function grad(hash: number, x: number, y: number, z: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  let v;
  
  if (h < 4) v = y;
  else if (h == 12 || h == 14) v = x;
  else v = z;
  
  return ((h & 1) === 0 ? u : -u)
      +  ((h & 2) === 0 ? v : -v);
}

// Hash lookup table as defined by Ken Perlin.
const p = new Uint8Array([ 151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
]);

const repeat = 0;

function inc(num: number): number {
  num++;
  if (repeat > 0) num %= repeat;
  return num;
}

export function perlinNoise(x: number, y: number, scale: number): number {
  x *= scale;
  y *= scale;
  const z = 0;
  if (repeat > 0) {                    // If we have any repeat on, change the coordinates to their "local" repetitions
    x %= repeat;
    y %= repeat;
    // z %= repeat;
  }

  const xi = Math.floor(x) & 255;      // Calculate the "unit cube" that the point asked will be located in
  const yi = Math.floor(y) & 255;      // The left bound is ( |_x_|,|_y_|,|_z_| ) and the right bound is that
  const zi = Math.floor(z) & 255;      // plus 1.  Next we calculate the location (from 0.0 to 1.0) in that cube.
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const zf = z - Math.floor(z);

  const aaa = p[p[p[    xi ]!+    yi ]!+    zi ]!;
  const aba = p[p[p[    xi ]!+inc(yi)]!+    zi ]!;
  const aab = p[p[p[    xi ]!+    yi ]!+inc(zi)]!;
  const abb = p[p[p[    xi ]!+inc(yi)]!+inc(zi)]!;
  const baa = p[p[p[inc(xi)]!+    yi ]!+    zi ]!;
  const bba = p[p[p[inc(xi)]!+inc(yi)]!+    zi ]!;
  const bab = p[p[p[inc(xi)]!+    yi ]!+inc(zi)]!;
  const bbb = p[p[p[inc(xi)]!+inc(yi)]!+inc(zi)]!;

  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  let x1 = lerp(
    grad (aaa, xf  , yf  , zf),        // The gradient function calculates the dot product between a pseudorandom
    grad (baa, xf-1, yf  , zf),        // gradient vector and the vector from the input coordinate to the 8
    u,
  );
                                       // surrounding points in its unit cube.
  let x2 = lerp(
    grad (aba, xf  , yf-1, zf),        // This is all then lerped together as a sort of weighted average based on the faded (u,v,w)
    grad (bba, xf-1, yf-1, zf),        // values we made earlier.
    u,
  );
  const y1 = lerp(x1, x2, v);
  x1 = lerp(
    grad (aab, xf  , yf  , zf-1),
    grad (bab, xf-1, yf  , zf-1),
    u,
  );
  x2 = lerp(
    grad (abb, xf  , yf-1, zf-1),
    grad (bbb, xf-1, yf-1, zf-1),
    u,
  );
  const y2 = lerp(x1, x2, v);
  return (lerp(y1, y2, w) + 1) / 2;    // For convenience we bind the result to 0 - 1 (theoretical min/max before is [-1, 1])
}

