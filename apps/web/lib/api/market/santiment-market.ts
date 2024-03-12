import { ApolloClient, gql } from '@apollo/client';

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
        openTime: new Date(kline.datetime).getTime(),
        open: kline.openPriceUsd,
        high: kline.highPriceUsd,
        low: kline.lowPriceUsd,
        close: kline.closePriceUsd,
        volume: '0',
        closeTime: new Date(kline.datetime).getTime(),
        quoteAssetVolume: '0',
        numberOfTrades: 0,
        takerBuyBaseAssetVolume: '0',
        takerBuyQuoteAssetVolume: '0',
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
        query ($slug: String) {
          allProjects(
            page: 1
            pageSize: 30
            minVolume: 50
            selector: { baseProjects: { slugs: $slug } }
          ) {
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
      },
    });
    if (params?.query) {
      const query = params.query.toLowerCase();
      return allProjects;
      // .filter(
      //   (project) =>
      //     project.slug.toLowerCase().includes(query) ||
      //     project.name.toLowerCase().includes(query)
      // )
      // .sort((a, b) => a.slug.localeCompare(b.slug));
    }
    console.log(allProjects);

    return allProjects;
  }
}
