import { Trip } from "../models/Trip";

export interface TripRepository {
  fetchTrips(): Promise<Trip[]>;
  saveTrip(trip: Trip): Promise<void>;
  deleteTrip(id: string): Promise<void>;
}
