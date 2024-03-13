import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PriceTitle } from './price-title';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { formatNumber, formatPercent } from '../lib/helpers/string';

export default function CardSymbol({
  symbol,
  horizontal,
  className,
}: {
  symbol: Symbol;
  horizontal?: boolean;
  className?: string;
}) {
  return (
    <Card
      className={
        'relative ' + (horizontal ? ' flex m-0 pr-24 ' : '') + className
      }
    >
      <Badge variant='outline' className='absolute top-0 right-0 mt-2 mr-2'>
        Rank #{symbol.rank}
      </Badge>

      <CardHeader
        className={
          'flex flex-row items-center' +
          (horizontal ? ' gap-8 mt-0' : ' gap-4 mt-2')
        }
      >
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
      </CardHeader>
      <CardContent
        className={
          'flex gap-4 ' +
          (horizontal ? 'flex-row items-center gap-8 p-0' : 'flex-col')
        }
      >
        <div
          className={
            horizontal
              ? 'flex flex-row items-center gap-8 p-0'
              : 'flex flex-col gap-2'
          }
        >
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
