/**
 * Domain Entity: Route
 * Represents a collection route
 */
export class Route {
  constructor(
    public readonly routeId: number,
    public readonly facilityId: number,
    public readonly routeCode: string,
    public readonly description: string | null,
    public readonly active: boolean,
    public readonly createdAt: Date
  ) {}
}

