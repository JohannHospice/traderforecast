import { Marker } from '../../indicators';

export interface MarkerFactory<T> {
  createMarker(marker: Marker): T;
}
