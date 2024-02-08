import 'dotenv/config';
import postgres from 'postgres';
import { drizzle as migratorDizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './schema';
const migrationsClient = postgres(process.env.DATABASE_URL);

const db = migratorDizzle(migrationsClient, { schema });
(async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
  await migrationsClient.end();
})();
