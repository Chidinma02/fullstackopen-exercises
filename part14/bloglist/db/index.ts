import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as dotenv from "dotenv";
import * as fs from "fs";

if (!process.env.DATABASE_URL) {
  const envFile =
    process.env.NODE_ENV === "test" || fs.existsSync(".env.test")
      ? ".env.test"
      : ".env.local";
  dotenv.config({ path: envFile });
}

const connectionString = process.env.DATABASE_URL || "";
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
