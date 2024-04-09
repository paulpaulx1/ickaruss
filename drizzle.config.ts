import { type Config } from "drizzle-kit";

import { env } from "zicarus/env.js";

const config: Config = {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  out: "./src/server/db/migrations",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["zicuras_*"],
  // Add any other configuration options as needed
};


export default config;