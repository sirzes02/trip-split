import type { Trip } from "@/domain/models/Trip";
import type { TripRepository } from "@/domain/repositories/TripRepository";
import { GetTrip } from "./GetTrip";

describe("GetTrip", () => {
  it("returns the trip fetched by id", async () => {
    const trip: Trip = {
      id: "trip-id",
      name: "Viaje",
      destination: "Bogotá",
      startDate: new Date("2026-11-17T00:00:00.000Z"),
      endDate: new Date("2026-11-20T00:00:00.000Z"),
      createdAt: new Date("2026-11-01T00:00:00.000Z"),
    };
    const repository: jest.Mocked<TripRepository> = {
      fetchTrips: jest.fn().mockResolvedValue([trip]),
      getTrip: jest.fn().mockResolvedValue(trip),
      saveTrip: jest.fn().mockResolvedValue(undefined),
      deleteTrip: jest.fn().mockResolvedValue(undefined),
    };

    await expect(new GetTrip(repository).execute(trip.id)).resolves.toBe(trip);
    expect(repository.getTrip).toHaveBeenCalledWith(trip.id);
  });

  it("returns null when the repository does not find the trip", async () => {
    const repository: jest.Mocked<TripRepository> = {
      fetchTrips: jest.fn().mockResolvedValue([]),
      getTrip: jest.fn().mockResolvedValue(null),
      saveTrip: jest.fn().mockResolvedValue(undefined),
      deleteTrip: jest.fn().mockResolvedValue(undefined),
    };

    await expect(
      new GetTrip(repository).execute("missing-id"),
    ).resolves.toBeNull();
  });
});
