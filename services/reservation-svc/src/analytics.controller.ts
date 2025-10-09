/**
 * AnalyticsController - Reservation analytics and metrics
 */
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Roles } from './auth/roles.decorator';
import { withTx } from './with-tenant';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  /**
   * Get reservation metrics (Operator/Admin only)
   */
  @Roles('operator', 'admin')
  @Get('/reservations')
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to analyze (default 30)' })
  async getReservationMetrics(@Query('days') days?: string) {
    const dayCount = parseInt(days || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dayCount);

    return withTx(async (tx) => {
      // All reservations
      const allReservations = await tx.reservation.findMany({
        where: { createdAt: { gte: startDate } },
        include: { items: true },
      });

      const total = allReservations.length;

      // Status breakdown
      const byStatus = {
        pending: allReservations.filter((r) => r.status === 'pending').length,
        approved: allReservations.filter((r) => r.status === 'approved').length,
        denied: allReservations.filter((r) => r.status === 'denied').length,
        active: allReservations.filter((r) => r.status === 'active').length,
        returned: allReservations.filter((r) => r.status === 'returned').length,
        cancelled: allReservations.filter((r) => r.status === 'cancelled').length,
      };

      // On-time return rate
      const returnedReservations = allReservations.filter((r) => r.status === 'returned');
      const onTimeReturns = returnedReservations.filter((r) => {
        if (!r.actualReturnDate || !r.returnDate) return false;
        return r.actualReturnDate <= r.returnDate;
      });
      const onTimeReturnRate = returnedReservations.length > 0
        ? (onTimeReturns.length / returnedReservations.length) * 100
        : 0;

      // Average usage duration
      const totalUsageDays = returnedReservations.reduce((sum, r) => {
        if (!r.requestDate || !r.actualReturnDate) return sum;
        const days = (r.actualReturnDate.getTime() - r.requestDate.getTime()) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0);
      const avgUsageDays = returnedReservations.length > 0
        ? totalUsageDays / returnedReservations.length
        : 0;

      // Late returns
      const lateReturns = returnedReservations.filter((r) => {
        if (!r.actualReturnDate || !r.returnDate) return false;
        return r.actualReturnDate > r.returnDate;
      });

      // Average delay for late returns
      const totalDelay = lateReturns.reduce((sum, r) => {
        if (!r.actualReturnDate || !r.returnDate) return sum;
        const delay = (r.actualReturnDate.getTime() - r.returnDate.getTime()) / (1000 * 60 * 60 * 24);
        return sum + delay;
      }, 0);
      const avgDelayDays = lateReturns.length > 0 ? totalDelay / lateReturns.length : 0;

      // Upcoming due (approved or active, due within 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      
      const upcomingDue = await tx.reservation.findMany({
        where: {
          status: { in: ['approved', 'active'] },
          returnDate: {
            lte: sevenDaysFromNow,
            gte: new Date(),
          },
        },
        orderBy: { returnDate: 'asc' },
        take: 10,
        select: {
          id: true,
          requesterName: true,
          requesterEmail: true,
          returnDate: true,
          status: true,
          items: {
            select: {
              assetTypeName: true,
              quantity: true,
            },
          },
        },
      });

      // Most requested equipment types
      const equipmentRequests = allReservations.flatMap((r) => r.items);
      const equipmentCounts = equipmentRequests.reduce((acc, item) => {
        const name = item.assetTypeName;
        acc[name] = (acc[name] || 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);

      const mostRequested = Object.entries(equipmentCounts)
        .map(([name, count]) => ({ equipmentType: name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Approval rate
      const processedReservations = allReservations.filter(
        (r) => r.status !== 'pending' && r.status !== 'cancelled'
      );
      const approvedCount = allReservations.filter((r) => 
        r.status === 'approved' || r.status === 'active' || r.status === 'returned'
      ).length;
      const approvalRate = processedReservations.length > 0
        ? (approvedCount / processedReservations.length) * 100
        : 0;

      // Trend data (daily)
      const trend = [];
      for (let i = dayCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const created = allReservations.filter(
          (r) => r.createdAt >= date && r.createdAt < nextDate
        ).length;

        const approved = allReservations.filter(
          (r) => r.approvedDate && r.approvedDate >= date && r.approvedDate < nextDate
        ).length;

        const returned = allReservations.filter(
          (r) => r.actualReturnDate && r.actualReturnDate >= date && r.actualReturnDate < nextDate
        ).length;

        trend.push({
          date: date.toISOString().split('T')[0],
          created,
          approved,
          returned,
        });
      }

      return {
        summary: {
          total,
          byStatus,
          approvalRate: parseFloat(approvalRate.toFixed(2)),
        },
        performance: {
          onTimeReturnRate: parseFloat(onTimeReturnRate.toFixed(2)),
          onTimeCount: onTimeReturns.length,
          lateCount: lateReturns.length,
          avgUsageDays: parseFloat(avgUsageDays.toFixed(2)),
          avgDelayDays: parseFloat(avgDelayDays.toFixed(2)),
        },
        upcoming: {
          dueWithin7Days: upcomingDue.length,
          reservations: upcomingDue,
        },
        equipment: {
          mostRequested,
        },
        trend,
        period: {
          days: dayCount,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      };
    });
  }

  /**
   * Get equipment utilization stats
   */
  @Roles('operator', 'admin')
  @Get('/equipment-utilization')
  async getEquipmentUtilization() {
    return withTx(async (tx) => {
      const availability = await tx.equipmentAvailability.findMany({
        orderBy: { assetTypeName: 'asc' },
      });

      const utilization = availability.map((eq) => ({
        equipmentType: eq.assetTypeName,
        total: eq.totalCount,
        assigned: eq.assignedCount,
        reserved: eq.reservedCount,
        available: eq.availableCount,
        utilizationRate: eq.totalCount > 0
          ? parseFloat((((eq.assignedCount + eq.reservedCount) / eq.totalCount) * 100).toFixed(2))
          : 0,
      }));

      const totalEquipment = availability.reduce((sum, eq) => sum + eq.totalCount, 0);
      const totalInUse = availability.reduce((sum, eq) => sum + eq.assignedCount + eq.reservedCount, 0);
      const totalAvailable = availability.reduce((sum, eq) => sum + eq.availableCount, 0);
      const overallUtilization = totalEquipment > 0
        ? parseFloat(((totalInUse / totalEquipment) * 100).toFixed(2))
        : 0;

      const overall = {
        totalEquipment,
        totalInUse,
        totalAvailable,
        overallUtilization,
      };

      return {
        overall,
        byEquipmentType: utilization,
      };
    });
  }
}

