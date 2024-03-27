'use client';
import { LightWeightMarkerFactory } from '@/lib/chart/handlers/marker-factory/lightweight-marker-factory';
import { LightWeightPriceLineFactory } from '@/lib/chart/handlers/price-line-factory/lightweight-price-line-factory';
import { LightWeightRectangleFactory } from '@/lib/chart/handlers/rectangle-factory/lightweight-rectangle-factory';
import {
  Indicator,
  Marker,
  PriceLine,
  Rectangle,
} from '@/lib/chart/indicators';
import {
  IChartApi,
  IPriceLine,
  ISeriesApi,
  SeriesType,
  Time,
} from 'lightweight-charts';
import { TrendLine } from 'lightweight-charts-plugin/trend-line/trend-line';

export class IndicatorHandler {
  series: ISeriesApi<SeriesType, Time> | null = null;
  chart: IChartApi | null = null;

  pricelines: IPriceLine[] = [];
  primitives: TrendLine[] = [];

  assign(series: ISeriesApi<SeriesType, Time>, chart: IChartApi) {
    this.series = series;
    this.chart = chart;
  }

  apply(klines: Kline[], indicators: (new () => Indicator)[]) {
    Promise.all(
      indicators.map((Indicator) => {
        const indicator = new Indicator();

        const { markers, priceLines, rectangles } = indicator.execute(klines);

        this.applyRectangles(rectangles);

        this.applyMarkers(markers);

        this.applyPricelines(priceLines);
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
}
