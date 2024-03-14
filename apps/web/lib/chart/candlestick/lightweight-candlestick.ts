import { klineToCandlestick } from '@/lib/helpers/lightweight-charts';
import { ISeriesApi, SeriesType } from 'lightweight-charts';
import { Candlestick } from '.';
import { Indicator } from '../indicator';
import { LightWeightMarkerFactory } from './marker-factory/lightweight-marker-factory';
import { LightWeightPriceLineFactory } from './price-line-factory/lightweight-price-line-factory';

export class LightweightCandlestick implements Candlestick {
  isLight: boolean;
  candlestick: ISeriesApi<SeriesType>;
  klines: Kline[] = [];
  markerFactory = new LightWeightMarkerFactory();
  priceLineFactory = new LightWeightPriceLineFactory();

  constructor(candlestick: ISeriesApi<SeriesType>, isLight: boolean = false) {
    this.candlestick = candlestick;
    this.isLight = isLight;

    this.candlestick.applyOptions(
      this.isLight ? CANDLESTICK_LIGHT_OPTIONS : CANDLESTICK_DARK_OPTIONS
    );
  }

  setData(klines: Kline[]) {
    this.klines = klines;
    this.candlestick.setData(klines.map((kline) => klineToCandlestick(kline)));
  }

  applyIndices(indices: Indicator[]) {
    indices.forEach((indice) => {
      const { markers, priceLines } = indice.execute(this.klines);

      if (markers) {
        this.candlestick.setMarkers(
          [
            ...this.candlestick.markers(),
            ...markers.map((marker) => this.markerFactory.createMarker(marker)),
          ].sort((a, b) => +a.time - +b.time)
        );
      }

      if (priceLines) {
        priceLines.forEach((priceLine) =>
          this.candlestick.createPriceLine(
            this.priceLineFactory.createPriceline(priceLine)
          )
        );
      }
    });
  }

  update(klines: Kline[]) {
    this.klines = [...klines, klines[0]];
    this.candlestick.update(klineToCandlestick(klines[0]));
  }
}

const CANDLESTICK_DARK_OPTIONS = {
  wickUpColor: 'rgb(54, 116, 217)',
  upColor: 'rgb(54, 116, 217)',
  wickDownColor: 'rgb(225, 50, 85)',
  downColor: 'rgb(225, 50, 85)',
  borderVisible: false,
};
const CANDLESTICK_LIGHT_OPTIONS = {};
