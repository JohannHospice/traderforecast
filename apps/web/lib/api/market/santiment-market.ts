import { ApolloClient, gql } from '@apollo/client';
import dayjs from 'dayjs';

export class SantimentMarket<T> implements Market {
  client: ApolloClient<T>;

  constructor(client: ApolloClient<T>) {
    this.client = client;
  }

  intervals: string[] = ['1h', '4h', '1d', '1w', '2w'];

  async lastKline(params: { slug: string; interval: string }): Promise<Kline> {
    const {
      data: { klines },
    } = await this.client.query({
      query: gql`
        query ($slug: String!, $from: DateTime!, $interval: interval!) {
          klines: ohlc(
            slug: $slug
            interval: $interval
            from: $from
            to: "utc_now"
          ) {
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
    return klines[0];
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
        ) {
          klines: ohlc(slug: $slug, from: $from, to: $to, interval: $interval) {
            lowPriceUsd
            highPriceUsd
            openPriceUsd
            closePriceUsd
            datetime
          }

          symbol: projectBySlug(slug: $slug) {
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

  async symbols(params?: {
    query?: string | undefined;
    segments?: string[];
    page?: number;
    size?: number;
  }): Promise<{ symbols: Symbol[]; pages: number }> {
    console.log({ params });

    const {
      data: { allProjects },
    } = await this.client.query<{ allProjects: Symbol[] }>({
      query: gql`
        query ($minVolume: Int, $page: Int, $size: Int) {
          allProjects(minVolume: $minVolume, page: $page, pageSize: $size) {
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
        minVolume: 0,
        page: params?.page,
        size: params?.size,
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

    return { symbols: allUniqueProjects, pages: 1 };
  }
}
