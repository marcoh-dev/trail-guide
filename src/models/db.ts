import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import { dbPath } from "../config/constants";

let db: Database | null = null;

export async function connectDB(): Promise<Database> {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  return db;
}

export function getDB(): Database {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

export async function closeDB(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
