import type { TripRepository } from "@/domain/repositories/TripRepository";
import { DeleteTrip } from "./DeleteTrip";

describe("DeleteTrip", () => {
  it("deletes the trip with the given id", async () => {
    const repository: jest.Mocked<TripRepository> = {
      fetchTrips: jest.fn().mockResolvedValue([]),
      getTrip: jest.fn().mockResolvedValue(null),
      saveTrip: jest.fn().mockResolvedValue(undefined),
      deleteTrip: jest.fn().mockResolvedValue(undefined),
    };

    await expect(
      new DeleteTrip(repository).execute("trip-id"),
    ).resolves.toBeUndefined();
    expect(repository.deleteTrip).toHaveBeenCalledWith("trip-id");
  });

  it("propagates repository failures", async () => {
    const repository: jest.Mocked<TripRepository> = {
      fetchTrips: jest.fn().mockResolvedValue([]),
      getTrip: jest.fn().mockResolvedValue(null),
      saveTrip: jest.fn().mockResolvedValue(undefined),
      deleteTrip: jest
        .fn()
        .mockRejectedValue(new Error("database unavailable")),
    };

    await expect(new DeleteTrip(repository).execute("trip-id")).rejects.toThrow(
      "database unavailable",
    );
  });
});
