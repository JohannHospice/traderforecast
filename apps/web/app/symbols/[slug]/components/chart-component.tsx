import { ISeriesApi, SeriesType } from 'lightweight-charts';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import { Series } from './lightweight-chart/series';
import { useTheme } from 'next-themes';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '@/styles/lightweight-charts-options';
import { Chart } from './lightweight-chart/chart';

const initialData = [
  { time: '2018-10-11', value: 52.89 },
  { time: '2018-10-12', value: 51.65 },
  { time: '2018-10-13', value: 51.56 },
  { time: '2018-10-14', value: 50.19 },
  { time: '2018-10-15', value: 51.86 },
  { time: '2018-10-16', value: 51.25 },
];

const initialData2 = [
  { time: '2018-10-11', value: 42.89 },
  { time: '2018-10-12', value: 41.65 },
  { time: '2018-10-13', value: 41.56 },
  { time: '2018-10-14', value: 40.19 },
  { time: '2018-10-15', value: 41.86 },
  { time: '2018-10-16', value: 41.25 },
];
const currentDate = new Date(initialData[initialData.length - 1].time);

export const ChartComponent = () => {
  const { theme } = useTheme();

  const series1 = useRef<ISeriesApi<'Line'> | null>(null);
  const series2 = useRef<ISeriesApi<'Line'> | null>(null);

  const chartLayoutOptions = useMemo(
    () => (theme === 'light' ? OPTIONS_LIGHT : OPTIONS_DARK),
    [theme]
  );

  const [started, setStarted] = useState(false);
  const [isSecondSeriesActive, setIsSecondSeriesActive] = useState(false);

  useEffect(() => {
    const { current } = series1;
    if (current === null || !started) {
      return;
    }

    let intervalId: NodeJS.Timeout = setInterval(() => {
      // load
      currentDate.setDate(currentDate.getDate() + 1);
      const time = currentDate.toISOString().slice(0, 10);
      // console.log(current.dataByIndex());
      // update
      current.update({
        time,
        value: 53 - 2 * Math.random(),
      });

      if (series2.current) {
        series2.current.update({
          time,
          value: 43 - 2 * Math.random(),
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [started]);

  return (
    <>
      <div className='flex gap-4'>
        <button type='button' onClick={() => setStarted((current) => !current)}>
          {started ? 'Stop updating' : 'Start updating series'}
        </button>
        <button
          type='button'
          onClick={() => setIsSecondSeriesActive((current) => !current)}
        >
          {isSecondSeriesActive ? 'Remove second series' : 'Add second series'}
        </button>
      </div>
      <Chart options={chartLayoutOptions}>
        <Series
          ref={series1}
          type='Line'
          data={initialData}
          options={{
            color: 'red',
          }}
        />
        {isSecondSeriesActive && (
          <Series
            ref={series2}
            type='Area'
            data={initialData2}
            options={{
              color: '#2962FF',
            }}
          />
        )}
      </Chart>
    </>
  );
};
