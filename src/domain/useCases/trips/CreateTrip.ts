import type { Trip } from "@/domain/models/Trip";
import type { TripRepository } from "@/domain/repositories/TripRepository";
import * as Crypto from "expo-crypto";

export interface CreateTripInput {
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
}

export class CreateTrip {
  constructor(private readonly repository: TripRepository) {}

  async execute(input: CreateTripInput): Promise<Trip> {
    const trip: Trip = {
      id: Crypto.randomUUID(),
      name: input.name.trim(),
      destination: input.destination.trim(),
      startDate: input.startDate,
      endDate: input.endDate,
      createdAt: new Date(),
    };

    await this.repository.saveTrip(trip);

    return trip;
  }
}
