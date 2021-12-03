#define GLSLIFY 1

// permutation table
static int permutation[] = { 151,160,137,91,90,15,
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
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 };

// Generate permutation and gradient textures using CPU runtime
texture permTexture<
  string texturetype = "2D";
  string format = "l8";
  string function = "GeneratePermTexture";
  int width = 256, height = 1;
>;

float4 GeneratePermTexture(float p : POSITION) : COLOR {
  return permutation[p * 256] / 255.0;
}

sampler permSampler = sampler_state {
  texture = <permTexture>;
  AddressU  = Wrap;
  AddressV  = Clamp;
  MAGFILTER = POINT;
  MINFILTER = POINT;
  MIPFILTER = NONE;
};

// gradients for 2D noise
static vec2 g[] = {
  1, 1,
 -1, 1,
  1,-1,
 -1,-1,
  1, 0,
 -1, 0,
  1, 0,
 -1, 0,
  0, 1,
  0,-1,
  0, 1,
  0,-1,
  1, 1,
  0,-1,
 -1, 1,
  0,-1,
};

texture gradTexture<
  string texturetype = "2D";
  string format = "q8w8v8u8";
  string function = "GenerateGradTexture";
  int width = 16, height = 1;
>;

vec2 GenerateGradTexture(float p : POSITION) : COLOR {
  return g[p * 16];
}

sampler gradSampler = sampler_state  {
  texture   = <gradTexture>;
  AddressU  = Wrap;
  AddressV  = Clamp;
  MAGFILTER = POINT;
  MINFILTER = POINT;
  MIPFILTER = NONE;
};

vec2 fade(vec2 t)  {
  return t * t * t * (t * (t * 6 - 15) + 10); // new curve
}

float perm(float x)  {
  return tex1D(permSampler, x / 256.0) * 256;
}

float grad(float x, vec2 p)  {
  return dot(tex1D(gradSampler, x), p);
}

// 2D version
float noise(vec2 p) {
  vec2 P = fmod(floor(p), 256.0);
  p -= floor(p);
  vec2 f = fade(p);

  float A  = perm(P.x) + P.y;
  float B  = perm(P.x + 1) + P.y;
  float AA = perm(A);
  float AB = perm(A + 1);
  float BA = perm(B);
  float BB = perm(B + 1);

  const result = lerp(
    lerp( grad(perm(AA), p), 
          grad(perm(BA), p + vec2(-1,  0)), f.x),
    lerp( grad(perm(AB), p + vec2( 0, -1)), 
          grad(perm(BB), p + vec2(-1, -1)), f.x),
          f.y);

  return (result + vec2(0.69, 0.69)) / 1.483;
} 
