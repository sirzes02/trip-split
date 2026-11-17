import {
  ALLOWED_TRIP_TEXT,
  MAX_TRIP_TEXT_LENGTH,
} from "@/domain/errors/RepositoryError";

export type CreateTripFieldError =
  "required" | "invalidDates" | "textTooLong" | "invalidCharacters";

export interface CreateTripForm {
  name: string;
  destination: string;
  startDate: Date;
  endDate: Date;
}

export interface CreateTripFormErrors {
  name: CreateTripFieldError | null;
  destination: CreateTripFieldError | null;
  endDate: CreateTripFieldError | null;
}

function getTextError(value: string): CreateTripFieldError | null {
  if (!value.trim()) {
    return "required";
  }

  if (Array.from(value).length > MAX_TRIP_TEXT_LENGTH) {
    return "textTooLong";
  }

  if (!ALLOWED_TRIP_TEXT.test(value)) {
    return "invalidCharacters";
  }

  return null;
}

export function validateTripForm(form: CreateTripForm): CreateTripFormErrors {
  return {
    name: getTextError(form.name),
    destination: getTextError(form.destination),
    endDate: form.endDate >= form.startDate ? null : "invalidDates",
  };
}
