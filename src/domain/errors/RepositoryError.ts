export const MAX_TRIP_TEXT_LENGTH = 15;
export const ALLOWED_TRIP_TEXT = /^[\p{L}\p{M}\p{N} '\u2019-]*$/u;

export type RepositoryErrorCode =
  "notFound" | "alreadyExists" | "operationFailed" | "invalidData";

export class RepositoryError extends Error {
  constructor(
    public readonly code: RepositoryErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "RepositoryError";
  }
}
