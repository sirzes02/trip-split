import { useRef, useState } from "react";

import { dependencies } from "@/di/DependencyContainer";
import type { Trip } from "@/domain/models/Trip";
import {
  isValidTripDateRange,
  validateTripText,
} from "@/domain/validation/tripFieldValidation";
import type { LoadingOperation } from "@/presentation/types/LoadingOperation";

export type CreateTripError = "error";
export type CreateTripFieldError =
  | "required"
  | "invalidDates"
  | "textTooLong"
  | "invalidCharacters";

function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function useCreateTripViewModel() {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");

  const [startDate, setStartDate] = useState<Date>(getToday);
  const [endDate, setEndDate] = useState<Date>(getToday);

  const [loadingOperation, setLoadingOperation] =
    useState<LoadingOperation>(null);

  const [error, setError] = useState<CreateTripError | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  function getTextError(value: string): CreateTripFieldError | null {
    if (!value.trim()) {
      return hasAttemptedSubmit ? "required" : null;
    }

    return validateTripText(value);
  }

  const nameError = getTextError(name);
  const destinationError = getTextError(destination);
  const endDateError: CreateTripFieldError | null = isValidTripDateRange(
    startDate,
    endDate,
  )
    ? null
    : "invalidDates";

  // Prevents concurrent operations
  const operationLock = useRef(false);

  async function createTrip(): Promise<Trip | null> {
    if (operationLock.current) {
      return null;
    }

    setHasAttemptedSubmit(true);
    setError(null);

    if (!name.trim() || !destination.trim()) {
      return null;
    }

    if (nameError || destinationError || endDateError) {
      return null;
    }

    operationLock.current = true;
    setLoadingOperation("creating");

    try {
      return await dependencies.createTrip.execute({
        name: name.trim(),
        destination: destination.trim(),
        startDate,
        endDate,
      });
    } catch (error) {
      console.error("Failed to create trip.", error);
      setError("error");
      return null;
    } finally {
      operationLock.current = false;
      setLoadingOperation(null);
    }
  }

  return {
    name,
    setName,
    nameError,
    destination,
    setDestination,
    destinationError,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    endDateError,
    loadingOperation,
    isLoading: loadingOperation !== null,
    error,
    createTrip,
  };
}
