import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export function CardSymbol({
  symbol: { symbol, description },
}: {
  symbol: Symbol;
}) {
  return (
    <Link href={`symbols/${symbol}`}>
      <Card>
        <CardHeader>
          <CardTitle>{symbol}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
