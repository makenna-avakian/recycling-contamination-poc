/**
 * Domain Entity: Pickup
 * Represents a container pickup event
 */
export class Pickup {
  constructor(
    public readonly pickupId: number,
    public readonly containerId: number,
    public readonly routeId: number,
    public readonly pickupTime: Date,
    public readonly weightKg: number | null,
    public readonly driverName: string | null,
    public readonly notes: string | null,
    public readonly createdAt: Date
  ) {}
}

