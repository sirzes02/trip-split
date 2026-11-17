export type RepositoryErrorCode =
  | "notFound"
  | "alreadyExists"
  | "operationFailed"
  | "invalidData";

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
