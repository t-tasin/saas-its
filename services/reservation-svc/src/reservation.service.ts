/**
 * ReservationService - Business logic for equipment reservations
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { withTx } from './with-tenant';
import { CreateReservationDto, ApproveReservationDto, DenyReservationDto, ReturnReservationDto } from './dto/reservation.dto';

@Injectable()
export class ReservationService {
  /**
   * Check equipment availability
   */
  async checkAvailability(equipmentType: string, requestDate: Date, returnDate: Date): Promise<number> {
    return withTx(async (tx) => {
      // Get total available for this type
      const availability = await tx.equipmentAvailability.findUnique({
        where: { assetTypeName: equipmentType },
      });

      if (!availability) {
        return 0;
      }

      // Count overlapping reservations that are approved or active
      const overlappingReservations = await tx.reservation.findMany({
        where: {
          equipmentType,
          status: { in: ['approved', 'active'] },
          OR: [
            {
              requestDate: { lte: returnDate },
              returnDate: { gte: requestDate },
            },
          ],
        },
      });

      const totalReserved = overlappingReservations.reduce((sum, r) => sum + r.quantity, 0);
      return Math.max(0, availability.availableCount - totalReserved);
    });
  }

  /**
   * Update equipment availability snapshot
   */
  async updateAvailability(assetTypeId: string, assetTypeName: string): Promise<void> {
    // This would typically sync with the asset service
    // For now, we'll create a placeholder
    await withTx(async (tx) => {
      await tx.equipmentAvailability.upsert({
        where: { assetTypeId },
        create: {
          assetTypeId,
          assetTypeName,
          totalCount: 0,
          assignedCount: 0,
          reservedCount: 0,
          availableCount: 0,
        },
        update: {
          assetTypeName,
        },
      });
    });
  }
}

