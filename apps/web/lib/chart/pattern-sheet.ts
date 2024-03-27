export function isBullishEngulfing(kline: Kline, previous: Kline): boolean {
  return (
    isBullish(kline) &&
    kline.open < previous.close &&
    kline.close > previous.open &&
    kline.open < previous.open &&
    kline.close > previous.close
  );
}

export function isBearishEngulfing(kline: Kline, previous: Kline): boolean {
  return (
    !isBullish(kline) &&
    kline.open > previous.close &&
    kline.close < previous.open &&
    kline.open > previous.open &&
    kline.close < previous.close
  );
}

export function isEngulfingCandle({
  current,
  previous,
}: {
  current: Kline;
  previous: Kline;
}): boolean {
  return (
    isBullishEngulfing(current, previous) ||
    isBearishEngulfing(current, previous)
  );
}

export function isMomentum(current: Kline, previous: Kline): boolean {
  return movement(current) > movement(previous) * 2;
}

export function isDoji(kline: Kline): boolean {
  return Math.abs(kline.open - kline.close) < 0.01;
}

export function isHammer(kline: Kline): boolean {
  return (
    isBullish(kline) && kline.close - kline.low > (kline.high - kline.close) * 2
  );
}

export function isShootingStar(kline: Kline): boolean {
  return (
    isBearish(kline) && kline.high - kline.close > (kline.open - kline.low) * 2
  );
}

export function isHangingMan(kline: Kline): boolean {
  return (
    isBearish(kline) && kline.close - kline.low > (kline.high - kline.close) * 2
  );
}

export function isInvertedHammer(kline: Kline): boolean {
  return (
    isBullish(kline) && kline.high - kline.close > (kline.open - kline.low) * 2
  );
}

export function isSpinningTop(kline: Kline): boolean {
  return Math.abs(kline.open - kline.close) < (kline.high - kline.low) * 0.3;
}

export function isMarubozu(kline: Kline): boolean {
  return (
    (isBullish(kline) &&
      kline.close - kline.open > (kline.high - kline.low) * 0.9) ||
    (isBearish(kline) &&
      kline.open - kline.close > (kline.high - kline.low) * 0.9)
  );
}

export function isBullish(kline: Kline): boolean {
  return kline.close > kline.open;
}

export function isBearish(kline: Kline): boolean {
  return kline.close < kline.open;
}

/**
 * Tools
 */

export function movement(kline: Kline): number {
  return isBullish(kline) ? movementBullish(kline) : movementBearish(kline);
}

export function movementBullish(kline: Kline): number {
  return kline.close - kline.open;
}

export function movementBearish(kline: Kline): number {
  return kline.open - kline.close;
}
