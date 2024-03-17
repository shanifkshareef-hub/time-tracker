import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import postgres from "postgres";
import { client, db } from ".";
// const sql = postgres(
//   "postgresql://postgres:dotworld@localhost:5432/timetracker",
//   { max: 1 }
// );
// const db = drizzle(sql);
// await migrate(db, { migrationsFolder: "drizzle" });
// await sql.end();

// This will run migrations on the database, skipping the ones already applied

const migrate2 = async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
  // Don't forget to close the connection, otherwise the script will hang
  await client.end();
};

migrate2();
