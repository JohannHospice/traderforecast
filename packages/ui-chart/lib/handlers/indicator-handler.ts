import { TrendLine } from '@traderforecast/lightweight-charts-plugin/trend-line/trend-line';
import {
  IChartApi,
  IPriceLine,
  ISeriesApi,
  SeriesType,
  Time,
} from 'lightweight-charts';
import {
  Indicator,
  Marker,
  PriceLine,
  Rectangle,
  Trendline,
} from '../indicators';
import { LightWeightMarkerFactory } from './marker-factory/lightweight-marker-factory';
import { LightWeightPriceLineFactory } from './price-line-factory/lightweight-price-line-factory';
import { LightWeightRectangleFactory } from './rectangle-factory/lightweight-rectangle-factory';
import { LightWeightTrendFactory } from './trend-factory/lightweight-trend-factory';

export class IndicatorHandler {
  series: ISeriesApi<SeriesType, Time> | null = null;
  chart: IChartApi | null = null;

  pricelines: IPriceLine[] = [];
  primitives: TrendLine[] = [];

  assign(series: ISeriesApi<SeriesType, Time>, chart: IChartApi) {
    this.series = series;
    this.chart = chart;
  }

  apply(
    klines: Kline[],
    indicators: (new () => Indicator)[],
    customIndicators: Indicator[],
    isLight: boolean
  ) {
    Promise.all(
      [
        ...indicators.map((Indicator) => new Indicator()),
        ...customIndicators,
      ].map((indicator) => {
        if (indicator.setTheme) {
          indicator.setTheme(isLight);
        }

        const { markers, priceLines, rectangles, trendlines } =
          indicator.execute(klines);

        this.applyRectangles(rectangles);

        this.applyMarkers(markers);

        this.applyPricelines(priceLines);

        this.applyTrendline(trendlines);
      })
    ).catch((error) => {
      console.error('Error on indicator: ', error);
    });
  }

  clear() {
    if (!this.series) {
      return;
    }

    this.series.setMarkers([]);

    for (const trend of this.primitives) {
      this.series.detachPrimitive(trend);
    }
    for (const priceline of this.pricelines) {
      this.series.removePriceLine(priceline);
    }
  }

  applyRectangles(rectangles: Rectangle[] | undefined) {
    if (!rectangles || !this.chart || !this.series) {
      return;
    }

    const rectangleFactory = new LightWeightRectangleFactory();

    for (const rectangle of rectangles) {
      this.primitives = [
        ...this.primitives,
        ...rectangleFactory.createRectangle(this.chart, this.series, rectangle),
      ];
    }
  }

  applyMarkers(markers: Marker[] | undefined) {
    if (!markers || !this.series) {
      return;
    }

    const markerFactory = new LightWeightMarkerFactory();

    for (const marker of markers) {
      this.series.setMarkers(
        [...this.series.markers(), markerFactory.createMarker(marker)].sort(
          (a, b) => +a.time - +b.time
        )
      );
    }
  }

  applyPricelines(priceLines: PriceLine[] | undefined) {
    if (!priceLines || !this.series) {
      return;
    }

    const pricelineFactory = new LightWeightPriceLineFactory();

    for (const priceLine of priceLines) {
      this.pricelines = [
        ...this.pricelines,
        this.series.createPriceLine(
          pricelineFactory.createPriceline(priceLine)
        ),
      ];
    }
  }

  applyTrendline(trendlines: Trendline[] | undefined) {
    if (!trendlines || !this.chart || !this.series) {
      return;
    }

    const trendlineFactory = new LightWeightTrendFactory();

    for (const trendline of trendlines) {
      this.primitives = [
        ...this.primitives,
        trendlineFactory.createTrend(this.chart, this.series, trendline),
      ];
    }
  }
}
