import { ApolloClient, gql } from '@apollo/client';
import dayjs from 'dayjs';

export class SantimentMarket<T> implements Market {
  client: ApolloClient<T>;

  constructor(client: ApolloClient<T>) {
    this.client = client;
  }

  async klines({
    slug,
    interval = '1d',
    startTime = 'utc_now-7d',
    endTime = 'utc_now',
  }: {
    slug: string;
    interval?: string;
    startTime?: number | string;
    endTime?: number | string;
  }): Promise<{ symbol: Symbol; klines: Kline[] }> {
    const {
      data: { klines, symbol },
    } = await this.client.query({
      query: gql`
        query (
          $slug: String!
          $from: DateTime!
          $to: DateTime!
          $interval: interval!
          $withMarketcap: Boolean!
        ) {
          klines: ohlc(slug: $slug, from: $from, to: $to, interval: $interval) {
            lowPriceUsd
            highPriceUsd
            openPriceUsd
            closePriceUsd
            datetime
          }

          marketcap: getMetric(metric: "marketcap_usd")
            @include(if: $withMarketcap) {
            timeseriesData(
              slug: $slug
              from: $from
              to: $to
              interval: $interval
            ) {
              datetime
              value
            }
          }

          symbol: projectBySlug(slug: $slug) {
            slug
            name
            ticker
            logoUrl
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
            volume_usd_change_1d: aggregatedTimeseriesData(
              metric: "volume_usd_change_1d"
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
            rank
            dev_activity_1d: aggregatedTimeseriesData(
              metric: "dev_activity_1d"
              from: "utc_now-30d"
              to: "utc_now"
              aggregation: AVG
            )
            daily_active_addresses: aggregatedTimeseriesData(
              metric: "daily_active_addresses"
              from: "utc_now-30d"
              to: "utc_now"
              aggregation: AVG
            )
            market_segments
          }
        }
      `,
      variables: {
        slug: slug,
        interval: interval,
        from: startTime,
        to: endTime,
        withMarketcap: false,
      },
    });

    return {
      symbol,
      klines: klines.map((kline: any) => ({
        open: parseFloat(kline.openPriceUsd),
        high: parseFloat(kline.highPriceUsd),
        low: parseFloat(kline.lowPriceUsd),
        close: parseFloat(kline.closePriceUsd),
        openTime: dayjs(kline.datetime).valueOf(),
        closeTime: dayjs(kline.datetime).valueOf(),
      })),
    };
  }

  async symbols(
    params?: { query?: string | undefined } | undefined
  ): Promise<Symbol[]> {
    const {
      data: { allProjects },
    } = await this.client.query<{ allProjects: Symbol[] }>({
      query: gql`
        query ($minVolume: Int) {
          allProjects(minVolume: $minVolume) {
            slug
            name
            ticker
            logoUrl
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
            volume_usd_change_1d: aggregatedTimeseriesData(
              metric: "volume_usd_change_1d"
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
            rank
            dev_activity_1d: aggregatedTimeseriesData(
              metric: "dev_activity_1d"
              from: "utc_now-30d"
              to: "utc_now"
              aggregation: AVG
            )
            daily_active_addresses: aggregatedTimeseriesData(
              metric: "daily_active_addresses"
              from: "utc_now-30d"
              to: "utc_now"
              aggregation: AVG
            )
            market_segments
          }
        }
      `,
      variables: {
        slug: params?.query,
        minVolume: 99999999,
      },
    });
    if (params?.query) {
      const query = params.query.toLowerCase();
      return allProjects.filter(
        (project) =>
          project.slug.toLowerCase().includes(query) ||
          project.name.toLowerCase().includes(query)
      );
      // .sort((a, b) => a.slug.localeCompare(b.slug));
    }
    console.log(allProjects);

    return allProjects;
  }
}
