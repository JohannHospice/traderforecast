export class SeriePattern {
  constructor(private serie: Kline[]) {}

  sma(period: number): number {
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += this.serie[i].close;
    }
    return sum / period;
  }

  isSMABullish(period: number): boolean {
    if (this.serie.length < period) return false;
    const _sma = this.sma(period);
    return this.serie[this.serie.length - 1].close > _sma;
  }

  isSMABearish(period: number): boolean {
    if (this.serie.length < period) return false;
    const _sma = this.sma(period);
    return this.serie[this.serie.length - 1].close < _sma;
  }
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
