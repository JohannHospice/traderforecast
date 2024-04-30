export function createKey(
  base: string = '*',
  keys: (string | number | undefined)[] = [undefined]
): string {
  return base + ':' + keys.map((key) => key || '*').join('_');
}

export function getKeyElement(key: string, index: number): string {
  return key.split(':')[1].split('_')[index];
}
