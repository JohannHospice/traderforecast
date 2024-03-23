import { ISeriesApi, SeriesType } from 'lightweight-charts';
import { use, useEffect, useRef, useState } from 'react';
import { Chart } from './chart/chart';
import { Series } from './chart/series';
import { useTheme } from 'next-themes';
import {
  OPTIONS_DARK,
  OPTIONS_LIGHT,
} from '../../../../styles/lightweight-charts-options';

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

export const ChartComponent = ({
  colors: {
    backgroundColor = 'white',
    lineColor = '#2962FF',
    textColor = 'black',
  } = {},
}) => {
  const [chartLayoutOptions, setChartLayoutOptions] = useState({});
  // The following variables illustrate how a series could be updated.
  const series1 = useRef<ISeriesApi<SeriesType> | null>(null);
  const series2 = useRef<ISeriesApi<SeriesType> | null>(null);
  const [started, setStarted] = useState(false);
  const [isSecondSeriesActive, setIsSecondSeriesActive] = useState(false);

  useEffect(() => {
    const { current } = series1;
    if (current === null || !started) {
      return;
    }

    let intervalId: NodeJS.Timeout = setInterval(() => {
      currentDate.setDate(currentDate.getDate() + 1);
      const time = currentDate.toISOString().slice(0, 10);

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

  useEffect(() => {
    setChartLayoutOptions({
      background: {
        color: backgroundColor,
      },
      textColor,
    });
  }, [backgroundColor, textColor]);
  const { theme } = useTheme();
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
      <Chart options={theme === 'light' ? OPTIONS_LIGHT : OPTIONS_DARK}>
        <Series
          ref={series1}
          type={'line'}
          data={initialData}
          options={{
            color: 'red',
          }}
        />
        {isSecondSeriesActive && (
          <Series
            ref={series2}
            type={'area'}
            data={initialData2}
            options={{
              color: lineColor,
            }}
          />
        )}
      </Chart>
    </>
  );
};
