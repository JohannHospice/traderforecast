import { GetServerSideProps, GetStaticProps } from 'next';
import prisma from '../../../lib/prisma';

export const getStaticProps: GetStaticProps = async () => {
  const backtests = await prisma.backtest.findMany({
    include: {
      author: true,
    },
  });
  return {
    props: { backtests },
    revalidate: 10,
  };
};

export default async function Page({ backtests }: { backtests: Backtest[] }) {
  return (
    <>
      <pre>{JSON.stringify(backtests, null, 2)}</pre>
    </>
  );
}
type Backtest = any;
