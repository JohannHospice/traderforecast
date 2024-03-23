import { useCallback, useState } from 'react';
import { ChartContainer } from './chart-container';

export function Chart(props: any) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const handleRef = useCallback((ref: HTMLDivElement | null) => {
    setContainer(ref);
  }, []);

  return (
    <div className={'relative flex flex-1 min-h-[480px]'}>
      <div ref={handleRef} className='absolute top-0 left-0 right-0 bottom-0'>
        {container && <ChartContainer {...props} container={container} />}
      </div>
    </div>
  );
}
