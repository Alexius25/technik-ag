// import "server-only";
import Database from "better-sqlite3";

export const db = new Database("./database.sqlite");
db.pragma("foreign_keys = ON");