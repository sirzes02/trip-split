import type { TripRepository } from "@/domain/repositories/TripRepository";

export class DeleteTrip {
  constructor(private readonly repository: TripRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.deleteTrip(id);
  }
}
