import type { Trip } from "@/domain/models/Trip";
import type { TripRepository } from "@/domain/repositories/TripRepository";

export class GetTrip {
  constructor(private readonly repository: TripRepository) {}

  async execute(id: string): Promise<Trip | null> {
    return this.repository.getTrip(id);
  }
}
