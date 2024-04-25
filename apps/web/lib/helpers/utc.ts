export function formatInterval(
  interval: string,
  expectedKlines: number
): string {
  const match = interval.match(/(\d+)(\w+)/);
  if (!match) {
    throw new Error('Invalid interval format');
  }
  const [_, amount, unit] = match;
  return `utc_now-${Number(amount) * expectedKlines}${unit}`;
}
