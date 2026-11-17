import type { Trip } from "@/domain/models/Trip";
import type { TripRepository } from "@/domain/repositories/TripRepository";
import {
  isValidTripDateRange,
  validateTripText,
} from "@/domain/validation/tripFieldValidation";
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
    if (!input.name.trim() || !input.destination.trim()) {
      throw new Error("Trip name and destination are required");
    }

    if (validateTripText(input.name) || validateTripText(input.destination)) {
      throw new Error("Trip name and destination contain invalid text");
    }

    if (!isValidTripDateRange(input.startDate, input.endDate)) {
      throw new Error("Trip end date cannot be before start date");
    }

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
