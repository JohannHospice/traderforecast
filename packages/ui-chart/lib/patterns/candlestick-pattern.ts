export class CandlestickPattern {
  constructor(public current: Kline) {}

  isBullish(): boolean {
    return this.current.close > this.current.open;
  }

  isBearish(): boolean {
    return this.current.close < this.current.open;
  }

  isSwigHigh(previous: Kline, next: Kline): boolean {
    return this.current.high > previous.high && this.current.high > next.high;
  }

  isSwigLow(previous: Kline, next: Kline): boolean {
    return this.current.low < previous.low && this.current.low < next.low;
  }

  isBullishEngulfing(previous: Kline): boolean {
    return (
      this.isBullish() &&
      this.current.open < previous.close &&
      this.current.close > previous.open &&
      this.current.open < previous.open &&
      this.current.close > previous.close
    );
  }

  isBearishEngulfing(previous: Kline): boolean {
    return (
      !this.isBearish() &&
      this.current.open > previous.close &&
      this.current.close < previous.open &&
      this.current.open > previous.open &&
      this.current.close < previous.close
    );
  }

  isEngulfingCandle(previous: Kline): boolean {
    return (
      this.isBullishEngulfing(previous) || this.isBearishEngulfing(previous)
    );
  }

  isMomentum(previous: Kline): boolean {
    return this.movement() > new CandlestickPattern(previous).movement() * 2;
  }

  isDoji(): boolean {
    return Math.abs(this.current.open - this.current.close) < 0.01;
  }

  isHammer(): boolean {
    return (
      this.isBullish() &&
      this.current.close - this.current.low >
        (this.current.high - this.current.close) * 2
    );
  }

  isShootingStar(): boolean {
    return (
      this.isBearish() &&
      this.current.high - this.current.close >
        (this.current.open - this.current.low) * 2
    );
  }

  isHangingMan(): boolean {
    return (
      this.isBearish() &&
      this.current.close - this.current.low >
        (this.current.high - this.current.close) * 2
    );
  }

  isInvertedHammer(): boolean {
    return (
      this.isBullish() &&
      this.current.high - this.current.close >
        (this.current.open - this.current.low) * 2
    );
  }

  isSpinningTop(): boolean {
    return (
      Math.abs(this.current.open - this.current.close) <
      (this.current.high - this.current.low) * 0.3
    );
  }

  isMarubozu(): boolean {
    return (
      (this.isBullish() &&
        this.current.close - this.current.open >
          (this.current.high - this.current.low) * 0.9) ||
      (this.isBearish() &&
        this.current.open - this.current.close >
          (this.current.high - this.current.low) * 0.9)
    );
  }

  movement(): number {
    return this.isBullish() ? this.movementBullish() : this.movementBearish();
  }

  movementBullish(): number {
    return this.current.close - this.current.open;
  }

  movementBearish(): number {
    return this.current.open - this.current.close;
  }

  get closeTime(): number {
    return this.current.closeTime;
  }
}
