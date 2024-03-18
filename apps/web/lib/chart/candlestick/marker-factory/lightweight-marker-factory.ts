import { SeriesMarker, Time } from 'lightweight-charts';
import { MarkerFactory } from '.';
import { Marker } from '../../indicator';
import { millisecondsToTime } from '@/lib/helpers/unit';

export class LightWeightMarkerFactory
  implements MarkerFactory<SeriesMarker<Time>>
{
  createMarker({
    time,
    color = 'black',
    position = 'inBar',
    shape = 'circle',
    text,
    size,
  }: Marker): SeriesMarker<Time> {
    return {
      time: millisecondsToTime(time),
      position,
      color,
      shape,
      text,
      size,
    };
  }
}
