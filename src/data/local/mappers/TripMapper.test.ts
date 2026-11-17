import { TripMapper, type TripRow } from "./TripMapper";

const row: TripRow = {
  id: "trip-id",
  name: "Viaje",
  destination: "Bogotá",
  start_date: "2026-11-17T00:00:00.000Z",
  end_date: "2026-11-20T00:00:00.000Z",
  created_at: "2026-11-01T00:00:00.000Z",
};

describe("TripMapper", () => {
  it("converts database date strings into Date values", () => {
    expect(TripMapper.toDomain(row)).toEqual({
      id: row.id,
      name: row.name,
      destination: row.destination,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      createdAt: new Date(row.created_at),
    });
  });

  it("serializes trip dates as ISO strings", () => {
    const trip = TripMapper.toDomain(row);

    expect(TripMapper.toPersistence(trip)).toEqual(row);
  });
});
