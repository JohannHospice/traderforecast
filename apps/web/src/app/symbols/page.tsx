import { Card } from '../../../@/components/ui/card';
import { Binance } from '../../lib/market-api/Binance';

export default async function Page() {
  const symbols = await new Binance().symbols();
  return (
    <div className=''>
      {symbols.map((symbol) => {
        return <CardSymbol key={symbol.symbol} symbol={symbol} />;
      })}
    </div>
  );
}

function CardSymbol({ symbol: { symbol } }: { symbol: Symbol }) {
  return <Card>{symbol}</Card>;
}
