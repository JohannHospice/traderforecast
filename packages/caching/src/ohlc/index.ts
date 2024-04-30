export type OHLC = {
  open: number;
  high: number;
  low: number;
  close: number;
  openTime: number;
  // search criteria
  closeTime: number;
  interval: string;
  symbol: string;
  origin: string;
};
export interface GetOHLCsSearchParams {
  startTime?: number;
  endTime?: number;
  interval?: string;
  symbol?: string;
  origin?: string;
}
