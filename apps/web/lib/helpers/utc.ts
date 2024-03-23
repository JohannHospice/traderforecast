export function formatInterval(
  interval: string,
  expectedKlines: number
): string {
  return `utc_now-${Number(interval[0]) * expectedKlines}${interval[1]}`;
}
