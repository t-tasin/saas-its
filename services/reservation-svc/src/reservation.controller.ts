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
import {
  CreateReservationDto, ApproveReservationDto, DenyReservationDto,
  ReturnReservationDto, ListReservationsQueryDto,
} from './dto/reservation.dto';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

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
      
      if (requestDate >= returnDate) {
        throw new BadRequestException('Return date must be after request date');
      }
      
      if (requestDate < new Date()) {
        throw new BadRequestException('Request date must be in the future');
      }

      // Create reservation
      const reservation = await tx.reservation.create({
        data: {
          requesterId: user?.sub || 'anonymous',
          requesterEmail: dto.requesterEmail,
          requesterName: dto.requesterName,
          requestDate,
          returnDate,
          notes: dto.notes,
          status: 'pending',
        },
      });

      // Create reservation items
      const items = await Promise.all(
        dto.items.map((item) =>
          tx.reservationItem.create({
            data: {
              reservationId: reservation.id,
              assetTypeId: item.assetTypeId,
              assetTypeName: item.assetTypeName,
              quantity: item.quantity || 1,
              notes: item.notes,
              status: 'pending',
            },
          })
        )
      );

      // Ensure availability records exist
      for (const item of dto.items) {
        await this.reservationService.updateAvailability(
          item.assetTypeId,
          item.assetTypeName
        );
      }

      return {
        ...reservation,
        items,
      };
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

      const items = await tx.reservation.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take,
        ...(cursorObj ? { skip: 1, cursor: { id: cursorObj.id } } : {}),
        include: {
          items: true,
        },
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
        include: {
          items: true,
        },
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
        include: { items: true },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== 'pending') {
        throw new BadRequestException('Reservation is not pending');
      }

      if (dto.assetIds.length !== reservation.items.length) {
        throw new BadRequestException(
          `Must provide ${reservation.items.length} asset IDs`
        );
      }

      // Update reservation status
      const updated = await tx.reservation.update({
        where: { id },
        data: {
          status: 'approved',
          approvedBy: req.user.sub,
          approvedDate: new Date(),
          notes: dto.notes || reservation.notes,
        },
      });

      // Assign assets to items
      await Promise.all(
        reservation.items.map((item, index) =>
          tx.reservationItem.update({
            where: { id: item.id },
            data: {
              assetId: dto.assetIds[index],
              status: 'approved',
            },
          })
        )
      );

      return tx.reservation.findUnique({
        where: { id },
        include: { items: true },
      });
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
      const updated = await tx.reservation.update({
        where: { id },
        data: {
          status: 'denied',
          deniedBy: req.user.sub,
          denialReason: dto.reason,
        },
      });

      // Update all items
      await tx.reservationItem.updateMany({
        where: { reservationId: id },
        data: { status: 'denied' },
      });

      return tx.reservation.findUnique({
        where: { id },
        include: { items: true },
      });
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

      const updated = await tx.reservation.update({
        where: { id },
        data: { status: 'active' },
      });

      await tx.reservationItem.updateMany({
        where: { reservationId: id },
        data: { status: 'active' },
      });

      return tx.reservation.findUnique({
        where: { id },
        include: { items: true },
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

      await tx.reservationItem.updateMany({
        where: { reservationId: id },
        data: { status: 'returned' },
      });

      return tx.reservation.findUnique({
        where: { id },
        include: { items: true },
      });
    });
  }

  /**
   * Cancel reservation (user can cancel their own pending reservations)
   */
  @Post('/reservations/:id/cancel')
  async cancelReservation(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
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

      if (reservation.status !== 'pending') {
        throw new BadRequestException('Can only cancel pending reservations');
      }

      const updated = await tx.reservation.update({
        where: { id },
        data: { status: 'cancelled' },
      });

      await tx.reservationItem.updateMany({
        where: { reservationId: id },
        data: { status: 'cancelled' },
      });

      return tx.reservation.findUnique({
        where: { id },
        include: { items: true },
      });
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
}

