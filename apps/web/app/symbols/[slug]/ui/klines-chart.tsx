'use client';

import { LightWeightChart } from '../../../../components/chart-lightweight';
import {
  ColorType,
  SeriesMarker,
  Time,
  UTCTimestamp,
} from 'lightweight-charts';
import { Card, CardContent } from '../../../../components/ui/card';
import { IntervalNav } from './interval-nav';

export function KlinesChart({ klines }: { klines: Kline[] }) {
  return (
    <Card className='flex flex-1'>
      <CardContent className='flex flex-col flex-1 p-8 gap-4'>
        <IntervalNav />
        <LightWeightChart
          className='flex-1'
          options={{
            layout: {
              background: {
                type: ColorType.Solid,
                color: 'white',
              },
              textColor: 'black',
            },
          }}
          onInit={({ chart, klinesToCandlestickSeries }) => {
            const serie = chart.addCandlestickSeries();

            serie.setData(klinesToCandlestickSeries(klines));

            // serie.setMarkers(findTopsAndBottoms(klines));
          }}
        />
      </CardContent>
    </Card>
  );
}

function findTopsAndBottoms(klines: Kline[]) {
  const markers: SeriesMarker<Time>[] = [];
  const significatKlines = [klines[0]];

  for (let i = 1; i < klines.length - 1; i++) {
    const current = klines[i];
    const previous = significatKlines[significatKlines.length - 1];

    const isHigh = current.high > previous.high;
    const isLow = current.low < previous.low;

    if (isHigh) {
      significatKlines.push(current);
      markers.push({
        time: (current.openTime / 1000) as UTCTimestamp,
        position: 'aboveBar',
        color: 'green',
        shape: 'arrowDown',
      });
    }

    if (isLow) {
      significatKlines.push(current);
      markers.push({
        time: (current.openTime / 1000) as UTCTimestamp,
        position: 'belowBar',
        color: 'red',
        shape: 'arrowUp',
      });
    }
  }

  return markers;
}
