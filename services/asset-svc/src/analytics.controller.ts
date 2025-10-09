/**
 * AnalyticsController - Asset analytics and metrics
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
   * Get asset overview metrics (Operator/Admin only)
   */
  @Roles('operator', 'admin')
  @Get('/assets')
  async getAssetOverview() {
    return withTx(async (tx) => {
      // Total assets
      const total = await tx.asset.count();

      // By status
      const byStatus = {
        available: await tx.asset.count({ where: { status: 'available' } }),
        assigned: await tx.asset.count({ where: { status: 'assigned' } }),
        maintenance: await tx.asset.count({ where: { status: 'maintenance' } }),
        retired: await tx.asset.count({ where: { status: 'retired' } }),
      };

      // By type
      const assetTypes = await tx.assetType.findMany({
        include: {
          assets: {
            select: { id: true, status: true },
          },
        },
      });

      const byType = assetTypes.map((type) => ({
        type: type.name,
        total: type.assets.length,
        available: type.assets.filter((a) => a.status === 'available').length,
        assigned: type.assets.filter((a) => a.status === 'assigned').length,
        maintenance: type.assets.filter((a) => a.status === 'maintenance').length,
        retired: type.assets.filter((a) => a.status === 'retired').length,
      }));

      // By location
      const allAssets = await tx.asset.findMany({
        select: { location: true, status: true },
      });

      const locationMap = allAssets.reduce((acc, asset) => {
        const loc = asset.location || 'Unassigned';
        if (!acc[loc]) {
          acc[loc] = { total: 0, available: 0, assigned: 0 };
        }
        acc[loc].total++;
        if (asset.status === 'available') acc[loc].available++;
        if (asset.status === 'assigned') acc[loc].assigned++;
        return acc;
      }, {} as Record<string, { total: number; available: number; assigned: number }>);

      const byLocation = Object.entries(locationMap).map(([location, counts]) => ({
        location,
        ...counts,
      }));

      // Utilization rate
      const utilizationRate = total > 0
        ? parseFloat(((byStatus.assigned / total) * 100).toFixed(2))
        : 0;

      // Active assignments
      const activeAssignments = await tx.assetAssignment.count({
        where: { unassignedAt: null },
      });

      return {
        summary: {
          total,
          byStatus,
          utilizationRate,
          activeAssignments,
        },
        breakdown: {
          byType,
          byLocation,
        },
      };
    });
  }

  /**
   * Get asset aging analysis
   */
  @Roles('operator', 'admin')
  @Get('/assets/aging')
  async getAssetAging() {
    return withTx(async (tx) => {
      const assets = await tx.asset.findMany({
        include: {
          assetType: { select: { name: true } },
        },
      });

      const now = new Date();
      
      // Calculate age in days
      const aged = assets.map((asset) => {
        const ageMs = now.getTime() - asset.createdAt.getTime();
        const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
        const ageYears = parseFloat((ageDays / 365).toFixed(1));

        return {
          id: asset.id,
          assetTag: asset.assetTag,
          type: asset.assetType.name,
          status: asset.status,
          ageDays,
          ageYears,
          createdAt: asset.createdAt,
        };
      });

      // Group by age ranges
      const ageRanges = {
        under1Year: aged.filter((a) => a.ageYears < 1).length,
        '1to2Years': aged.filter((a) => a.ageYears >= 1 && a.ageYears < 2).length,
        '2to3Years': aged.filter((a) => a.ageYears >= 2 && a.ageYears < 3).length,
        '3to5Years': aged.filter((a) => a.ageYears >= 3 && a.ageYears < 5).length,
        over5Years: aged.filter((a) => a.ageYears >= 5).length,
      };

      // Assets needing refresh (3+ years old and not retired)
      const needsRefresh = aged
        .filter((a) => a.ageYears >= 3 && a.status !== 'retired')
        .sort((a, b) => b.ageYears - a.ageYears)
        .slice(0, 20);

      return {
        ageDistribution: ageRanges,
        needsRefresh: {
          count: needsRefresh.length,
          assets: needsRefresh,
        },
        averageAge: aged.length > 0
          ? parseFloat((aged.reduce((sum, a) => sum + a.ageYears, 0) / aged.length).toFixed(2))
          : 0,
      };
    });
  }

  /**
   * Get assignment history and trends
   */
  @Roles('operator', 'admin')
  @Get('/assets/assignment-trends')
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to analyze (default 30)' })
  async getAssignmentTrends(@Query('days') days?: string) {
    const dayCount = parseInt(days || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dayCount);

    return withTx(async (tx) => {
      const assignments = await tx.assetAssignment.findMany({
        where: {
          assignedAt: { gte: startDate },
        },
        include: {
          asset: {
            include: {
              assetType: { select: { name: true } },
            },
          },
        },
      });

      // Trend data
      const trend = [];
      for (let i = dayCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const assigned = assignments.filter(
          (a) => a.assignedAt >= date && a.assignedAt < nextDate
        ).length;

        const unassigned = assignments.filter(
          (a) => a.unassignedAt && a.unassignedAt >= date && a.unassignedAt < nextDate
        ).length;

        trend.push({
          date: date.toISOString().split('T')[0],
          assigned,
          unassigned,
        });
      }

      // Most frequently assigned types
      const typeAssignments = assignments.reduce((acc, assignment) => {
        const type = assignment.asset.assetType.name;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostAssigned = Object.entries(typeAssignments)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Average assignment duration (for completed assignments)
      const completedAssignments = assignments.filter((a) => a.unassignedAt !== null);
      const totalDuration = completedAssignments.reduce((sum, a) => {
        if (!a.unassignedAt) return sum;
        const duration = a.unassignedAt.getTime() - a.assignedAt.getTime();
        return sum + duration;
      }, 0);
      const avgDurationMs = completedAssignments.length > 0
        ? totalDuration / completedAssignments.length
        : 0;
      const avgDurationDays = parseFloat((avgDurationMs / (1000 * 60 * 60 * 24)).toFixed(2));

      return {
        summary: {
          totalAssignments: assignments.length,
          completed: completedAssignments.length,
          active: assignments.filter((a) => a.unassignedAt === null).length,
          avgDurationDays,
        },
        trend,
        mostAssigned,
        period: {
          days: dayCount,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      };
    });
  }

  /**
   * Get lifecycle events summary
   */
  @Roles('operator', 'admin')
  @Get('/assets/lifecycle-events')
  @ApiQuery({ name: 'limit', required: false, description: 'Number of recent events (default 20)' })
  async getLifecycleEvents(@Query('limit') limit?: string) {
    const take = Math.min(parseInt(limit || '20', 10), 100);

    return withTx(async (tx) => {
      const events = await tx.lifecycleEvent.findMany({
        orderBy: { occurredAt: 'desc' },
        take,
        include: {
          asset: {
            include: {
              assetType: { select: { name: true } },
            },
          },
        },
      });

      const formattedEvents = events.map((event) => ({
        id: event.id,
        action: event.action,
        assetTag: event.asset.assetTag,
        assetType: event.asset.assetType.name,
        actorId: event.actorId,
        metadata: event.metadata,
        occurredAt: event.occurredAt,
      }));

      // Event type distribution
      const eventCounts = events.reduce((acc, event) => {
        acc[event.action] = (acc[event.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        recentEvents: formattedEvents,
        distribution: eventCounts,
      };
    });
  }
}

