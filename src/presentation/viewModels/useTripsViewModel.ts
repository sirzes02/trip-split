import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { dependencies } from "@/di/DependencyContainer";
import type { Trip } from "@/domain/models/Trip";

export function useTripsViewModel() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const requestId = useRef(0);

  const loadTrips = useCallback(async (refresh = false) => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setIsRefreshing(refresh);
    setHasLoadError(false);

    try {
      const loadedTrips = await dependencies.getTrips.execute();
      if (currentRequestId === requestId.current) {
        setTrips(loadedTrips);
      }
    } catch (error) {
      if (currentRequestId === requestId.current) {
        console.error("Failed to load trips from the local database.", error);
        setHasLoadError(true);
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadTrips();

      return () => {
        requestId.current += 1;
        setIsLoading(false);
        setIsRefreshing(false);
      };
    }, [loadTrips]),
  );

  const refreshTrips = useCallback(() => {
    void loadTrips(true);
  }, [loadTrips]);

  return {
    trips,
    isLoading,
    isRefreshing,
    hasLoadError,
    refreshTrips,
  };
}
