import { SerieCandlestickPattern } from '../../chart/patterns/serie-candlestick-pattern';
import { getTimeperiodIncrementInMs } from '../helpers/timeperiod';
import { ExchangeProxy } from '../exchange-proxy';
import { Symbol } from '..';
import { Strategy } from '.';
import { Trade } from '../trade';

/**
 * ICT Silver Bullet Strategy
 * trade on certain hours and enter directly on the first fair value gap
 * take profit is 2 times the fair value gap and stop loss is the fair value gap
 */
export class ICTSilverBulletStrategy implements Strategy {
  private alreadyTraded = false;

  constructor(
    public name: string,
    private symbol: Symbol,
    private config: {
      startHour: number;
      endHour: number;
      takeProfitRatio: number;
      stopLossMargin: number;
    }
  ) {
    if (this.config.startHour >= this.config.endHour) {
      throw new Error('startHour must be less than endHour');
    }
    if (this.config.takeProfitRatio <= 0) {
      throw new Error('takeProfitRatio must be greater than 0');
    }
    if (this.config.stopLossMargin <= 0) {
      throw new Error('stopLossMargin must be greater than 0');
    }
    if (
      !['1s', '15s', '30s', '1m', '5m', '15m', '30m', '1h'].includes(
        this.symbol.timeperiod
      )
    ) {
      throw new Error('timeperiod not supported');
    }
  }

  async onTime(time: number, exchange: ExchangeProxy): Promise<void> {
    if (!this.isTradingHour(time)) {
      exchange.activeTrades.forEach((trade) => {
        exchange.cancelTrade(trade);
      });
      this.alreadyTraded = false;
      return;
    }

    if (exchange.activeTrades.length > 0 || this.alreadyTraded) {
      return;
    }

    const serie = await this.createSerie(time, exchange);
    const trade = this.trade(serie, exchange.balance);

    if (!trade) {
      return;
    }

    exchange.addTrade(trade);
    this.alreadyTraded = true;
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
    const from = time - getTimeperiodIncrementInMs(this.symbol.timeperiod) * 4;
    const to = time;

    const ohlcs = await exchange.getMarket(this.symbol).getOHLCs({
      from,
      to,
    });
    return new SerieCandlestickPattern(ohlcs);
  }

  trade(serie: SerieCandlestickPattern, balance: number): Trade | undefined {
    const fvg = serie.length - 2;

    if (!serie.isFairValueGap(fvg)) {
      return undefined;
    }

    const entry = serie.length - 1;

    const long = serie.isBullish(fvg);

    const entryPrice = serie.get(entry).close;

    return new Trade({
      entryPrice,
      entryTime: serie.get(entry).closeTime,
      amount: balance / entryPrice,
      ...(long
        ? {
            takeProfit:
              entryPrice +
              (entryPrice - serie.get(fvg).low) * this.config.takeProfitRatio,
            stopLoss: serie.get(fvg).low * (1 - this.config.stopLossMargin),
          }
        : {
            takeProfit:
              entryPrice -
              (serie.get(fvg).high - entryPrice) * this.config.takeProfitRatio,
            stopLoss: serie.get(fvg).high * (1 + this.config.stopLossMargin),
          }),
    });
  }
}
