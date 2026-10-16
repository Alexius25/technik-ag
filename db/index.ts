import { drizzle } from "drizzle-orm/better-sqlite3";
import { db as sqlite } from "../lib/db";

export const db = drizzle({ client: sqlite });
