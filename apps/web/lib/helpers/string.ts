import { SEARCH_PARAM_ARRAY_SEPARATOR } from '../constants/navigation';

export function formatNumber(
  value: string | number | undefined,
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact',
  maximumFractionDigits?: number
) {
  const number = maximumFractionDigits
    ? Number(value).toFixed(maximumFractionDigits)
    : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation,
    maximumSignificantDigits: 5,
    currencyDisplay: 'narrowSymbol',
  }).format(Number(number));
}

export function formatPercent(value: string | number | undefined) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: 'always',
  }).format(Number(value));
}

export function decodeSearchParamList(
  param: string,
  separator: string = SEARCH_PARAM_ARRAY_SEPARATOR
): string[] {
  const splitted = decodeURI(param).split(separator);

  return splitted.filter((item) => item !== '');
}

export function encodeSearchParamList(
  param: string[],
  separator: string = SEARCH_PARAM_ARRAY_SEPARATOR
): string {
  return encodeURI(param.join(separator));
}
