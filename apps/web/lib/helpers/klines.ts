export function getNumberOfKlinesResponsive(): number {
  if (window.innerWidth < 768) {
    return 50;
  }
  if (window.innerWidth < 1024) {
    return 100;
  }
  if (window.innerWidth < 1440) {
    return 150;
  }
  return 365;
}

export function getDefaultNumberOfKlines(interval: IntervalKeys): number {
  switch (interval) {
    case '4h':
      return 90;
    case '1h':
      return 125;
    case '1d':
      return 125;
    case '1w':
      return 100;
    case '2w':
      return 50;
    default:
      return 10;
  }
}
