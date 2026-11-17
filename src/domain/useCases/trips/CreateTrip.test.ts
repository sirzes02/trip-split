import type { TripRepository } from "@/domain/repositories/TripRepository";
import { CreateTrip } from "./CreateTrip";

jest.mock("expo-crypto", () => ({
  randomUUID: () => "trip-test-id",
}));

function makeRepository(): jest.Mocked<TripRepository> {
  return {
    fetchTrips: jest.fn().mockResolvedValue([]),
    saveTrip: jest.fn().mockResolvedValue(undefined),
    deleteTrip: jest.fn().mockResolvedValue(undefined),
  };
}

describe("CreateTrip", () => {
  it("trims text, creates a trip, and saves it", async () => {
    const repository = makeRepository();
    const useCase = new CreateTrip(repository);
    const startDate = new Date("2026-11-17T00:00:00.000Z");
    const endDate = new Date("2026-11-20T00:00:00.000Z");

    const trip = await useCase.execute({
      name: "  Viaje  ",
      destination: "  Bogotá  ",
      startDate,
      endDate,
    });

    expect(trip).toEqual({
      id: "trip-test-id",
      name: "Viaje",
      destination: "Bogotá",
      startDate,
      endDate,
      createdAt: expect.any(Date),
    });
    expect(repository.saveTrip).toHaveBeenCalledWith(trip);
  });

  it("propagates repository failures", async () => {
    const repository = makeRepository();
    const useCase = new CreateTrip(repository);
    const error = new Error("database unavailable");

    repository.saveTrip.mockRejectedValueOnce(error);

    await expect(
      useCase.execute({
        name: "Viaje",
        destination: "Bogotá",
        startDate: new Date("2026-11-17T00:00:00.000Z"),
        endDate: new Date("2026-11-20T00:00:00.000Z"),
      }),
    ).rejects.toBe(error);
  });
});
