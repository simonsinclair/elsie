import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { meals } from './schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new TypeError('DATABASE_URL is undefined');

const client = postgres(DATABASE_URL);

export const database = drizzle(client, {
  logger: true,
  schema: {
    meals,
  },
});