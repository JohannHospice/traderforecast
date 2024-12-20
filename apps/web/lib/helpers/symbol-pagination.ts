import {
  GetAllSymbolResponse,
  MarketRepository,
} from '../api/dependancies/market/repositories';

export class SymbolPagination {
  symbols?: GetAllSymbolResponse;

  constructor(
    private market: MarketRepository,
    private pageSize = 20
  ) {}

  private async loadSymbols() {
    this.symbols = (await this.market.getAllSymbols()).toSorted(
      // du rank le plus petit au plus grand en mettant les nulls et undefined à la fin
      (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)
    );
  }

  private getPageSlugs(query: string, segments: string[], page: number) {
    if (!this.symbols) {
      throw new Error('Symbols are not loaded');
    }

    // filter by query and segments
    const filteredSymbols = this.symbols
      // remove duplicates by ticker
      .filter(
        (symbol, index, self) =>
          self.findIndex((s) => s.ticker === symbol.ticker) === index
      )
      .filter((symbol) => {
        if (query) {
          return symbol.slug.includes(query);
        }
        return true;
      })
      .filter((symbol) => {
        if (segments.length) {
          return segments.every((segment) =>
            symbol.marketSegments.includes(segment)
          );
        }
        return true;
      });

    // get page from filteredSymbols
    const pagedSlugs = filteredSymbols
      .slice((page - 1) * this.pageSize, page * this.pageSize)
      .map((symbol) => symbol.slug);
    return pagedSlugs;
  }

  private async getSymbolesBySlugs(pagedSlugs: string[]) {
    return (await this.market.getSymbolsBySlugs(pagedSlugs)).toSorted(
      // du rank le plus petit au plus grand en mettant les nulls et undefined à la fin
      (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)
    );
  }

  async getSymbols({
    query,
    segments,
    page,
  }: {
    query: string;
    segments: string[];
    page: number;
  }) {
    await this.loadSymbols();

    const pagedSlugs = this.getPageSlugs(query, segments, page);

    return await this.getSymbolesBySlugs(pagedSlugs);
  }
}

Array.prototype.toSorted = function <T>(
  this: T[],
  compare: (a: T, b: T) => number
) {
  return this.slice().sort(compare);
};
