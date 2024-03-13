'use client';
import { MarkerDetector } from '@/lib/chart/marker-detector';
import { TopAndBottomMarkers } from '@/lib/chart/marker-detector/top-and-bottom-markers';
import { TopMarkers } from '@/lib/chart/marker-detector/top-markers';
import { useMemo } from 'react';

export type MarkerKeys = keyof typeof MARKER_OPTION_LABELS_SET;

export function useMarkerDetector(isLight?: boolean): {
  [key in MarkerKeys]: MarkerDetector;
} {
  return useMemo(
    () => ({
      // TODO: change marker colors based on isLight
      'top-bottom': new TopAndBottomMarkers(),
      top: new TopMarkers(),
    }),
    [isLight]
  );
}

export const MARKER_OPTION_LABELS_SET = {
  'top-bottom': 'Top and Bottom',
  top: 'Top',
};

export const MARKER_OPTIONS = Object.keys(MARKER_OPTION_LABELS_SET).map(
  (key) => ({
    value: key as MarkerKeys,
    label: MARKER_OPTION_LABELS_SET[key as MarkerKeys],
  })
);
