'use client';
import { ChartDetector } from '@/lib/chart/detector';
import { TopAndBottomMarkers } from '@/lib/chart/detector/marker-detector/top-and-bottom-markers';
import { TopMarkers } from '@/lib/chart/detector/marker-detector/top-markers';
import { useMemo } from 'react';
import { BottomMarkers } from '../chart/detector/marker-detector/bottom-markers';
import { MarkerDetectorApplier } from '../chart/applier/marker-detector-applier';
import { ChartApplier } from '../chart/applier';
import { ResistanceDetector } from '../chart/detector/price-line-detector/resistance-detector';
import { PriceLineDetectorApplier } from '../chart/applier/priceline-detector-applier';

export type MarkerKeys = keyof typeof MARKER_OPTION_LABELS_SET;

// TODO: change marker colors based on isLight
export function useChartDetector(isLight?: boolean) {
  const detectors = useMemo(
    () =>
      ({
        'top-bottom': new MarkerDetectorApplier(new TopAndBottomMarkers()),
        top: new MarkerDetectorApplier(new TopMarkers()),
        bottom: new MarkerDetectorApplier(new BottomMarkers()),
        resistance: new PriceLineDetectorApplier(new ResistanceDetector()),
      }) as {
        [key in MarkerKeys]: ChartApplier;
      },
    [isLight]
  );
  return {
    get(option: MarkerKeys) {
      return detectors[option];
    },
  };
}

export const MARKER_OPTION_LABELS_SET = {
  'top-bottom': 'Top and Bottom',
  top: 'Top',
  bottom: 'Bottom',
  resistance: 'Resistance',
};

export const MARKER_OPTIONS = Object.keys(MARKER_OPTION_LABELS_SET).map(
  (key) => ({
    value: key as MarkerKeys,
    label: MARKER_OPTION_LABELS_SET[key as MarkerKeys],
  })
);
