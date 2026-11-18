import { LocalTripRepository } from "@/data/local/repositories/LocalTripRepository";
import type { TripRepository } from "@/domain/repositories/TripRepository";
import { CreateTrip } from "@/domain/useCases/trips/CreateTrip";
import { DeleteTrip } from "@/domain/useCases/trips/DeleteTrip";
import { GetTrip } from "@/domain/useCases/trips/GetTrip";
import { GetTrips } from "@/domain/useCases/trips/GetTrips";

interface DependencyOverrides {
  tripRepository?: TripRepository;
}

export function createDependencyContainer(overrides: DependencyOverrides = {}) {
  const tripRepository = overrides.tripRepository ?? new LocalTripRepository();

  return {
    tripRepository,
    createTrip: new CreateTrip(tripRepository),
    deleteTrip: new DeleteTrip(tripRepository),
    getTrip: new GetTrip(tripRepository),
    getTrips: new GetTrips(tripRepository),
  };
}

export const dependencies = createDependencyContainer();
