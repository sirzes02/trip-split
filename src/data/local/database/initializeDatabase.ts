import { getDatabase } from "./database";

export async function initializeDatabase(): Promise<void> {
  await getDatabase();
}
