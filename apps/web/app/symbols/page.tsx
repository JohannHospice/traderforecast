import { CardSymbol } from '../../components/ui/card-symbol';
import { BinanceMarketApi } from '../../lib/market-api/binance-market-api';

export default async function Page() {
  const symbols = await new BinanceMarketApi().symbols();

  return (
    <div className=''>
      {symbols.map((symbol) => {
        return <CardSymbol key={symbol.symbol} symbol={symbol} />;
      })}
    </div>
  );
}
