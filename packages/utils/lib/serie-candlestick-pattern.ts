export class SerieCandlestickPattern {
  constructor(public serie: OHLC[]) {}

  isBullish(index: number): boolean {
    return this.serie[index].close > this.serie[index].open;
  }

  isBearish(index: number): boolean {
    return this.serie[index].close < this.serie[index].open;
  }

  isSwingHigh(index: number): boolean {
    return (
      index - 1 >= 0 &&
      index + 1 < this.serie.length &&
      this.serie[index].high > this.serie[index - 1].high &&
      this.serie[index].high > this.serie[index + 1].high
    );
  }

  isSwingLow(index: number): boolean {
    return (
      index - 1 >= 0 &&
      index + 1 < this.serie.length &&
      this.serie[index].low < this.serie[index - 1].low &&
      this.serie[index].low < this.serie[index + 1].low
    );
  }

  isFairValueGap(index: number): boolean {
    return (
      index - 1 >= 0 &&
      index + 1 < this.serie.length &&
      (this.serie[index - 1].high < this.serie[index + 1].low ||
        this.serie[index - 1].low > this.serie[index + 1].high)
    );
  }

  isIncluded(index: number, range: PriceRange): boolean {
    return range.high > this.get(index).low && range.low < this.get(index).high;
  }

  findLastBreakerBlock(
    from: number,
    to: number
  ):
    | {
        swingHigh: number;
        swingLow: number;
        higherSwingHigh: number;
        lowerSwingLow: number;
        isBullish: boolean;
        breakerBlock: number;
      }
    | undefined {
    const bullishBreakerBlock = {
      swingHigh: -1,
      swingLow: -1,
      higherSwingHigh: -1,
      lowerSwingLow: -1,
      breakerBlock: -1,
      isBullish: true,
    };
    const bearishBreakerBlock = {
      swingHigh: -1,
      swingLow: -1,
      higherSwingHigh: -1,
      lowerSwingLow: -1,
      breakerBlock: -1,
      isBullish: false,
    };

    for (let i = to; i > from; i--) {
      const { high, low } = this.get(i);
      // HH
      if (
        this.isSwingHigh(i) &&
        (!this.get(bullishBreakerBlock.higherSwingHigh) ||
          high > this.get(bullishBreakerBlock.higherSwingHigh).high)
      ) {
        bullishBreakerBlock.higherSwingHigh = i;
        bullishBreakerBlock.lowerSwingLow = -1;
        bullishBreakerBlock.swingHigh = -1;
      }
      // LL
      if (
        this.get(bullishBreakerBlock.higherSwingHigh) &&
        low < this.get(bullishBreakerBlock.higherSwingHigh).low &&
        (this.get(bullishBreakerBlock.lowerSwingLow)
          ? low < this.get(bullishBreakerBlock.lowerSwingLow).low
          : true) &&
        this.isSwingLow(i)
      ) {
        bullishBreakerBlock.lowerSwingLow = i;
        bullishBreakerBlock.swingHigh = -1;
      }
      // SH
      if (
        this.get(bullishBreakerBlock.higherSwingHigh) &&
        this.get(bullishBreakerBlock.lowerSwingLow) &&
        high < this.get(bullishBreakerBlock.higherSwingHigh).high &&
        high > this.get(bullishBreakerBlock.lowerSwingLow).high &&
        (this.get(bullishBreakerBlock.swingHigh)
          ? high > this.get(bullishBreakerBlock.swingHigh).high
          : true) &&
        this.isSwingHigh(i) &&
        this.isBullish(i)
      ) {
        bullishBreakerBlock.swingHigh = i;
      }
      // SL
      if (
        this.get(bullishBreakerBlock.higherSwingHigh) &&
        this.get(bullishBreakerBlock.lowerSwingLow) &&
        this.get(bullishBreakerBlock.swingHigh) &&
        low < this.get(bullishBreakerBlock.swingHigh).low &&
        low > this.get(bullishBreakerBlock.lowerSwingLow).low &&
        this.isSwingLow(i)
      ) {
        bullishBreakerBlock.swingLow = i;
        bullishBreakerBlock.breakerBlock = bullishBreakerBlock.swingHigh;
        return bullishBreakerBlock;
      }

      // Looking for bearish breaker block
      // LL
      if (
        this.isSwingLow(i) &&
        (!this.get(bearishBreakerBlock.lowerSwingLow) ||
          low < this.get(bearishBreakerBlock.lowerSwingLow).low)
      ) {
        bearishBreakerBlock.lowerSwingLow = i;
        bearishBreakerBlock.higherSwingHigh = -1;
        bearishBreakerBlock.swingLow = -1;
      }
      // HH
      if (
        this.get(bearishBreakerBlock.lowerSwingLow) &&
        high > this.get(bearishBreakerBlock.lowerSwingLow).high &&
        (this.get(bearishBreakerBlock.higherSwingHigh)
          ? high > this.get(bearishBreakerBlock.higherSwingHigh).high
          : true) &&
        this.isSwingHigh(i)
      ) {
        bearishBreakerBlock.higherSwingHigh = i;
        bearishBreakerBlock.swingLow = -1;
      }
      // SL
      if (
        this.get(bearishBreakerBlock.lowerSwingLow) &&
        this.get(bearishBreakerBlock.higherSwingHigh) &&
        low < this.get(bearishBreakerBlock.higherSwingHigh).low &&
        low > this.get(bearishBreakerBlock.lowerSwingLow).low &&
        (this.get(bearishBreakerBlock.swingLow)
          ? low < this.get(bearishBreakerBlock.swingLow).low
          : true)
      ) {
        bearishBreakerBlock.swingLow = i;
      }
      // SH
      if (
        this.get(bearishBreakerBlock.lowerSwingLow) &&
        this.get(bearishBreakerBlock.higherSwingHigh) &&
        this.get(bearishBreakerBlock.swingLow) &&
        high < this.get(bearishBreakerBlock.higherSwingHigh).high &&
        high > this.get(bearishBreakerBlock.swingLow).high
      ) {
        bearishBreakerBlock.swingHigh = i;
        bearishBreakerBlock.breakerBlock = bearishBreakerBlock.swingLow;
        return bearishBreakerBlock;
      }
    }
    return undefined;
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
  getPreviousHigherSwing(from: number, swingHighIndex: number): OHLC {
    for (let i = from; i >= 0; i--) {
      if (
        this.isSwingHigh(i) &&
        this.get(i).high > this.get(swingHighIndex).high
      ) {
        return this.get(i);
      }
    }
    return this.get(swingHighIndex);
  }
  getPreviousLowerSwing(from: number, swingLowIndex: number): OHLC {
    for (let i = from; i >= 0; i--) {
      if (this.isSwingLow(i) && this.get(i).low < this.get(swingLowIndex).low) {
        return this.get(i);
      }
    }
    return this.get(swingLowIndex);
  }

  // getPreviousLowerSwing
  get(index: number): OHLC {
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

export interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
  closeTime: number;
  openTime: number;
}
