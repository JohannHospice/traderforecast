export class SerieCandlestickPattern {
  constructor(public serie: Kline[]) {}

  isBullish(index: number): boolean {
    return this.serie[index].close > this.serie[index].open;
  }

  isBearish(index: number): boolean {
    return this.serie[index].close < this.serie[index].open;
  }

  isSwingHigh(index: number): boolean {
    return (
      this.serie[index].high > this.serie[index - 1].high &&
      this.serie[index].high > this.serie[index + 1].high
    );
  }

  isSwingLow(index: number): boolean {
    return (
      this.serie[index].low < this.serie[index - 1].low &&
      this.serie[index].low < this.serie[index + 1].low
    );
  }

  isFairValueGap(index: number): boolean {
    return (
      this.serie[index - 1].high < this.serie[index + 1].low ||
      this.serie[index - 1].low > this.serie[index + 1].high
    );
  }

  isIncluded(index: number, range: PriceRange): boolean {
    return range.high > this.get(index).low && range.low < this.get(index).high;
  }

  findLastBullishBreakerBlock(from: number, to: number): number {
    let higherSwingHigh = Number.NEGATIVE_INFINITY;
    let lowerSwingLow = Number.POSITIVE_INFINITY;
    let swingHigh = Number.NEGATIVE_INFINITY;
    let swingLow = Number.POSITIVE_INFINITY;

    for (let i = to; i > from; i--) {
      if (this.get(i).high > higherSwingHigh) {
        higherSwingHigh = this.get(i).high;
        continue;
      }
      if (
        this.get(i).low < lowerSwingLow &&
        this.get(i).high < higherSwingHigh
      ) {
        lowerSwingLow = this.get(i).low;
        continue;
      }
      if (
        this.get(i).high > swingHigh &&
        this.get(i).low > lowerSwingLow &&
        this.get(i).high < higherSwingHigh
      ) {
        swingHigh = this.get(i).high;
        continue;
      }
      if (
        this.get(i).low < swingLow &&
        this.get(i).low > lowerSwingLow &&
        this.get(i).high < swingHigh
      ) {
        swingLow = this.get(i).low;
        return swingHigh;
      }
    }
    return -1;
  }

  findFairValueGap(from: number, to: number) {
    for (let i = to; i > from; i--) {
      if (
        this.isFairValueGap(i) &&
        this.isBullish(i) &&
        this.isBullish(i - 1)
      ) {
        return i;
      }
    }
    return -1;
  }

  findHigherHigh(swingHigh: number): number {
    for (let i = swingHigh; i < this.length; i++) {
      if (this.get(i).high > this.get(swingHigh).high) {
        return i;
      }
    }
    return -1;
  }

  // todo rework
  findOrderBlockEntry(orderblock: number): number {
    for (let i = orderblock + 2; i < this.length; i++) {
      if (this.get(orderblock).high > this.get(i).low) {
        return i;
      }
    }
    return -1;
  }

  getFairValueGapPriceRange(index: number): PriceRange | undefined {
    if (this.isFairValueGap(index)) {
      return {
        high: Math.max(this.serie[index - 1].low, this.serie[index + 1].low),
        low: Math.min(this.serie[index - 1].high, this.serie[index + 1].high),
      };
    }
    return undefined;
  }

  get(index: number): Kline {
    return this.serie[index];
  }

  get length(): number {
    return this.serie.length;
  }
}

interface PriceRange {
  high: number;
  low: number;
}
