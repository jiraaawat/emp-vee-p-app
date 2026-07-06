import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const connectionString = process.env.DB_CONN_STRING;

if (!connectionString) {
  throw new Error("DB_CONN_STRING is not set");
}

const pool = new Pool({ connectionString });

export const db = drizzle({ client: pool, schema, logger: process.env.NODE_ENV === "development" });
