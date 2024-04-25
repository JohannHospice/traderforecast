import { ApolloClient, gql } from '@apollo/client';
import { mapOhlcToKline } from '../../mappers/ohlc';
import {
  GetAllSymbolResponse,
  GetKlinesAndSymbolParams,
  GetOHLCParams,
  MarketRepository,
} from '.';

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
      data: {
        getMetric: { timeseriesData },
      },
    } = await this.client.query({
      context: {
        log: 'DATA',
      },
      query: gql`
        query getLatestKline(
          $slug: String!
          $from: DateTime!
          $to: DateTime!
          $interval: interval!
        ) {
          getMetric(metric: "price_usd") {
            timeseriesData(
              selector: { slug: $slug, source: "cryptocompare" }
              from: $from
              to: $to
              interval: $interval
              aggregation: OHLC
              cachingParams: { baseTtl: 1, maxTtlOffset: 1 }
            ) {
              datetime
              valueOhlc {
                close
                high
                low
                open
              }
            }
          }
        }
      `,
      variables: {
        slug: params.slug,
        interval: params.interval,
        to: 'utc_now',
        from: 'utc_now-' + 1 + params.interval.slice(-1),
      },
    });

    const [{ valueOhlc, datetime }] = timeseriesData;
    return {
      close: parseFloat(valueOhlc.close),
      high: parseFloat(valueOhlc.high),
      low: parseFloat(valueOhlc.low),
      open: parseFloat(valueOhlc.open),
      closeTime: new Date(datetime).getTime(),
      openTime: new Date(datetime).getTime(),
    };
  }

  async getOHLCs({
    slug,
    interval,
    startTime,
    endTime,
  }: GetOHLCParams): Promise<Kline[]> {
    const {
      data: {
        getMetric: { timeseriesData },
      },
    } = await this.client.query({
      query: gql`
        query ohlcs(
          $slug: String!
          $from: DateTime!
          $to: DateTime!
          $interval: interval!
        ) {
          getMetric(metric: "price_usd") {
            timeseriesData(
              selector: { slug: $slug, source: "cryptocompare" }
              from: $from
              to: $to
              interval: $interval
              aggregation: OHLC
              cachingParams: { baseTtl: 1, maxTtlOffset: 1 }
            ) {
              datetime
              valueOhlc {
                close
                high
                low
                open
              }
            }
          }
        }
      `,
      variables: {
        slug: slug,
        interval: interval,
        from: startTime && new Date(startTime)?.toISOString(),
        to: endTime && new Date(endTime)?.toISOString(),
      },
    });

    return timeseriesData.map((data: any) => ({
      close: parseFloat(data.valueOhlc.close),
      high: parseFloat(data.valueOhlc.high),
      low: parseFloat(data.valueOhlc.low),
      open: parseFloat(data.valueOhlc.open),
      closeTime: new Date(data.datetime).getTime(),
      openTime: new Date(data.datetime).getTime(),
    }));
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
              pageSize: 100,
            },
          },
        }),
      },
    });

    return projects.filter(
      (project, index, self) =>
        index === self.findIndex((p) => p.slug === project.slug)
    );
  }
}
