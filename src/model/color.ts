import { Vector3, clamp01, lerp } from './utils';

function RGBToHSV({ x: r, y: g, z: b }: Vector3): Vector3 {
  if (b > g && b > r) return RGBToHSVHelper(4, b, r, g);
  else if (g > r) return RGBToHSVHelper(2, g, b, r);
  else return RGBToHSVHelper(0, r, g, b);
}

function RGBToHSVHelper(
  offset: number,
  dominantColor: number,
  color1: number,
  color2: number,
): Vector3 {
  let H = 0;
  let S = 0;
  const V = dominantColor;
  if (V !== 0) {
    const num1 = Math.min(color1, color2);
    const num2 = V - num1;
    if (num2 !== 0) {
      S = num2 / V;
      H = offset + (color1 - color2) / num2;
    } else {
      S = 0;
      H = offset + (color1 - color2);
    }
    H /= 6;
    if (H < 0.0) ++H;
  }
  return { x: H, y: S, z: V };
}

function HSVToRGB({ x: H, y: S, z: V }: Vector3, hdr = true): Vector3 {
  let color = { x: 1, y: 1, z: 1 };
  if (S === 0) return { x: V, y: V, z: V };
  if (V === 0) return { x: 0, y: 0, z: 0 };
  color.x = 0;
  color.y = 0;
  color.z = 0;
  const num1 = S;
  const num2 = V;
  const f = H * 6;
  const num3 = Math.floor(f);
  const num4 = f - num3;
  const num5 = num2 * (1 - num1);
  const num6 = num2 * (1.0 - num1 * num4);
  const num7 = num2 * (1.0 - num1 * (1.0 - num4));
  switch (num3)
  {
    case -1:
      color.x = num2;
      color.y = num5;
      color.z = num6;
      break;
    case 0:
      color.x = num2;
      color.y = num7;
      color.z = num5;
      break;
    case 1:
      color.x = num6;
      color.y = num2;
      color.z = num5;
      break;
    case 2:
      color.x = num5;
      color.y = num2;
      color.z = num7;
      break;
    case 3:
      color.x = num5;
      color.y = num6;
      color.z = num2;
      break;
    case 4:
      color.x = num7;
      color.y = num5;
      color.z = num2;
      break;
    case 5:
      color.x = num2;
      color.y = num5;
      color.z = num6;
      break;
    case 6:
      color.x = num2;
      color.y = num7;
      color.z = num5;
      break;
  }
  if (!hdr) {
    color.x = clamp01(color.x);
    color.y = clamp01(color.y);
    color.z = clamp01(color.z);
  }
  return color;
}

export function getSupportColor(minSupport: number, maxSupport: number, support = maxSupport) {
  const color = { x: 0.6, y:  0.8, z: 1 };
  const value = support >= maxSupport
    ? -1
    : clamp01((support - minSupport) / (maxSupport * 0.5 - minSupport))
  if (value < 0.0) return color;
  const { x: H } = RGBToHSV({
    x: 1 - value,
    y: value,
    z: 0,
  });
  const S = lerp(1, 0.5, value);
  const V = lerp(1.2, 0.9, value);
  return HSVToRGB({ x: H, y: S, z: V });
}