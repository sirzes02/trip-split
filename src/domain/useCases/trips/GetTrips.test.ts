import type { Trip } from "@/domain/models/Trip";
import type { TripRepository } from "@/domain/repositories/TripRepository";
import { GetTrips } from "./GetTrips";

describe("GetTrips", () => {
  it("returns the trips fetched from the repository", async () => {
    const trips: Trip[] = [
      {
        id: "trip-id",
        name: "Viaje",
        destination: "Bogotá",
        startDate: new Date("2026-11-17T00:00:00.000Z"),
        endDate: new Date("2026-11-20T00:00:00.000Z"),
        createdAt: new Date("2026-11-01T00:00:00.000Z"),
      },
    ];
    const repository: jest.Mocked<TripRepository> = {
      fetchTrips: jest.fn().mockResolvedValue(trips),
      getTrip: jest.fn().mockResolvedValue(trips[0]),
      saveTrip: jest.fn().mockResolvedValue(undefined),
      deleteTrip: jest.fn().mockResolvedValue(undefined),
    };

    await expect(new GetTrips(repository).execute()).resolves.toBe(trips);
    expect(repository.fetchTrips).toHaveBeenCalledTimes(1);
  });
});
