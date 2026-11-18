import { Trip } from "../models/Trip";

export interface TripRepository {
  fetchTrips(): Promise<Trip[]>;
  getTrip(id: string): Promise<Trip | null>;
  saveTrip(trip: Trip): Promise<void>;
  deleteTrip(id: string): Promise<void>;
}
