import type { Config } from 'tailwindcss';
import sharedConfig from '@traderforecast/tailwind-config';

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
  content: ['./**/*.tsx'],
  prefix: 'ui-',
  presets: [sharedConfig],
};

export default config;
