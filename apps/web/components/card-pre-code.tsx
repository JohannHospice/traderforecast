import { Card, CardContent } from '@/components/ui/card';

export function CardPreCode({ data }: { data: any }) {
  return (
    <Card>
      <CardContent noHeader>
        <div className='relative flex-1'>
          <pre className='flex-1 text-sm'>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  );
}
