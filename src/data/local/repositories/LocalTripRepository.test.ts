import type { Trip } from "@/domain/models/Trip";
import type { SQLiteDatabase } from "expo-sqlite";
import { getDatabase } from "../database/database";
import { LocalTripRepository } from "./LocalTripRepository";

jest.mock("../database/database", () => ({
  getDatabase: jest.fn(),
}));

const mockGetAllAsync = jest.fn();
const mockGetFirstAsync = jest.fn();
const mockRunAsync = jest.fn();
const mockDatabase = {
  getAllAsync: mockGetAllAsync,
  getFirstAsync: mockGetFirstAsync,
  runAsync: mockRunAsync,
} as unknown as SQLiteDatabase;
const mockGetDatabase = jest.mocked(getDatabase);

const trip: Trip = {
  id: "trip-id",
  name: "Viaje",
  destination: "Bogotá",
  startDate: new Date("2026-11-17T00:00:00.000Z"),
  endDate: new Date("2026-11-20T00:00:00.000Z"),
  createdAt: new Date("2026-11-01T00:00:00.000Z"),
};

describe("LocalTripRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDatabase.mockResolvedValue(mockDatabase);
  });

  it("fetches and maps trips in descending creation order", async () => {
    mockGetAllAsync.mockResolvedValue([
      {
        id: trip.id,
        name: trip.name,
        destination: trip.destination,
        start_date: trip.startDate.toISOString(),
        end_date: trip.endDate.toISOString(),
        created_at: trip.createdAt.toISOString(),
      },
    ]);

    await expect(new LocalTripRepository().fetchTrips()).resolves.toEqual([
      trip,
    ]);
    expect(mockGetAllAsync).toHaveBeenCalledWith(
      "SELECT * FROM trips ORDER BY created_at DESC;",
    );
  });

  it("gets and maps a trip by id", async () => {
    mockGetFirstAsync.mockResolvedValue({
      id: trip.id,
      name: trip.name,
      destination: trip.destination,
      start_date: trip.startDate.toISOString(),
      end_date: trip.endDate.toISOString(),
      created_at: trip.createdAt.toISOString(),
    });

    await expect(new LocalTripRepository().getTrip(trip.id)).resolves.toEqual(
      trip,
    );
    expect(mockGetFirstAsync).toHaveBeenCalledWith(
      "SELECT * FROM trips WHERE id = ?;",
      trip.id,
    );
  });

  it("returns null when a trip does not exist", async () => {
    mockGetFirstAsync.mockResolvedValue(null);

    await expect(
      new LocalTripRepository().getTrip("missing-trip-id"),
    ).resolves.toBeNull();
  });

  it("saves a trip using parameterized values", async () => {
    await new LocalTripRepository().saveTrip(trip);

    expect(mockRunAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO trips"),
      trip.id,
      trip.name,
      trip.destination,
      trip.startDate.toISOString(),
      trip.endDate.toISOString(),
      trip.createdAt.toISOString(),
    );
  });

  it("deletes a trip by id", async () => {
    await new LocalTripRepository().deleteTrip(trip.id);

    expect(mockRunAsync).toHaveBeenCalledWith(
      "DELETE FROM trips WHERE id = ?;",
      trip.id,
    );
  });

  it("wraps database failures in RepositoryError", async () => {
    const cause = new Error("database unavailable");
    mockGetAllAsync.mockRejectedValueOnce(cause);

    await expect(new LocalTripRepository().fetchTrips()).rejects.toMatchObject({
      name: "RepositoryError",
      code: "operationFailed",
      message: "Failed to fetch trips",
      cause,
    });
  });
});
