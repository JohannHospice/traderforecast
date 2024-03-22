'use client';

export function formatInterval(
  interval: string,
  expectedKlines: number
): string {
  return `utc_now-${Number(interval[0]) * expectedKlines}${interval[1]}`;
}

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
