'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useChartSettings } from '@/lib/contexts/chart-settings-context';
import { TradeIndicator } from '@/lib/modules/chart/indicators/trade-indicator';
import { Trade } from '@traderforecast/database';
import { useCallback, useEffect, useState } from 'react';
import { Chart } from '../../../market/[slug]/_components/chart';
import { actionGetKlines } from '../../../../lib/actions/get-klines';

export function BacktestChartDialog({
  trades,
  slug,
  interval,
}: {
  trades: Trade[];
  slug: string;
  interval: string;
}) {
  const { setLive, setCustomIndicators } = useChartSettings();
  const [startTime, setStartUtc] = useState<string>('');
  const [klines, setKlines] = useState<Kline[]>([]);

  const getKlines = useCallback(
    async (newStart: string) => {
      setStartUtc(newStart);
      setKlines(await actionGetKlines({ slug, interval, startTime: newStart }));
    },
    [slug, interval]
  );

  useEffect(() => {}, [setLive, getKlines]);

  useEffect(() => {
    setCustomIndicators([new TradeIndicator(trades)]);
  }, [setCustomIndicators, trades]);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>View Trades on Chart</Button>
        </DialogTrigger>
        <DialogContent
          className='sm:max-w-4xl'
          onOpenAutoFocus={() => {
            setLive(true);
            getKlines('utc_now-1h');
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {slug} - {interval}
            </DialogTitle>
            <DialogDescription>
              Visualize the trades on the chart
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col h-[50vh] w-full relative'>
            <Chart
              klines={klines}
              interval={interval as IntervalKeys}
              startUtc={startTime}
              onGetMoreData={getKlines}
            />
          </div>
          <DialogFooter className='sm:justify-start'>
            <DialogClose asChild>
              <Button type='button' variant='secondary'>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
