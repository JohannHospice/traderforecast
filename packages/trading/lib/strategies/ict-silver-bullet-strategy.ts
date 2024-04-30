import { ExchangeProxy } from '../exchange-proxy';
import { Strategy, StrategySettings } from '.';
import { Trade } from '../trade';
import { Symbol } from '..';
import { SerieCandlestickPattern } from '../../../utils/lib/serie-candlestick-pattern';
import { isTradingHour, createSerie } from '../helpers/strategy';

/**
 * ICT Silver Bullet Strategy
 * trade on certain hours and enter directly on the first fair value gap
 * take profit is 2 times the fair value gap and stop loss is the fair value gap
 */
export class ICTSilverBulletStrategy
  implements Strategy<ICTSilverBulletStrategySettings>
{
  private alreadyTraded = false;

  readonly id = 'ict-silver-bullet';
  readonly name = 'ICT Silver Bullet Strategy';

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
    if (!['1m', '5m', '15m', '30m', '1h'].includes(this.symbol.timeperiod)) {
      throw new Error('timeperiod not supported');
    }
  }

  async onTime(time: number, exchange: ExchangeProxy): Promise<void> {
    if (!isTradingHour(time, this.settings)) {
      exchange.activeTrades.forEach((trade) => {
        exchange.cancelTrade(trade);
      });
      this.alreadyTraded = false;
      return;
    }

    if (exchange.activeTrades.length > 0 || this.alreadyTraded) {
      return;
    }

    const serie = await createSerie(time, exchange, this.symbol);
    const trade = this.trade(serie, exchange.balance);

    if (!trade) {
      return;
    }

    exchange.addTrade(trade);
    this.alreadyTraded = true;
  }

  private trade(
    serie: SerieCandlestickPattern,
    balance: number
  ): Trade | undefined {
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
}

export interface ICTSilverBulletStrategySettings extends StrategySettings {
  tradingFees: number;
  startHour: string;
  endHour: string;
  takeProfitRatio: number;
  stopLossMargin: number;
}
