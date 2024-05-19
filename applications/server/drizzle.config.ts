import { defineConfig } from 'drizzle-kit';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new TypeError('DATABASE_URL undefined');

export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/database/schema.ts',
  out: 'src/database/migrations',
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
