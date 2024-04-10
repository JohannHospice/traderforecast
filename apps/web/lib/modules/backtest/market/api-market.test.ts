import { Mock, beforeEach, describe, expect, test, vi } from 'vitest';
import { OHLC, Symbol } from '..';
import api from '../../../api';
import { ApiMarket } from './api-market';

vi.mock('../../../api');

describe('ApiMarket', () => {
  const ohlcs3: OHLC[] = [
    {
      openTime: 100,
      closeTime: 100,
      open: 100,
      high: 200,
      low: 50,
      close: 150,
    },
    {
      openTime: 200,
      closeTime: 200,
      open: 150,
      high: 250,
      low: 100,
      close: 200,
    },
    {
      openTime: 300,
      closeTime: 300,
      open: 200,
      high: 300,
      low: 150,
      close: 250,
    },
  ];
  describe('instance', () => {
    const symbol: Symbol = {
      key: 'BTC',
      timeperiod: '1h',
    };

    const apiMarket = new ApiMarket(symbol);

    beforeEach(() => {
      (api.realtimeMarket.getOHLCs as Mock).mockResolvedValue(ohlcs3);
    });

    describe('getOHLC', () => {
      test('should return one OHLC for given time', async () => {
        expect(await apiMarket.getOHLC(ohlcs3[0].openTime)).toEqual(ohlcs3[0]);
        expect(await apiMarket.getOHLC(ohlcs3[1].openTime)).toEqual(ohlcs3[1]);
        expect(await apiMarket.getOHLC(ohlcs3[2].openTime)).toEqual(ohlcs3[2]);
      });

      test('should throw error if OHLC not found', async () => {
        await expect(apiMarket.getOHLC(400)).rejects.toThrow('OHLC not found');
        await expect(apiMarket.getOHLC(-500)).rejects.toThrow('OHLC not found');
      });
    });

    describe('getOHLCs', () => {
      test('should return OHLCs with 1 for given timeframe', async () => {
        expect(
          await apiMarket.getOHLCs({
            from: 100,
            to: 200,
          })
        ).toEqual(ohlcs3.slice(0, 2));
      });
      test('should return OHLCs with 5 for given timeframe', async () => {
        expect(
          await apiMarket.getOHLCs({
            from: 100,
            to: 300,
          })
        ).toEqual(ohlcs3.slice(0, 3));
      });
    });
  });

  describe('class static methods', () => {
    const ohlc: OHLC = {
      openTime: 100,
      closeTime: 200,
      close: 100,
      high: 100,
      low: 100,
      open: 100,
    };

    const ohlcs: OHLC[] = [ohlc];

    describe('filterOHLCs', () => {
      test('should return OHLCs within given timeframe', () => {
        expect(
          ApiMarket.filterOHLCs(ohlcs3, {
            from: 100,
            to: 100,
          })
        ).toEqual([ohlcs3[0]]);

        expect(
          ApiMarket.filterOHLCs(ohlcs3, {
            from: 300,
            to: 300,
          })
        ).toEqual([ohlcs3[2]]);

        expect(
          ApiMarket.filterOHLCs(ohlcs3, {
            from: 100,
            to: 200,
          })
        ).toEqual([ohlcs3[0], ohlcs3[1]]);

        expect(
          ApiMarket.filterOHLCs(ohlcs3, {
            from: 100,
            to: 300,
          })
        ).toEqual(ohlcs3);
      });
    });

    describe('findOHLC', () => {
      test('should return OHLC for given time', () => {
        const result = ApiMarket.findOHLC(ohlcs, 100, 10);
        expect(result).toEqual(ohlc);
      });

      test('should return OHLC for given time with approx', () => {
        const result = ApiMarket.findOHLC(ohlcs, 200, 100);
        expect(result).toEqual(ohlc);
      });

      test('should return undefined if no OHLC for given time', () => {
        const result = ApiMarket.findOHLC(ohlcs, 300, 10);
        expect(result).toBeUndefined();
      });
    });

    describe('isSameTime', () => {
      test('should return true if times are within approximation', () => {
        const result = ApiMarket.isSameTime(100, 105, 10);
        expect(result).toBe(true);
      });

      test('should return false if times are not within approximation', () => {
        const result = ApiMarket.isSameTime(100, 200, 10);
        expect(result).toBe(false);
      });
    });
  });
});
