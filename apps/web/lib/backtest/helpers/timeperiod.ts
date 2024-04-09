import { TimePeriod } from '..';

export function getTimeperiodIncrementInMs(timeperiod: TimePeriod): number {
  const { amount, unit } = parseTimePeriod(timeperiod);

  return amount * getUnitInMs(unit);
}

export function getTimePeriodUnitInMs(timeperiod: TimePeriod): number {
  const { unit } = parseTimePeriod(timeperiod);

  return getUnitInMs(unit);
}

export function getUnitInMs(unit: string): number {
  const unitInMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
  }[unit];

  if (!unitInMs) throw new Error('Invalid unit');

  return unitInMs;
}

export function parseTimePeriod(timeperiod: TimePeriod): {
  amount: number;
  unit: string;
} {
  const group = timeperiod.match(/(\d+)(\w+)/);

  if (!group) throw new Error('Invalid timeperiod');

  const [, amount, unit] = group;

  return { amount: parseInt(amount), unit };
}
