import { SEARCH_PARAM_ARRAY_SEPARATOR } from '../constants/navigation';

export function formatNumber(
  value: string | number | undefined,
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact'
) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation,
  }).format(Number(value));
}

export function formatPercent(value: string | number | undefined) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'always',
  }).format(Number(value));
}

export function formatArrayInSearchParam(
  string: string,
  separator: string = SEARCH_PARAM_ARRAY_SEPARATOR
): string[] {
  const splitted = string.split(separator);

  return splitted.filter((item) => item !== '');
}
