import * as SQLite from "expo-sqlite";

import { createTripsTable } from "./migrations/001_create_trips";

const DATABASE_NAME = "tripsplit.db";

let databaseInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (databaseInstance) {
    return databaseInstance;
  }

  const database = await SQLite.openDatabaseAsync(DATABASE_NAME);

  await database.execAsync("PRAGMA foreign_keys = ON;");
  await createTripsTable(database);

  databaseInstance = database;

  return database;
}
