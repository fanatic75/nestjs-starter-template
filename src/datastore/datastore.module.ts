import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configurationType } from '../infra/configuration';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { withReplicas } from 'drizzle-orm/pg-core';
import * as schema from './schema';
import { labels } from './labels';
const databaseProvider = {
  provide: 'DB',
  useFactory: async (config: ConfigService) => {
    const primaryDb = drizzle(
      new Pool({
        connectionString: config.get<configurationType['db']>('db').url,
      }),
      {
        schema,
      },
    );

    const read1 = drizzle(
      new Pool({
        connectionString: config.get<configurationType['db1']>('db1').url,
      }),
      {
        schema,
      },
    );

    const read2 = drizzle(
      new Pool({
        connectionString: config.get<configurationType['db2']>('db2').url,
      }),
      {
        schema,
      },
    );

    // seed labels
    primaryDb
      .insert(schema.label)
      .values(labels)
      .onConflictDoNothing()
      .catch((err) => console.error(err));

    return withReplicas(primaryDb, [read1, read2]);
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          config: {
            name: 'CACHE',
            url: config.get<configurationType['cache']>('cache').url,
          },
        };
      },
    }),
  ],
  providers: [databaseProvider],
  exports: ['DB'],
})
export class DatastoreModule {}
