import { afterAll, expect, test } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sql } from "drizzle-orm";
import { existsSync } from "node:fs";

const dbPath = "./database.sqlite";

const sqlite = new Database(dbPath, { readonly: true });
const db = drizzle({ client: sqlite });

afterAll(() => sqlite.close());

test("SQLite-Datenbank existiert", () => {
    expect(existsSync(dbPath)).toBe(true);
});

test("Drizzle kann die echte Datenbank abfragen", () => {
    const result = db.get<{ value: number }>(sql`SELECT 1 AS value`);

    expect(result?.value).toBe(1);
});
