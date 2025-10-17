/**
 * ReservationController - Equipment reservation management
 */
import {
  Controller, Get, Post, Param, Body, Query, Req, ParseUUIDPipe,
  BadRequestException, NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { withTx } from './with-tenant';
import { Public } from './auth/public.decorator';
import { Roles } from './auth/roles.decorator';
import { ReservationService } from './reservation.service';
import { ReservationNumberService } from './reservation-number.service';
import {
  CreateReservationDto, ApproveReservationDto, DenyReservationDto,
  ReturnReservationDto, ListReservationsQueryDto, CancelReservationDto,
} from './dto/reservation.dto';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller()
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly reservationNumberService: ReservationNumberService,
  ) {}

  /**
   * Create reservation request (public - anyone can request)
   */
  @Public()
  @Post('/reservations')
  async createReservation(@Req() req: any, @Body() dto: CreateReservationDto) {
    return withTx(async (tx) => {
      const user = req.user;
      
      // Validate dates
      const requestDate = new Date(dto.requestDate);
      const returnDate = new Date(dto.returnDate);
      const now = new Date();
      
      if (requestDate >= returnDate) {
        throw new BadRequestException('Return date must be after request date');
      }
      
      if (requestDate < now) {
        throw new BadRequestException('Request date must be in the future');
      }

      // Validate 14-day maximum duration
      const daysDiff = Math.ceil((returnDate.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 14) {
        throw new BadRequestException('Return date must be within 14 days of requested date');
      }

      // Check equipment availability (unless force request)
      if (!dto.forceRequest) {
        const available = await this.reservationService.checkAvailability(
          dto.equipmentType,
          requestDate,
          returnDate
        );

        if (available < dto.quantity) {
          throw new BadRequestException('Insufficient equipment available for requested dates');
        }
      }

      // Generate reservation number
      const reservationNumber = await this.reservationNumberService.next(tx);

      // Create reservation (simplified - no items array)
      const reservation = await tx.reservation.create({
        data: {
          reservationNumber,
          requesterId: user?.sub || 'anonymous',
          requesterEmail: dto.requesterEmail || user?.email || null,
          requesterName: dto.requesterName || user?.name || null,
          equipmentType: dto.equipmentType,
          quantity: dto.quantity,
          purpose: dto.purpose,
          requestDate,
          returnDate,
          notes: dto.notes,
          status: 'pending',
        },
      });

      return reservation;
    });
  }

  /**
   * List reservations
   */
  @Get('/reservations')
  async listReservations(@Req() req: any, @Query() q: ListReservationsQueryDto) {
    return withTx(async (tx) => {
      const take = Math.min(Math.max(Number(q.limit || 50), 1), 100);
      const user = req.user;

      let cursorObj: { id: string; createdAt: Date } | undefined;
      if (q.cursor) {
        const [id, createdAt] = Buffer.from(q.cursor, 'base64')
          .toString('utf8')
          .split('|');
        cursorObj = { id, createdAt: new Date(createdAt) };
      }

      const where: any = {};
      
      // If not operator/admin, only show user's own reservations
      if (!user || (user.role !== 'operator' && user.role !== 'admin')) {
        where.requesterId = user?.sub || 'anonymous';
      }
      
      if (q.status) where.status = q.status;
      if (q.requesterId) where.requesterId = q.requesterId;
      
      // Exclude certain statuses if specified
      if (q.excludeStatuses) {
        const list = Array.isArray(q.excludeStatuses)
          ? q.excludeStatuses
          : String(q.excludeStatuses).split(',');
        if (list.length > 0) {
          where.status = { notIn: list.map((s) => s.toLowerCase()) };
        }
      }

      const items = await tx.reservation.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take,
        ...(cursorObj ? { skip: 1, cursor: { id: cursorObj.id } } : {}),
        // No items include - simplified schema
      });

      const nextCursor =
        items.length === take
          ? Buffer.from(
              `${items[items.length - 1].id}|${
                items[items.length - 1].createdAt.toISOString()
              }`,
              'utf8',
            ).toString('base64')
          : null;

      return { items, nextCursor };
    });
  }

  /**
   * Get single reservation
   */
  @Get('/reservations/:id')
  async getReservation(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return withTx(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
        // No items include - simplified schema
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      const user = req.user;
      
      // Check access - user can only see their own unless operator/admin
      if (user && user.role !== 'operator' && user.role !== 'admin') {
        if (reservation.requesterId !== user.sub) {
          throw new NotFoundException('Reservation not found');
        }
      }

      return reservation;
    });
  }

  /**
   * Approve reservation (operator/admin only)
   */
  @Roles('operator', 'admin')
  @Post('/reservations/:id/approve')
  async approveReservation(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveReservationDto,
  ) {
    return withTx(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== 'pending') {
        throw new BadRequestException('Reservation is not pending');
      }

      if (dto.assetIds.length !== reservation.quantity) {
        throw new BadRequestException(
          `Must provide ${reservation.quantity} asset IDs`
        );
      }

      // Update reservation status with assigned assets
      const updated = await tx.reservation.update({
        where: { id },
        data: {
          status: 'approved',
          approvedBy: req.user.sub,
          approvedDate: new Date(),
          assignedAssetIds: dto.assetIds.join(','), // Store as comma-separated
          notes: dto.notes || reservation.notes,
        },
      });

      // Auto-assign assets to the requester via Asset Service API
      const ASSET_SERVICE_URL = process.env.ASSET_SERVICE_URL || 'https://asset-svc-production.up.railway.app/v1';
      const authToken = req.headers.authorization;

      // Use requester email to find user ID, or use email directly if supported
      const assigneeIdentifier = reservation.requesterEmail || reservation.requesterId;
      
      for (const assetId of dto.assetIds) {
        try {
          // Try to assign by email first, then by user ID
          const assignPayload = reservation.requesterEmail 
            ? { email: reservation.requesterEmail, name: reservation.requesterName }
            : { userId: reservation.requesterId };

          const response = await fetch(`${ASSET_SERVICE_URL}/assets/${assetId}/assign`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authToken || '',
            },
            body: JSON.stringify(assignPayload)
          });

          if (!response.ok) {
            console.error(`Failed to assign asset ${assetId}:`, await response.text());
          } else {
            console.log(`Successfully assigned asset ${assetId} to ${assigneeIdentifier}`);
          }
        } catch (error) {
          console.error(`Error assigning asset ${assetId}:`, error);
          // Continue with other assets even if one fails
        }
      }

      return {
        success: true,
        message: 'Reservation approved and assets assigned to requester',
        reservation: updated,
      };
    });
  }

  /**
   * Deny reservation (operator/admin only)
   */
  @Roles('operator', 'admin')
  @Post('/reservations/:id/deny')
  async denyReservation(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DenyReservationDto,
  ) {
    return withTx(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== 'pending') {
        throw new BadRequestException('Reservation is not pending');
      }

      // Update reservation
      return tx.reservation.update({
        where: { id },
        data: {
          status: 'denied',
          deniedBy: req.user.sub,
          denialReason: dto.reason,
        },
      });
    });
  }

  /**
   * Mark reservation as picked up (operator/admin only)
   */
  @Roles('operator', 'admin')
  @Post('/reservations/:id/pickup')
  async markAsPickedUp(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return withTx(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== 'approved') {
        throw new BadRequestException('Can only mark approved reservations as picked up');
      }

      if (reservation.pickedUpAt) {
        throw new BadRequestException('Reservation already marked as picked up');
      }

      const updated = await tx.reservation.update({
        where: { id },
        data: {
          pickedUpAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Reservation marked as picked up',
        reservation: updated,
      };
    });
  }

  /**
   * Complete reservation - mark as returned, unassign assets (operator/admin only)
   */
  @Roles('operator', 'admin')
  @Post('/reservations/:id/complete')
  async completeReservation(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { returnNotes?: string },
  ) {
    return withTx(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== 'approved') {
        throw new BadRequestException('Can only complete approved reservations');
      }

      if (reservation.actualReturnDate) {
        throw new BadRequestException('Reservation already completed');
      }

      // Update reservation
      const updated = await tx.reservation.update({
        where: { id },
        data: {
          status: 'completed',
          actualReturnDate: new Date(),
          notes: dto.returnNotes
            ? `${reservation.notes || ''}\n\nReturn Notes: ${dto.returnNotes}`
            : reservation.notes,
        },
      });

      // Unassign all assets via Asset Service API
      const ASSET_SERVICE_URL = process.env.ASSET_SERVICE_URL || 'https://asset-svc-production.up.railway.app/v1';
      const authToken = req.headers.authorization;

      if (reservation.assignedAssetIds) {
        const assetIds = reservation.assignedAssetIds.split(',');

        for (const assetId of assetIds) {
          try {
            const response = await fetch(`${ASSET_SERVICE_URL}/assets/${assetId.trim()}/unassign`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken || '',
              },
              body: JSON.stringify({})
            });

            if (!response.ok) {
              console.error(`Failed to unassign asset ${assetId}:`, await response.text());
            }
          } catch (error) {
            console.error(`Error unassigning asset ${assetId}:`, error);
            // Continue with other assets even if one fails
          }
        }
      }

      return {
        success: true,
        message: 'Reservation completed and assets returned',
        reservation: updated,
      };
    });
  }

  /**
   * Mark reservation as active (picked up) - operator/admin only
   */
  @Roles('operator', 'admin')
  @Post('/reservations/:id/activate')
  async activateReservation(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return withTx(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== 'approved') {
        throw new BadRequestException('Reservation must be approved first');
      }

      return tx.reservation.update({
        where: { id },
        data: { status: 'active' },
      });
    });
  }

  /**
   * Return equipment (operator/admin only)
   */
  @Roles('operator', 'admin')
  @Post('/reservations/:id/return')
  async returnReservation(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReturnReservationDto,
  ) {
    return withTx(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== 'active' && reservation.status !== 'approved') {
        throw new BadRequestException('Reservation must be active or approved');
      }

      const updated = await tx.reservation.update({
        where: { id },
        data: {
          status: 'returned',
          actualReturnDate: new Date(),
          notes: dto.notes || reservation.notes,
        },
      });
    });
  }

  /**
   * Cancel reservation (user can cancel their own pending/approved reservations)
   */
  @Post('/reservations/:id/cancel')
  async cancelReservation(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelReservationDto,
  ) {
    return withTx(async (tx) => {
      const reservation = await tx.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      const user = req.user;
      
      // Only owner or operator/admin can cancel
      if (user && user.role !== 'operator' && user.role !== 'admin') {
        if (reservation.requesterId !== user.sub) {
          throw new BadRequestException('Cannot cancel this reservation');
        }
      }

      if (reservation.status !== 'pending' && reservation.status !== 'approved') {
        throw new BadRequestException('Can only cancel pending or approved reservations');
      }

      const updated = await tx.reservation.update({
        where: { id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: dto.reason,
        },
      });

      return {
        success: true,
        message: 'Reservation cancelled',
        reservation: updated,
      };
    });
  }

  /**
   * Get equipment availability
   */
  @Public()
  @Get('/availability')
  async getAvailability() {
    return withTx(async (tx) => {
      return tx.equipmentAvailability.findMany({
        orderBy: { assetTypeName: 'asc' },
      });
    });
  }

  /**
   * Check specific equipment availability for date range
   */
  @Public()
  @Get('/availability/:assetTypeId')
  async checkAvailability(
    @Param('assetTypeId', ParseUUIDPipe) assetTypeId: string,
    @Query('requestDate') requestDate: string,
    @Query('returnDate') returnDate: string,
  ) {
    if (!requestDate || !returnDate) {
      throw new BadRequestException('requestDate and returnDate are required');
    }

    const available = await this.reservationService.checkAvailability(
      assetTypeId,
      new Date(requestDate),
      new Date(returnDate)
    );

    return {
      assetTypeId,
      requestDate,
      returnDate,
      availableCount: available,
    };
  }

  /**
   * Get reservation analytics and KPIs (Admin/Operator only)
   */
  @Get('analytics/reservations')
  @Roles('operator', 'admin')
  async getAnalytics(@Query('days') days?: string) {
    const dayCount = parseInt(days || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dayCount);

    return withTx(async (tx) => {
      // Get reservations in time range
      const reservations = await tx.reservation.findMany({
        where: { createdAt: { gte: startDate } },
      });

      const totalReservations = reservations.length;
      const approved = reservations.filter((r) => r.status === 'approved').length;
      const pending = reservations.filter((r) => r.status === 'pending').length;
      const denied = reservations.filter((r) => r.status === 'denied').length;
      const cancelled = reservations.filter((r) => r.status === 'cancelled').length;
      const active = reservations.filter((r) => r.status === 'active').length;
      const returned = reservations.filter((r) => r.status === 'returned').length;

      // Approval metrics
      const approvalRate = totalReservations > 0
        ? parseFloat(((approved / totalReservations) * 100).toFixed(2))
        : 0;

      const autoApprovals = reservations.filter((r) =>
        r.status === 'approved' && r.approvedBy === 'system'
      ).length;
      const autoApprovalRate = approved > 0
        ? parseFloat(((autoApprovals / approved) * 100).toFixed(2))
        : 0;

      // Lead time metrics (time from request to approval)
      const approvedReservations = reservations.filter((r) =>
        r.status === 'approved' && r.approvedDate
      );
      const leadTimes = approvedReservations.map((r) => {
        const approvalDate = r.approvedDate || r.createdAt;
        return approvalDate.getTime() - r.createdAt.getTime();
      });
      const mean = (values: number[]) => values.length > 0
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : 0;
      const median = (values: number[]) => {
        if (!values.length) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
      };
      const msToHours = (ms: number) => ms / (1000 * 60 * 60);

      const avgApprovalLeadHours = msToHours(mean(leadTimes));
      const medianApprovalLeadHours = msToHours(median(leadTimes));

      // On-time return metrics
      const returnedReservations = reservations.filter((r) =>
        r.actualReturnDate !== null
      );
      const onTimeReturns = returnedReservations.filter((r) => {
        if (!r.actualReturnDate || !r.returnDate) return false;
        return r.actualReturnDate <= r.returnDate;
      }).length;
      const onTimeReturnRate = returnedReservations.length > 0
        ? parseFloat(((onTimeReturns / returnedReservations.length) * 100).toFixed(2))
        : 0;

      // Usage metrics
      const usageDurations = returnedReservations
        .filter((r) => r.actualReturnDate && r.requestDate)
        .map((r) => {
          const start = new Date(r.requestDate);
          const end = r.actualReturnDate!;
          return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // days
        });
      const avgUsageDays = usageDurations.length > 0
        ? parseFloat((mean(usageDurations)).toFixed(2))
        : 0;

      // Conflict metrics (approximate - checking for overlapping dates)
      const conflicts = reservations.filter((r) => {
        // This is a simplified conflict check
        return r.status === 'denied' && r.denialReason?.includes('conflict');
      }).length;
      const conflictRate = totalReservations > 0
        ? parseFloat(((conflicts / totalReservations) * 100).toFixed(2))
        : 0;

      // Daily trend data
      const trend = [];
      for (let i = Math.min(dayCount - 1, 13); i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const created = reservations.filter(
          (r) => r.createdAt >= date && r.createdAt < nextDate
        ).length;
        const approvedCount = reservations.filter(
          (r) => r.approvedDate && r.approvedDate >= date && r.approvedDate < nextDate
        ).length;
        const returned = reservations.filter(
          (r) => r.actualReturnDate && r.actualReturnDate >= date && r.actualReturnDate < nextDate
        ).length;

        trend.push({
          date: date.toISOString().split('T')[0],
          created,
          approved: approvedCount,
          returned,
        });
      }

      // Most requested equipment
      const equipmentCounts = reservations.reduce((acc, r) => {
        acc[r.equipmentType] = (acc[r.equipmentType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostRequested = Object.entries(equipmentCounts)
        .map(([equipmentType, count]) => ({ equipmentType, count }))
        .sort((a, b) => b.count - a.count);

      return {
        summary: {
          total: totalReservations,
          approved,
          pending,
          denied,
          cancelled,
          active,
          returned,
          approvalRate,
        },
        performance: {
          onTimeReturnRate,
          avgUsageDays,
        },
        readiness: {
          autoApprovalRate,
          avgApprovalLeadHours: parseFloat(avgApprovalLeadHours.toFixed(2)),
          medianApprovalLeadHours: parseFloat(medianApprovalLeadHours.toFixed(2)),
          conflictRate,
          conflictCount: conflicts,
        },
        trend,
        equipment: {
          mostRequested,
        },
        period: {
          days: dayCount,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      };
    });
  }
}

