export function parseNumber(arg: string | undefined): number | undefined {
  if (arg == null) return arg;
  const result = Number(arg);
  return isNaN(result) ? undefined : result;
}
