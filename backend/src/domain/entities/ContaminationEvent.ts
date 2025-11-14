/**
 * Domain Entity: ContaminationEvent
 * Core business object representing a contamination event
 * No external dependencies - pure domain logic
 */
export class ContaminationEvent {
  constructor(
    public readonly contaminationId: number,
    public readonly pickupId: number,
    public readonly categoryId: number,
    public readonly severity: number, // 1-5
    public readonly estimatedContaminationPct: number,
    public readonly notes: string | null,
    public readonly createdAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.severity < 1 || this.severity > 5) {
      throw new Error('Severity must be between 1 and 5');
    }
    if (this.estimatedContaminationPct < 0 || this.estimatedContaminationPct > 100) {
      throw new Error('Contamination percentage must be between 0 and 100');
    }
  }

  /**
   * Domain logic: Determine if contamination is severe
   */
  isSevere(): boolean {
    return this.severity >= 4 || this.estimatedContaminationPct >= 20;
  }
}

