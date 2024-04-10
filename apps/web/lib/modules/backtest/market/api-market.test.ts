import {
  Mock,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { OHLC } from '..';
import api from '../../../api';
import { ApiMarket } from './api-market';

vi.mock('../../../api');

function createRandomOHLCs(n: number): OHLC[] {
  return Array(n)
    .fill(0)
    .map((_, i) => ({
      openTime: i * 1000,
      closeTime: i * 1000,
      open: i * 100,
      high: i * 200,
      low: i * 50,
      close: i * 150,
    }));
}

describe('ApiMarket', () => {
  const ohlcs3: OHLC[] = createRandomOHLCs(3);

  const apiMarket = new ApiMarket({
    key: 'BTC',
    timeperiod: '1s',
  });

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
      await expect(apiMarket.getOHLC(4000)).rejects.toThrow('OHLC not found');
      await expect(apiMarket.getOHLC(-5000)).rejects.toThrow('OHLC not found');
    });
  });

  describe('getOHLCs', () => {
    test('should return OHLCs with 1 for given timeframe', async () => {
      expect(
        await apiMarket.getOHLCs({
          from: 1000,
          to: 2000,
        })
      ).toEqual(ohlcs3.slice(1, 3));
    });

    test('should return OHLCs with 5 for given timeframe', async () => {
      expect(
        await apiMarket.getOHLCs({
          from: 0,
          to: 3000,
        })
      ).toEqual(ohlcs3.slice(0, 3));
    });
  });
});

describe('filterOHLCs', () => {
  const ohlcs = createRandomOHLCs(100);

  test('should return one OHLC for given timeframe', () => {
    expect(
      ApiMarket.filterOHLCs(ohlcs, {
        from: 0,
        to: 0,
      })
    ).toEqual([ohlcs[0]]);

    expect(
      ApiMarket.filterOHLCs(ohlcs, {
        from: 1000,
        to: 1000,
      })
    ).toEqual([ohlcs[1]]);
  });

  test('should return multiple OHLCs for given timeframe', () => {
    expect(
      ApiMarket.filterOHLCs(ohlcs, {
        from: 0,
        to: 1000,
      })
    ).toEqual([ohlcs[0], ohlcs[1]]);

    expect(
      ApiMarket.filterOHLCs(ohlcs, {
        from: 1000,
        to: 2000,
      })
    ).toEqual([ohlcs[1], ohlcs[2]]);
  });

  test('should return no OHLCs', () => {
    expect(
      ApiMarket.filterOHLCs(ohlcs, {
        from: 99999,
        to: 999999,
      })
    ).toEqual([]);
  });
});

describe('findOHLC', () => {
  const ohlc: OHLC = {
    openTime: 100,
    closeTime: 200,
    close: 100,
    high: 100,
    low: 100,
    open: 100,
  };

  const ohlcs: OHLC[] = [ohlc];
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

describe('shouldFetchOHLCs', () => {
  const apiMarket = new ApiMarket({
    key: 'BTC',
    timeperiod: '1h',
  });

  beforeAll(() => {
    (api.realtimeMarket.getOHLCs as Mock).mockResolvedValue(
      createRandomOHLCs(100)
    );
  });

  describe('not loaded', () => {
    test('should return true if no OHLCs are stored', () => {
      expect(
        apiMarket.shouldLoad({
          from: 1000,
          to: 2000,
        })
      ).toBe(true);
      expect(
        apiMarket.shouldLoad({
          from: 9000,
          to: 99990,
        })
      ).toBe(true);
    });
  });

  describe('loaded', () => {
    beforeAll(async () => {
      await apiMarket.load({
        from: 5000,
        to: 15000,
      });
    });

    test('should not load if timeframe is fully covered by stored OHLCs', () => {
      expect(
        apiMarket.shouldLoad({
          from: 5000,
          to: 15000,
        })
      ).toBe(false);
    });
    test('should load if timeframe is partially covered by stored OHLCs', async () => {
      expect(
        apiMarket.shouldLoad({
          from: 5000,
          to: 9999000,
        })
      ).toBe(true);
      expect(
        apiMarket.shouldLoad({
          from: -5000,
          to: 5000,
        })
      ).toBe(true);
    });
  });
});
