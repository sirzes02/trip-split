import { RepositoryError } from "@/domain/errors/RepositoryError";
import type { Trip } from "@/domain/models/Trip";
import type { TripRepository } from "@/domain/repositories/TripRepository";

import { getDatabase } from "../database/database";
import { TripMapper, type TripRow } from "../mappers/TripMapper";

export class LocalTripRepository implements TripRepository {
  async fetchTrips(): Promise<Trip[]> {
    try {
      const database = await getDatabase();
      const rows = await database.getAllAsync<TripRow>(
        "SELECT * FROM trips ORDER BY created_at DESC;",
      );

      return rows.map(TripMapper.toDomain);
    } catch (error) {
      throw new RepositoryError("operationFailed", "Failed to fetch trips", {
        cause: error,
      });
    }
  }

  async getTrip(id: string): Promise<Trip | null> {
    try {
      const database = await getDatabase();
      const row = await database.getFirstAsync<TripRow>(
        "SELECT * FROM trips WHERE id = ?;",
        id,
      );

      return row ? TripMapper.toDomain(row) : null;
    } catch (error) {
      throw new RepositoryError("operationFailed", "Failed to fetch trip", {
        cause: error,
      });
    }
  }

  async saveTrip(trip: Trip): Promise<void> {
    try {
      const database = await getDatabase();
      const row = TripMapper.toPersistence(trip);

      await database.runAsync(
        `
          INSERT INTO trips (
            id,
            name,
            destination,
            start_date,
            end_date,
            created_at
          )
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            destination = excluded.destination,
            start_date = excluded.start_date,
            end_date = excluded.end_date;
        `,
        row.id,
        row.name,
        row.destination,
        row.start_date,
        row.end_date,
        row.created_at,
      );
    } catch (error) {
      throw new RepositoryError("operationFailed", "Failed to save trip", {
        cause: error,
      });
    }
  }

  async deleteTrip(id: string): Promise<void> {
    try {
      const database = await getDatabase();

      await database.runAsync("DELETE FROM trips WHERE id = ?;", id);
    } catch (error) {
      throw new RepositoryError("operationFailed", "Failed to delete trip", {
        cause: error,
      });
    }
  }
}
