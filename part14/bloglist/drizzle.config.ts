import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as fs from "fs";

// Load .env.test if in test environment or if .env.test exists, otherwise .env.local
const envFile =
  process.env.NODE_ENV === "test" || fs.existsSync(".env.test")
    ? ".env.test"
    : ".env.local";
dotenv.config({ path: envFile });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
