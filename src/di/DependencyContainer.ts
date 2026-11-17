import { LocalTripRepository } from "@/data/local/repositories/LocalTripRepository";
import type { TripRepository } from "@/domain/repositories/TripRepository";
import { CreateTrip } from "@/domain/useCases/trips/CreateTrip";
import { GetTrips } from "@/domain/useCases/trips/GetTrips";

interface DependencyOverrides {
  tripRepository?: TripRepository;
}

export function createDependencyContainer(overrides: DependencyOverrides = {}) {
  const tripRepository = overrides.tripRepository ?? new LocalTripRepository();

  return {
    tripRepository,
    createTrip: new CreateTrip(tripRepository),
    getTrips: new GetTrips(tripRepository),
  };
}

export const dependencies = createDependencyContainer();
