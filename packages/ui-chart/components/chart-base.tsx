import { IChartApi } from 'lightweight-charts';
import { forwardRef, useCallback, useState } from 'react';
import { ChartProvider } from './contexts/chart-provider';

export const ChartBase = forwardRef(
  (
    props: Omit<React.ComponentProps<typeof ChartProvider>, 'container'> & {
      className?: string;
    },
    ref: React.Ref<IChartApi>
  ) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const handleRef = useCallback((ref: HTMLDivElement | null) => {
      setContainer(ref);
    }, []);

    return (
      <div className={'relative flex flex-1' + props.className}>
        <div ref={handleRef} className='absolute top-0 left-0 right-0 bottom-0'>
          {container && (
            <ChartProvider {...props} ref={ref} container={container} />
          )}
        </div>
      </div>
    );
  }
);
ChartBase.displayName = 'ChartBase';
