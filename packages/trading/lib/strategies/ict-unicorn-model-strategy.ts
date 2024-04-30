import { ExchangeProxy } from '../exchange-proxy';
import { Strategy, StrategySettings } from '.';
import { Trade } from '../trade';
import { Symbol } from '..';
import { SerieCandlestickPattern } from '@traderforecast/utils/serie-candlestick-pattern';
import { createSerie } from '../helpers/strategy';
import { getTimeperiodIncrementInMs } from '../helpers/timeperiod';

export class ICTUnicornModelStrategy
  implements Strategy<ICTUnicornModelStrategySettings>
{
  readonly id = 'ict-unicon-model-strategy';
  readonly name = 'ICT Unicorn Model Strategy';

  constructor(
    public symbol: Symbol,
    public settings: ICTUnicornModelStrategySettings = {}
  ) {}

  async onTime(time: number, exchange: ExchangeProxy): Promise<void> {
    if (exchange.activeTrades.filter((trade) => trade!.isStatus('AWAIT'))) {
      return;
    }
    const from = time - getTimeperiodIncrementInMs(this.symbol.timeperiod) * 50;
    const to = time;

    const ohlcs = await exchange.getMarket(this.symbol).getOHLCs({
      from,
      to,
    });
    const serie = new SerieCandlestickPattern(ohlcs);
    const trade = this.trade(serie, exchange.balance);

    if (!trade) {
      return;
    }

    if (exchange.activeTrades.length > 0) {
      exchange.trades
        .filter((trade) => trade.isStatus('AWAIT'))
        .forEach((trade) => exchange.cancelTrade(trade));
    }

    exchange.addTrade(trade);
  }

  private seenBreakerBlock: Record<number, boolean> = {};

  trade(serie: SerieCandlestickPattern, balance: number): Trade | undefined {
    const breakerBlock = serie.findLastBreakerBlock(0, serie.length - 1);
    if (!breakerBlock || this.seenBreakerBlock[breakerBlock.breakerBlock]) {
      return undefined;
    }

    this.seenBreakerBlock[breakerBlock.breakerBlock] = true;

    if (breakerBlock.isBullish) {
      const entryPrice = serie.get(breakerBlock.breakerBlock).close;
      return new Trade({
        entryPrice,
        amount: Trade.buyAmount(balance, entryPrice),
        stopLoss: Trade.addMargin(
          serie.get(breakerBlock.breakerBlock).low,
          0.0001
        ),
        takeProfit: serie.getPreviousHigherSwing(
          breakerBlock.breakerBlock,
          breakerBlock.higherSwingHigh
        ).high,
      });
    }

    const entryPrice = serie.get(breakerBlock.breakerBlock).close;
    return new Trade({
      entryPrice,
      amount: Trade.buyAmount(balance, entryPrice),
      stopLoss: Trade.addMargin(
        serie.get(breakerBlock.breakerBlock).high,
        0.0001
      ),
      takeProfit: serie.getPreviousLowerSwing(
        breakerBlock.breakerBlock,
        breakerBlock.lowerSwingLow
      ).low,
    });
  }

  getSettingsDefinition(): Record<
    keyof ICTUnicornModelStrategySettings,
    string
  > {
    return {};
  }
}

export interface ICTUnicornModelStrategySettings extends StrategySettings {}
