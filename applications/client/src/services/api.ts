import { hc } from 'hono/client';

import type { Application } from 'server/src/http';

export const client = hc<Application>(import.meta.env.VITE_API_BASE_URL);
