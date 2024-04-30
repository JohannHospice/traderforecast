import { Redis } from '@upstash/redis';
import 'dotenv/config';

if (!process.env.REDIS_REST_URL || !process.env.REDIS_PASSWORD) {
  throw new Error('REDIS_REST_URL and REDIS_PASSWORD is not defined');
}

export const redis = new Redis({
  url: process.env.REDIS_REST_URL || '',
  token: process.env.REDIS_PASSWORD || '',
  automaticDeserialization: false,
});
