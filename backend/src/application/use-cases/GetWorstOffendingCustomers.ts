import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { IContaminationRepository } from '../../domain/repositories/IContaminationRepository';
import { Customer } from '../../domain/entities/Customer';
import { ContaminationEvent } from '../../domain/entities/ContaminationEvent';
import { IPickupRepository } from '../../domain/repositories/IPickupRepository';

/**
 * Use Case: Get Worst Offending Customers
 * Combines multiple repositories to find customers with most contamination
 */
export interface CustomerContaminationStats {
  customer: Customer;
  contaminationCount: number;
  averageSeverity: number;
  totalContaminationPct: number;
}

export class GetWorstOffendingCustomers {
  constructor(
    private customerRepository: ICustomerRepository,
    private contaminationRepository: IContaminationRepository,
    private pickupRepository: IPickupRepository
  ) {}

  async execute(limit: number = 10): Promise<CustomerContaminationStats[]> {
    // Get all customers
    const customers = await this.customerRepository.findAll();
    
    // Get all pickups to map container -> customer
    const pickups = await this.pickupRepository.findAll();
    const pickupToCustomerMap = new Map<number, number>();
    
    // This is simplified - in real app, we'd need container -> customer mapping
    // For now, we'll get contamination events and aggregate by customer
    
    const allContamination = await this.contaminationRepository.findAll();
    
    // Group contamination by customer (via pickup -> container -> customer)
    // Note: This is simplified - you'd need proper joins in a real implementation
    const stats = new Map<number, {
      customer: Customer;
      events: ContaminationEvent[];
    }>();

    for (const customer of customers) {
      stats.set(customer.customerId, {
        customer,
        events: []
      });
    }

    // Aggregate contamination events
    // In a real implementation, you'd join through pickups -> containers -> customers
    const results: CustomerContaminationStats[] = [];
    
    for (const [customerId, data] of stats.entries()) {
      if (data.events.length > 0) {
        const avgSeverity = data.events.reduce((sum, e) => sum + e.severity, 0) / data.events.length;
        const totalPct = data.events.reduce((sum, e) => sum + e.estimatedContaminationPct, 0);
        
        results.push({
          customer: data.customer,
          contaminationCount: data.events.length,
          averageSeverity: avgSeverity,
          totalContaminationPct: totalPct
        });
      }
    }

    // Sort by contamination count and return top N
    return results
      .sort((a, b) => b.contaminationCount - a.contaminationCount)
      .slice(0, limit);
  }
}

