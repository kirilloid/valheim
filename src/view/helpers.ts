export function durability(values: [number, number]): string {
  if (values[0] === Infinity) return 'indestructible';
  if (values[1] === 0) return String(values[0])
  return values.join('+');
}
