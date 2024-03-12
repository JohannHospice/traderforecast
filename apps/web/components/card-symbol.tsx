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

export default function CardSymbol({
  symbol,
  horizontal,
}: {
  symbol: Symbol;
  horizontal?: boolean;
}) {
  return (
    <Card className={'relative  ' + (horizontal ? ' flex m-0' : '')}>
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
          'flex gap-2 ' +
          (horizontal ? 'flex-row items-center gap-8 p-0' : 'flex-col')
        }
      >
        <PriceTitle
          title='Price'
          value={symbol.price_usd}
          notation='standard'
        />
        <PriceTitle
          title='Market Cap'
          value={symbol.marketcap_usd}
          notation='compact'
        />
        <PriceTitle
          title='Volume'
          value={symbol.volume_usd}
          notation='compact'
        />
      </CardContent>
    </Card>
  );
}
