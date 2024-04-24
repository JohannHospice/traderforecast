/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    '@traderforecast/database',
    '@traderforecast/lightweight-charts-plugin',
    '@traderforecast/ui-chart',
    '@traderforecast/config-tailwind',
    '@traderforecast/config-eslint',
    '@traderforecast/utils',
    '@traderforecast/trading',
  ],
};
