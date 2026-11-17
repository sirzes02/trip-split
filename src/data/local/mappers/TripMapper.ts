import type { Trip } from "@/domain/models/Trip";

export interface TripRow {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export const TripMapper = {
  toDomain(row: TripRow): Trip {
    return {
      id: row.id,
      name: row.name,
      destination: row.destination,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      createdAt: new Date(row.created_at),
    };
  },

  toPersistence(trip: Trip): TripRow {
    return {
      id: trip.id,
      name: trip.name,
      destination: trip.destination,
      start_date: trip.startDate.toISOString(),
      end_date: trip.endDate.toISOString(),
      created_at: trip.createdAt.toISOString(),
    };
  },
};
