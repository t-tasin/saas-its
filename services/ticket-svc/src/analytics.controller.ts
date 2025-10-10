/**
 * AnalyticsController - Ticket analytics and dashboard metrics
 */
import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Roles } from './auth/roles.decorator';
import { withTx } from './with-tenant';

@ApiTags('tickets')
@ApiBearerAuth()
@Controller('tickets')
export class AnalyticsController {
  /**
   * Get ticket health metrics (Operator/Admin only)
   */
  @Roles('operator', 'admin')
  @Get('analytics')
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to analyze (default 30)' })
  async getTicketHealth(@Query('days') days?: string) {
    const dayCount = parseInt(days || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dayCount);

    return withTx(async (tx) => {
      // Total tickets
      const total = await tx.ticket.count();
      
      // Open vs Closed
      const openTickets = await tx.ticket.count({
        where: { status: { in: ['open', 'in_progress'] } },
      });
      const closedTickets = await tx.ticket.count({
        where: { status: { in: ['resolved', 'closed'] } },
      });

      // Tickets in time range
      const recentTickets = await tx.ticket.findMany({
        where: { createdAt: { gte: startDate } },
        select: {
          id: true,
          status: true,
          priority: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          category: { select: { name: true } },
        },
      });

      // Calculate MTTR (Mean Time To Resolution)
      const resolvedTickets = recentTickets.filter(
        (t) => t.status === 'resolved' || t.status === 'closed'
      );
      const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
        const resolutionTime = ticket.updatedAt.getTime() - ticket.createdAt.getTime();
        return sum + resolutionTime;
      }, 0);
      const mttrMs = resolvedTickets.length > 0 ? totalResolutionTime / resolvedTickets.length : 0;
      const mttrDays = mttrMs / (1000 * 60 * 60 * 24);

      // SLA breach rate (assuming 48 hour SLA for now)
      const slaHours = 48;
      const slaBreaches = recentTickets.filter((t) => {
        const age = Date.now() - t.createdAt.getTime();
        const ageHours = age / (1000 * 60 * 60);
        return ageHours > slaHours && (t.status === 'open' || t.status === 'in_progress');
      });
      const slaBreachRate = recentTickets.length > 0 
        ? (slaBreaches.length / recentTickets.length) * 100 
        : 0;

      // Backlog trend (tickets created vs resolved per day)
      const backlogTrend = [];
      for (let i = dayCount - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const created = recentTickets.filter(
          (t) => t.createdAt >= date && t.createdAt < nextDate
        ).length;

        const resolved = recentTickets.filter(
          (t) =>
            (t.status === 'resolved' || t.status === 'closed') &&
            t.updatedAt >= date &&
            t.updatedAt < nextDate
        ).length;

        backlogTrend.push({
          date: date.toISOString().split('T')[0],
          created,
          resolved,
          delta: created - resolved,
        });
      }

      // Volume per category
      const categoryVolume = await tx.category.findMany({
        include: {
          tickets: {
            where: { createdAt: { gte: startDate } },
            select: { id: true, status: true, priority: true },
          },
        },
      });

      const perCategoryVolume = categoryVolume.map((cat) => ({
        category: cat.name,
        total: cat.tickets.length,
        open: cat.tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length,
        closed: cat.tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length,
        high: cat.tickets.filter((t) => t.priority === 'high' || t.priority === 'urgent').length,
      }));

      // Priority distribution
      const byPriority = {
        low: recentTickets.filter((t) => t.priority === 'low').length,
        medium: recentTickets.filter((t) => t.priority === 'medium').length,
        high: recentTickets.filter((t) => t.priority === 'high').length,
        urgent: recentTickets.filter((t) => t.priority === 'urgent').length,
      };

      return {
        summary: {
          total,
          open: openTickets,
          closed: closedTickets,
          openRate: total > 0 ? (openTickets / total) * 100 : 0,
        },
        metrics: {
          mttrDays: parseFloat(mttrDays.toFixed(2)),
          slaBreachRate: parseFloat(slaBreachRate.toFixed(2)),
          slaBreachCount: slaBreaches.length,
        },
        trends: {
          backlog: backlogTrend,
          byPriority,
        },
        categories: perCategoryVolume,
        period: {
          days: dayCount,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      };
    });
  }

  /**
   * Get ticket status distribution
   */
  @Roles('operator', 'admin')
  @Get('analytics/status-distribution')
  async getStatusDistribution() {
    return withTx(async (tx) => {
      const tickets = await tx.ticket.groupBy({
        by: ['status'],
        _count: true,
      });

      return tickets.map((group) => ({
        status: group.status,
        count: group._count,
      }));
    });
  }

  /**
   * Get recent ticket activity
   */
  @Roles('operator', 'admin')
  @Get('analytics/recent-activity')
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records (default 10)' })
  async getRecentActivity(@Query('limit') limit?: string) {
    const take = Math.min(parseInt(limit || '10', 10), 50);

    return withTx(async (tx) => {
      const recentTickets = await tx.ticket.findMany({
        orderBy: { updatedAt: 'desc' },
        take,
        select: {
          id: true,
          number: true,
          title: true,
          status: true,
          priority: true,
          updatedAt: true,
          category: { select: { name: true } },
        },
      });

      return recentTickets;
    });
  }
}

