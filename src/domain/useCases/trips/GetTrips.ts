import type { Trip } from "@/domain/models/Trip";
import type { TripRepository } from "@/domain/repositories/TripRepository";

export class GetTrips {
  constructor(private readonly repository: TripRepository) {}

  async execute(): Promise<Trip[]> {
    return this.repository.fetchTrips();
  }
}
