/**
 * ReservationNumberService
 * Generate reservation numbers in format RES-YYYY-NNN
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReservationNumberService {
  async next(prisma: any): Promise<string> {
    const year = new Date().getFullYear();
    
    // Count reservations for this year
    const count = await prisma.reservation.count({
      where: {
        reservationNumber: {
          startsWith: `RES-${year}-`,
        },
      },
    });
    
    // Format: RES-YYYY-NNN (3-digit sequential number)
    const nextNumber = count + 1;
    return `RES-${year}-${String(nextNumber).padStart(3, '0')}`;
  }
}

