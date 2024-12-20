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

export function formatPercent(
  value: string | number | undefined,
  signDisplay: 'auto' | 'always' | 'never' = 'always'
) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay,
  }).format(Number(value));
}

export function decodeSearchParamList(
  param: string,
  separator: string
): string[] {
  const splitted = decodeURI(param).split(separator);

  return splitted.filter((item) => item !== '');
}

export function encodeSearchParamList(
  param: string[],
  separator: string
): string {
  return encodeURI(param.join(separator));
}
