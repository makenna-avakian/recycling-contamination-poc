/**
 * Domain Entity: Customer
 * Represents a customer (household or business)
 */
export class Customer {
  constructor(
    public readonly customerId: number,
    public readonly externalRef: string | null,
    public readonly name: string,
    public readonly customerType: 'residential' | 'commercial',
    public readonly routeId: number,
    public readonly addressLine1: string | null,
    public readonly city: string | null,
    public readonly state: string | null,
    public readonly postalCode: string | null,
    public readonly active: boolean,
    public readonly createdAt: Date
  ) {}
}

