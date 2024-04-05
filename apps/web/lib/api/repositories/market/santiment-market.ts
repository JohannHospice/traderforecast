import { ApolloClient, gql } from '@apollo/client';
import { mapOhlcToKline } from '../../mappers/ohlc';
import { GetAllSymbolResponse, MarketRepository } from '.';

export class SantimentMarketRepository<T> implements MarketRepository {
  client: ApolloClient<T>;

  constructor(client: ApolloClient<T>) {
    this.client = client;
  }

  intervals: IntervalKeys[] = ['1h', '4h', '1d', '1w', '2w'];

  async getLatestKline(params: {
    slug: string;
    interval: string;
  }): Promise<Kline> {
    const {
      data: { ohlc },
    } = await this.client.query({
      context: {
        log: 'DATA',
      },
      query: gql`
        query getLatestKline(
          $slug: String!
          $from: DateTime!
          $interval: interval!
        ) {
          ohlc(slug: $slug, interval: $interval, from: $from, to: "utc_now") {
            lowPriceUsd
            highPriceUsd
            openPriceUsd
            closePriceUsd
            datetime
          }
        }
      `,
      variables: {
        slug: params.slug,
        interval: params.interval,
        from: 'utc_now-' + 1 + params.interval.slice(-1),
      },
    });
    return mapOhlcToKline(ohlc[0]);
  }

  async getKlinesAndSymbol({
    slug,
    interval = '1d',
    startTime = 'utc_now-7d',
    endTime = 'utc_now',
  }: {
    slug: string;
    interval?: IntervalKeys;
    startTime?: number | string;
    endTime?: number | string;
  }): Promise<{ symbol: Symbol; klines: Kline[] }> {
    const {
      data: { ohlc, projectBySlug },
    } = await this.client.query({
      query: gql`
        query getKlinesAndSymbol(
          $slug: String!
          $from: DateTime!
          $to: DateTime!
          $interval: interval!
        ) {
          ohlc(slug: $slug, from: $from, to: $to, interval: $interval) {
            lowPriceUsd
            highPriceUsd
            openPriceUsd
            closePriceUsd
            datetime
          }

          projectBySlug(slug: $slug) {
            slug
            name
            ticker
            logoUrl
            rank
            market_segments
            price_usd: aggregatedTimeseriesData(
              metric: "price_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            price_usd_change_1d: aggregatedTimeseriesData(
              metric: "price_usd_change_1d"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            volume_usd: aggregatedTimeseriesData(
              metric: "volume_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            marketcap_usd: aggregatedTimeseriesData(
              metric: "marketcap_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
          }
        }
      `,
      variables: {
        slug: slug,
        interval: interval,
        from: startTime,
        to: endTime,
      },
    });

    return {
      symbol: projectBySlug,
      klines: ohlc.map(mapOhlcToKline),
    };
  }

  async getSymbol(slug: string): Promise<Symbol> {
    const {
      data: { projectBySlug },
    } = await this.client.query({
      query: gql`
        query getSymbol($slug: String!) {
          projectBySlug(slug: $slug) {
            slug
            name
            ticker
            logoUrl
            rank
            market_segments
            price_usd: aggregatedTimeseriesData(
              metric: "price_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            price_usd_change_1d: aggregatedTimeseriesData(
              metric: "price_usd_change_1d"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            volume_usd: aggregatedTimeseriesData(
              metric: "volume_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            marketcap_usd: aggregatedTimeseriesData(
              metric: "marketcap_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
          }
        }
      `,
      variables: {
        slug: slug,
      },
    });

    return projectBySlug;
  }

  async getAllSymbols(): Promise<GetAllSymbolResponse> {
    const {
      data: { allProjects },
    } = await this.client.query({
      query: gql`
        query getAllSymbols {
          allProjects {
            slug
            marketSegments
            rank
            ticker
          }
        }
      `,
    });
    return allProjects;
  }

  async getSymbolsBySlugs(slugs: string[]): Promise<Symbol[]> {
    const {
      data: { allProjects },
    } = await this.client.query({
      query: gql`
        query getSymbolsBySlugs($slugs: [String]!) {
          allProjects(selector: { baseProjects: { slugs: $slugs } }) {
            slug
            name
            ticker
            logoUrl
            rank
            market_segments
            price_usd: aggregatedTimeseriesData(
              metric: "price_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            price_usd_change_1d: aggregatedTimeseriesData(
              metric: "price_usd_change_1d"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            volume_usd: aggregatedTimeseriesData(
              metric: "volume_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            marketcap_usd: aggregatedTimeseriesData(
              metric: "marketcap_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
          }
        }
      `,
      variables: {
        slugs,
      },
    });

    return allProjects;
  }

  async getSymbols(params?: {
    query?: string | undefined;
    segments?: string[];
    page?: number;
    size?: number;
  }): Promise<{ symbols: Symbol[]; pages: number }> {
    const {
      data: { allProjects },
    } = await this.client.query<{ allProjects: Symbol[] }>({
      query: gql`
        query getSymbols(
          $minVolume: Int
          $page: Int
          $pageSize: Int
          $segments: [String]
        ) {
          allProjects(
            minVolume: $minVolume
            page: $page
            pageSize: $pageSize
            selector: { slugs: $segments }
          ) {
            slug
            name
            ticker
            logoUrl
            market_segments
            rank
            price_usd: aggregatedTimeseriesData(
              metric: "price_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            price_usd_change_1d: aggregatedTimeseriesData(
              metric: "price_usd_change_1d"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            volume_usd: aggregatedTimeseriesData(
              metric: "volume_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
            marketcap_usd: aggregatedTimeseriesData(
              metric: "marketcap_usd"
              from: "utc_now-1d"
              to: "utc_now"
              aggregation: LAST
            )
          }
        }
      `,
      variables: {
        slug: params?.query,
        page: params?.page,
        pageSize: params?.size,
        segments: params?.segments,
      },
    });

    const query = params?.query ? params.query.toLowerCase() : undefined;

    const allUniqueProjects = allProjects.filter(
      ({ ticker, slug, name, market_segments }, index, self) => {
        const duplicate = self.findIndex((p) => p.ticker === ticker) === index;

        const isSegmentLooklike =
          (params?.segments?.length ?? 0) > 0
            ? params?.segments?.some((seg) =>
                market_segments?.some(
                  (ms) => ms.toLowerCase() === seg.toLowerCase()
                )
              )
            : true;

        if (query) {
          return (
            duplicate &&
            isSegmentLooklike &&
            (slug.toLowerCase().includes(query) ||
              name.toLowerCase().includes(query) ||
              ticker?.toLowerCase().includes(query))
          );
        }

        return duplicate && isSegmentLooklike;
      }
    );

    return { symbols: allProjects, pages: 1 };
  }

  async getMarketSegments(): Promise<string[]> {
    const {
      data: { currenciesMarketSegments },
    } = await this.client.query<{
      currenciesMarketSegments: { name: string }[];
    }>({
      query: gql`
        query getMarketSegments {
          currenciesMarketSegments {
            name
          }
        }
      `,
    });

    return currenciesMarketSegments.map((segment) => segment.name);
  }

  async getSortedSymbols(): Promise<Symbol[]> {
    const {
      data: {
        allProjectsByFunction: { projects },
      },
    } = await this.client.query<{
      allProjectsByFunction: { projects: Symbol[] };
    }>({
      query: gql`
        query GetProjects($fn: json) {
          allProjectsByFunction(function: $fn) {
            projects {
              slug
              name
              ticker
            }
          }
        }
      `,
      variables: {
        fn: JSON.stringify({
          name: 'selector',
          args: {
            filters: [
              {
                args: {
                  metric: 'marketcap_usd',
                  operator: 'greater_than',
                  dynamicFrom: '1d',
                  dynamicTo: 'now',
                  aggregation: 'last',
                  threshold: 10000000,
                },
                name: 'metric',
              },
              // {
              //   args: {
              //     metric: 'rank',
              //     operator: 'less_than',
              //     dynamicFrom: '1d',
              //     dynamicTo: 'now',
              //     aggregation: 'last',
              //     threshold: 10,
              //   },
              //   name: 'metric',
              // },
            ],
            orderBy: {
              aggregation: 'last',
              dynamicFrom: '1d',
              direction: 'asc',
              dynamicTo: 'now',
              metric: 'rank',
            },
            pagination: {
              page: 1,
              pageSize: 10,
            },
          },
        }),
      },
    });
    console.log(projects);

    return projects;
  }
}
