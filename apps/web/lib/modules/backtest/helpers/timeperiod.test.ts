import { test, expect, describe } from 'vitest';
import {
  getTimeperiodIncrementInMs,
  getTimePeriodUnitInMs,
  getUnitInMs,
  parseTimePeriod,
} from './timeperiod';

describe('timeperiod.ts functions', () => {
  describe('getTimeperiodIncrementInMs', () => {
    test('should return correct milliseconds', () => {
      expect(getTimeperiodIncrementInMs('2h')).toBe(7200000);
      expect(getTimeperiodIncrementInMs('5m')).toBe(300000);
    });
  });

  describe('getTimePeriodUnitInMs', () => {
    test('should return correct milliseconds for unit', () => {
      expect(getTimePeriodUnitInMs('2h')).toBe(3600000);
      expect(getTimePeriodUnitInMs('5m')).toBe(60000);
    });
  });

  describe('getUnitInMs', () => {
    test('should return correct milliseconds for unit', () => {
      expect(getUnitInMs('h')).toBe(3600000);
      expect(getUnitInMs('m')).toBe(60000);
    });

    test('should throw error for invalid unit', () => {
      expect(() => getUnitInMs('x')).toThrow('Invalid unit');
    });
  });

  describe('parseTimePeriod', () => {
    test('should return correct amount and unit', () => {
      expect(parseTimePeriod('2h')).toEqual({ amount: 2, unit: 'h' });
      expect(parseTimePeriod('5m')).toEqual({ amount: 5, unit: 'm' });
    });
  });
});
