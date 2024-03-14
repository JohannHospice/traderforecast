'use client';

export type SerieApplierKeys = keyof typeof SerieApplierKeysSet;

export const SerieApplierKeysSet = {
  topbottom: 'Top and Bottom',
  top: 'Top',
  bottom: 'Bottom',
  resistance: 'Resistance',
};

export const SerieApplierOptions = Object.keys(SerieApplierKeysSet).map(
  (key) => ({
    value: key as SerieApplierKeys,
    label: SerieApplierKeysSet[key as SerieApplierKeys],
  })
);
