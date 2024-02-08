import 'dotenv/config';
import { serial, varchar, pgSchema } from 'drizzle-orm/pg-core';
export const myschema = pgSchema('data');

export const user = myschema.table('user', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export type User = typeof user.$inferSelect; // return type when queried
export type NewUser = typeof user.$inferInsert; // insert type
