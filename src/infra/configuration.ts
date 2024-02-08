export default function config() {
  return {
    db: {
      url: process.env.DATABASE_URL,
    },
    db1: {
      url: process.env.DB1_URL,
    },
    db2: {
      url: process.env.DB2_URL,
    },
    cache: {
      url: process.env.CACHE_URL,
    },
  };
}

export type configurationType = ReturnType<typeof config>;
