import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const backtests = await prisma.backtest.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      symbol: true,
      strategy: true,
      trades: true,
    },
  });

  return (
    <>
      <Heading
        title='Backtesting'
        breadcrumbs={[
          {
            title: 'All Backtests',
            href: '/backtesting',
            icon: ArrowLeft,
          },
          {
            title: backtests.id,
          },
        ]}
      />
      <Container fluid className='flex-1 gap-8'>
        <DataComponent data={backtests} />
      </Container>
    </>
  );
}

function DataComponent({ data }: { data: any }) {
  return (
    <div className='relative flex-1'>
      <pre className='flex-1 text-sm'>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
