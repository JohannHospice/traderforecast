import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatNumber, formatPercent } from '@traderforecast/utils/string';
import { PriceTitle } from './price-title';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Symbol } from '@/lib/api/dependancies/market/models/symbol';

export default function CardSymbol({
  symbol,
  className,
}: {
  symbol: Symbol;
  className?: string;
}) {
  return (
    <Card noBorder className={'flex flex-col ' + className}>
      <CardHeader className={'flex flex-row items-center gap-4 relative'}>
        <Avatar className='w-8 h-8'>
          <AvatarImage src={symbol.logoUrl} />
          <AvatarFallback>{symbol.slug}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col w-full'>
          <CardTitle className='flex justify-between'>
            {symbol.ticker}
          </CardTitle>
          <CardDescription>{symbol.name}</CardDescription>
        </div>
        <Badge
          variant='outline'
          className='flex-auto bg-background text-nowrap place-self-start'
        >
          Rank #{symbol.rank}
        </Badge>
      </CardHeader>
      {/* flex flex-col gap-8 p-4 sm:p-8 */}
      <CardContent className={'flex-1 justify-between'}>
        <div className={'flex flex-col gap-2'}>
          <PriceTitle
            title='Price'
            value={formatNumber(symbol.price_usd, 'standard')}
          />
          <PriceTitle
            title='Market Cap'
            value={formatNumber(symbol.marketcap_usd, 'compact')}
          />
          <PriceTitle
            title='Volume'
            value={formatNumber(symbol.volume_usd, 'compact')}
          />
          <PriceTitle
            value={
              <div
                className={
                  symbol.price_usd_change_1d && symbol.price_usd_change_1d > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {formatPercent(symbol.price_usd_change_1d)}
              </div>
            }
            title='Change 24h'
          />
        </div>
        <div className='flex flex-wrap overflow-hidden gap-2'>
          {symbol.market_segments &&
            symbol.market_segments.map((segment) => (
              <Badge
                key={segment}
                variant='secondary'
                className='text-sm text-nowrap'
              >
                {segment}
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
