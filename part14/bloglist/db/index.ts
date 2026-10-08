import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
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

export const db = (
  connectionString.includes("neon.tech")
    ? drizzleNeon(neon(connectionString), { schema })
    : (drizzlePg(new Pool({ connectionString: connectionString || undefined }), { schema }) as unknown)
) as NeonHttpDatabase<typeof schema>;
