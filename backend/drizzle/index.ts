import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import config from "../src/utils/config";

export const client = new Client({
  connectionString: config.dataBaseUrl,
});

// (async function () {
//   await client.connect();
// })();

client.connect();

export const db = drizzle(client, { schema });
