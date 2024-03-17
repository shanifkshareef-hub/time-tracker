// src/db/seed.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as dotenv from "dotenv";
import { user } from "./schema";
dotenv.config();

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);
  const data: (typeof user.$inferInsert)[] = [
    {
      email: "shanif.s@dotworld.in",
      firstName: "Shanif",
      mobile: "8300533461",
      password: "$2a$12$fH1BKMZ/CJv/PP6cPxKKmeeEMjXe88VJjG7QtVvMrvo70IkUXYcwC", //dotworld@23
      countryCode: "+91",
    },
    {
      email: "naveen@dotworld.in",
      firstName: "Naveen",
      lastName: "Sakthivel",
      mobile: "8888888888",
      password: "$2a$12$fH1BKMZ/CJv/PP6cPxKKmeeEMjXe88VJjG7QtVvMrvo70IkUXYcwC", //dotworld@23
      countryCode: "+91",
    },
  ];

  console.log("Seed start");
  console.log("Creating users");
  await db.insert(user).values(data);
  console.log("Seed done");
};

main();
