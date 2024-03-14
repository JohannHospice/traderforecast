import { Marker } from '../../indicator';

export interface MarkerFactory<T> {
  createMarker(marker: Marker): T;
}
