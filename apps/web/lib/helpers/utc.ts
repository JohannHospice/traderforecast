export function formatInterval(
  interval: string,
  expectedKlines: number
): string {
  const [amount, unit] = splitInterval(interval);
  return `utc_now-${amount * expectedKlines}${unit}`;
}

export function splitInterval(interval: string): [number, string] {
  const match = interval.match(/(\d+)(\w+)/);
  if (!match) {
    throw new Error('Invalid interval format');
  }
  const [_, amount, unit] = match;
  return [Number(amount), unit];
}
