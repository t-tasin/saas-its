/**
 * ReservationService - Business logic for equipment reservations
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { withTx } from './with-tenant';
import { CreateReservationDto, ApproveReservationDto, DenyReservationDto, ReturnReservationDto } from './dto/reservation.dto';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  /**
   * Check equipment availability by calling Asset Service
   */
  async checkAvailability(equipmentType: string, requestDate: Date, returnDate: Date): Promise<number> {
    try {
      // Call Asset Service to get real-time availability
      const ASSET_SERVICE_URL = process.env.ASSET_SERVICE_URL || 'https://asset-svc-production.up.railway.app/v1';
      
      const response = await fetch(`${ASSET_SERVICE_URL}/assets?type=${equipmentType.toLowerCase()}&status=available`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.logger.warn(`Asset service returned ${response.status}, falling back to 0 availability`);
        return 0;
      }

      const data = await response.json();
      const assets = data.items || data.data || [];
      const totalAvailable = assets.length;

      this.logger.log(`Found ${totalAvailable} available ${equipmentType} assets from asset service`);

      // Count overlapping reservations that would reduce availability
      const overlappingReserved = await withTx(async (tx) => {
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

        return overlappingReservations.reduce((sum, r) => sum + r.quantity, 0);
      });

      this.logger.log(`${overlappingReserved} ${equipmentType} assets already reserved for these dates`);

      return Math.max(0, totalAvailable - overlappingReserved);
    } catch (error: any) {
      this.logger.error(`Failed to check availability from asset service: ${error?.message || error}`);
      return 0;
    }
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

