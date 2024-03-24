import { Indicator, IndicatorResult, Marker } from '.';

export class MomemtumCandlestickMarkersIndicator implements Indicator {
  execute(klines: Kline[]): IndicatorResult {
    const markers: Marker[] = [];

    for (let i = 1; i < klines.length; i++) {
      const current = klines[i];
      const previous = klines[i - 1];

      const isCurrentBullish = current.close > current.open;
      const isPreviousBullish = previous.close > previous.open;

      const currentDistance = isCurrentBullish
        ? current.close - current.open
        : current.open - current.close;

      const previousDistance = isPreviousBullish
        ? previous.close - previous.open
        : previous.open - previous.close;

      const isMomentum =
        currentDistance > previousDistance * 2 ||
        isCurrentBullish === isPreviousBullish;

      const sma50 = i < 50 ? NaN : sma(klines.slice(i - 50, i), 50);

      const isDownTrend = sma50 && current.close < sma50;
      const isUpTrend = sma50 && current.close > sma50;

      if (isCurrentBullish && isUpTrend && isMomentum) {
        markers.push({
          time: current.closeTime,
          color: 'green',
          position: 'belowBar',
          shape: 'arrowUp',
          text: 'M',
        });
      }
      if (!isCurrentBullish && isDownTrend && isMomentum) {
        markers.push({
          time: current.closeTime,
          color: 'red',
          position: 'aboveBar',
          shape: 'arrowDown',
          text: 'M',
        });
      }
    }

    return {
      markers,
    };
  }
}

function sma(klines: Kline[], period: number): number {
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += klines[i].close;
  }
  return sum / period;
}
/*
function chandelierIndicator(klines: Kline[], period: number): number {
  let maxHigh = 0;
  for (let i = 0; i < period; i++) {
    maxHigh = Math.max(maxHigh, klines[i].high);
  }
  return maxHigh;
}

// 1.5 TP
//

// two step TP
// first buy on indicator signal with 1.5 TP and SL on resistance
// if TP is hit, then sell half and SL is moved to entry
// exit if chandelier indicator is hit
// if SL is hit, then exit

function exitStrategy();

function fibonacciRetracement(low: number, high: number): number[] {
  const diff = high - low;
  const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  return levels.map((level) => low + diff * level);
}
*/
