import { getTimeperiodIncrementInMs } from '../helpers/timeperiod';
import { ExchangeProxy } from '../exchange-proxy';
import { Strategy, StrategySettings } from '.';
import { Trade } from '../trade';
import { Symbol } from '..';
import { SerieCandlestickPattern } from '../serie-candlestick-pattern';

/**
 * ICT Silver Bullet Strategy
 * trade on certain hours and enter directly on the first fair value gap
 * take profit is 2 times the fair value gap and stop loss is the fair value gap
 */
export class ICTSilverBulletStrategy
  implements Strategy<ICTSilverBulletStrategySettings>
{
  private alreadyTraded = false;
  public static _id = 'ict-silver-bullet';

  id = ICTSilverBulletStrategy._id;
  name = 'ICT Silver Bullet Strategy';

  constructor(
    public symbol: Symbol,
    public settings: ICTSilverBulletStrategySettings
  ) {
    if (this.settings.takeProfitRatio <= 0) {
      throw new Error('takeProfitRatio must be greater than 0');
    }
    if (this.settings.stopLossMargin < 0) {
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

  getSettingsDefinition(): Record<
    keyof ICTSilverBulletStrategySettings,
    string
  > {
    return {
      startHour: 'number',
      endHour: 'number',
      takeProfitRatio: 'number',
      stopLossMargin: 'number',
      tradingFees: 'number',
    };
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
    if (this.settings.startHour < this.settings.endHour) {
      return hour >= this.settings.startHour && hour < this.settings.endHour;
    }
    return hour >= this.settings.startHour || hour < this.settings.endHour;
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
    const stopLoss = serie.get(fvg).open;

    if (long) {
      const entryPrice = serie.get(entry).low;
      return new Trade({
        entryPrice,
        tradingFees: this.settings.tradingFees,
        amount: Trade.buyAmount(balance, entryPrice),
        stopLoss: Trade.addMargin(stopLoss, -this.settings.stopLossMargin),
        takeProfit:
          entryPrice +
          Trade.distance(entryPrice, stopLoss) * this.settings.takeProfitRatio,
      });
    }

    const entryPrice = serie.get(entry).high;
    return new Trade({
      entryPrice,
      tradingFees: this.settings.tradingFees,
      amount: Trade.buyAmount(balance, entryPrice),
      stopLoss: Trade.addMargin(stopLoss, this.settings.stopLossMargin),
      takeProfit:
        entryPrice -
        Trade.distance(stopLoss, entryPrice) * this.settings.takeProfitRatio,
    });
  }
}

export interface ICTSilverBulletStrategySettings extends StrategySettings {
  startHour: number;
  endHour: number;
  takeProfitRatio: number;
  stopLossMargin: number;
}
