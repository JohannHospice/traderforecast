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

  get(index: number): Kline {
    return this.serie[index];
  }
}
