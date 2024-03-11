export function queryBuilder(
  params: Record<string, string | number | undefined>
) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}
