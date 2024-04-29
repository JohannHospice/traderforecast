import { getTimeperiodIncrementInMs } from '../helpers/timeperiod';
import { ExchangeProxy } from '../exchange-proxy';
import { Strategy, StrategySettings } from '.';
import { Trade } from '../trade';
import { Symbol } from '..';
import { SerieCandlestickPattern } from '../serie-candlestick-pattern';
import { createSerie } from '../helpers/strategy';

export class ICTUnicornModelStrategy
  implements Strategy<ICTUnicornModelStrategySettings>
{
  private alreadyTraded = false;

  readonly id = 'ict-silver-bullet';
  readonly name = 'ICT Silver Bullet Strategy';

  constructor(
    public symbol: Symbol,
    public settings: ICTUnicornModelStrategySettings
  ) {
    if (this.settings.takeProfitRatio <= 0) {
      throw new Error('takeProfitRatio must be greater than 0');
    }
    if (this.settings.stopLossMargin < 0) {
      throw new Error('stopLossMargin must be greater than 0');
    }
    // if (!['1m', '5m', '15m', '30m', '1h'].includes(this.symbol.timeperiod)) {
    //   throw new Error('timeperiod not supported');
    // }
  }

  async onTime(time: number, exchange: ExchangeProxy): Promise<void> {
    const serie = await createSerie(time, exchange, this.symbol);
    const trade = this.trade(serie, exchange.balance);

    if (!trade) {
      return;
    }

    exchange.addTrade(trade);
    this.alreadyTraded = true;
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

  getSettingsDefinition(): Record<
    keyof ICTUnicornModelStrategySettings,
    string
  > {
    return {
      takeProfitRatio: 'number',
      stopLossMargin: 'number',
      tradingFees: 'number',
    };
  }
}

export interface ICTUnicornModelStrategySettings extends StrategySettings {
  takeProfitRatio: number;
  stopLossMargin: number;
}
