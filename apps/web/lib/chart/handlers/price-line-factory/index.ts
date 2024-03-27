export interface PriceLineFactory<T> {
  createPriceline(options: {
    title?: string;
    price: number;
    color?: string;
  }): T;
}
