'use strict';

import { getFilteredOHLCKeys, getOHLCs } from '../ohlc/get-ohlcs';
import { clearOHLCs, saveOHLCs } from '../ohlc/save-ohlcs';
import { data } from './data';

const KEY_BASE = 'ohlc_data_test';

const SCRIPTS = {
  async up() {
    console.log('Migrating data');

    await saveOHLCs(KEY_BASE, data);

    console.log('Migration complete');
  },
  async down() {
    console.log('Rolling back migration');

    await clearOHLCs(KEY_BASE);

    console.log('Rollback complete');
  },
  async check() {
    const ohlcs = await getOHLCs(KEY_BASE, {
      interval: '30m',
      origin: 'santiment',
      symbol: 'bitcoin',
    });

    console.log('Checking data:', ohlcs);
  },
  async checkScan() {
    const keys = getFilteredOHLCKeys(KEY_BASE, {
      interval: '15m',
      origin: 'santiment',
      symbol: 'bitcoin',
    });

    console.log('Checking keys:', keys);
  },
  async clear() {
    console.log('Rolling all data back');

    await clearOHLCs();

    console.log('Rollback complete');
  },
};

(function main() {
  const scripts = Object.keys(SCRIPTS);
  const request = process.argv[2];

  if (!scripts.includes(request)) {
    console.error(
      `Invalid migration script. Available scripts: [${scripts.join(', ')}]`
    );
    return process.exit(1);
  }

  try {
    SCRIPTS[request]();
  } catch (err) {
    console.error(`Error running migration: ${err.message}`);
  }
})();
