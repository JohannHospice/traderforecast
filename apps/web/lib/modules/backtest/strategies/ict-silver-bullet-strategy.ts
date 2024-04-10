import { SerieCandlestickPattern } from '../../chart/patterns/serie-candlestick-pattern';
import { getTimePeriodUnitInMs } from '../helpers/timeperiod';
import { ExchangeProxy } from '../exchange-proxy';
import { LongTrade } from '../trade/long-trade';
import { ShortTrade } from '../trade/short-trade';
import { Symbol } from '..';
import { Strategy } from '.';
import { Trade } from '../trade';

/**
 * ICT Silver Bullet Strategy
 * trade on certain hours and enter directly on the first fair value gap
 * take profit is 2 times the fair value gap and stop loss is the fair value gap
 */
export class ICTSilverBulletStrategy implements Strategy {
  constructor(
    private symbol: Symbol,
    private config: {
      startHour: number;
      endHour: number;
      takeProfitRatio: number;
      stopLossMargin: number;
    }
  ) {}

  async onTime(time: number, exchange: ExchangeProxy): Promise<void> {
    if (exchange.activeTrades.length > 0) {
      return;
    }

    if (!this.isTradingHour(time)) {
      return;
    }

    const serie = await this.createSerie(time, exchange);
    const trade = this.trade(serie);

    if (!trade) {
      return;
    }

    exchange.addTrade(trade);
  }

  isTradingHour(time: number): boolean {
    const date = new Date(time);
    const hour = date.getHours();
    return hour >= this.config.startHour && hour < this.config.endHour;
  }

  async createSerie(
    time: number,
    exchange: ExchangeProxy
  ): Promise<SerieCandlestickPattern> {
    const from = time - getTimePeriodUnitInMs(this.symbol.timeperiod) * 4;
    const to = time;

    const ohlcs = await exchange.getMarket(this.symbol).getOHLCs({
      from,
      to,
    });
    return new SerieCandlestickPattern(ohlcs);
  }

  trade(serie: SerieCandlestickPattern): Trade | undefined {
    const fvg = serie.length - 2;

    if (!serie.isFairValueGap(fvg)) {
      return undefined;
    }

    const entry = serie.length - 1;

    if (serie.isBullish(fvg)) {
      return new LongTrade(
        serie.get(entry).low,
        (serie.get(fvg).open - serie.get(fvg).low) *
          this.config.takeProfitRatio,
        serie.get(fvg).low * (1 - this.config.stopLossMargin)
      );
    }

    return new ShortTrade(
      serie.get(entry).high,
      (serie.get(fvg).high - serie.get(fvg).open) * this.config.takeProfitRatio,
      serie.get(fvg).high * (1 + this.config.stopLossMargin)
    );
  }
}
