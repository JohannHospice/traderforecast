export function formatNumber(
  value: string | number,
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact'
) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation,
  }).format(Number(value));
}
