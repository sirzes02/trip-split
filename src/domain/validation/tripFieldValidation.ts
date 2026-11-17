export const MAX_TRIP_TEXT_LENGTH = 15;

const allowedTripText = /^[\p{L}\p{M}\p{N} '\u2019-]*$/u;

export type TripTextValidationError = "textTooLong" | "invalidCharacters";

export function validateTripText(
  value: string,
): TripTextValidationError | null {
  if (Array.from(value).length > MAX_TRIP_TEXT_LENGTH) {
    return "textTooLong";
  }

  if (!allowedTripText.test(value)) {
    return "invalidCharacters";
  }

  return null;
}

export function isValidTripDateRange(startDate: Date, endDate: Date): boolean {
  return endDate >= startDate;
}
