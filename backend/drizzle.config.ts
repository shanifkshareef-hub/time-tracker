import config from "./src/utils/config";

export default {
  schema: "drizzle/schema.ts",
  out: "drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: config.dataBaseUrl,
  },
};
