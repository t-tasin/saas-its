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

      // Tickets in time range with related data
      const recentTickets = await tx.ticket.findMany({
        where: { createdAt: { gte: startDate } },
        include: {
          comments: {
            orderBy: { createdAt: 'asc' },
            select: { createdAt: true, authorRole: true },
          },
        },
      });

      const now = new Date();
      const openStatuses = new Set(['open', 'in_progress']);
      const firstResponseDurations: number[] = [];
      const resolutionDurations: number[] = [];
      const closedDurations: number[] = [];
      const slaMetTickets: string[] = [];
      const slaBreachesOpen: string[] = [];
      const aiTicketIds = new Set<string>();
      const backlogAging = {
        under24h: 0,
        oneToThreeDays: 0,
        threeToSevenDays: 0,
        overSevenDays: 0,
      };
      const technicianWorkload = new Map<string, number>();

      const mean = (values: number[]) =>
        values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
      const median = (values: number[]) => {
        if (!values.length) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
      };
      const msToHours = (value: number) => value / (1000 * 60 * 60);
      const defaultSlaTarget = (createdAt: Date) => {
        const date = new Date(createdAt);
        date.setHours(date.getHours() + 48);
        return date;
      };

      const completedTickets: typeof recentTickets = [];

      for (const ticket of recentTickets) {
        if (ticket.source === 'nl_gateway') {
          aiTicketIds.add(ticket.id);
        }

        if (openStatuses.has(ticket.status)) {
          const ageHours = (now.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60);
          if (ageHours < 24) backlogAging.under24h++;
          else if (ageHours < 72) backlogAging.oneToThreeDays++;
          else if (ageHours < 168) backlogAging.threeToSevenDays++;
          else backlogAging.overSevenDays++;

          const assignedSet = new Set<string>();
          if (ticket.assignedTo) assignedSet.add(ticket.assignedTo);
          const extra = Array.isArray(ticket.assignedTechnicians)
            ? ticket.assignedTechnicians
            : [];
          for (const tech of extra) {
            if (typeof tech === 'string' && tech.length > 0) {
              assignedSet.add(tech);
            }
          }
          assignedSet.forEach((techId) => {
            technicianWorkload.set(techId, (technicianWorkload.get(techId) || 0) + 1);
          });

          const target = ticket.targetDate ?? defaultSlaTarget(ticket.createdAt);
          if (target && target < now) {
            slaBreachesOpen.push(ticket.id);
          }
        } else {
          completedTickets.push(ticket);
        }

        const firstResponseCandidates: Date[] = [];
        if (ticket.firstResponseAt) firstResponseCandidates.push(ticket.firstResponseAt);
        const firstOpsComment = ticket.comments.find(
          (comment) => comment.authorRole === 'operator' || comment.authorRole === 'admin',
        );
        if (firstOpsComment) firstResponseCandidates.push(firstOpsComment.createdAt);
        if (firstResponseCandidates.length) {
          const firstResponse = new Date(
            Math.min(...firstResponseCandidates.map((d) => d.getTime())),
          );
          firstResponseDurations.push(firstResponse.getTime() - ticket.createdAt.getTime());
        }

        const completionDate = ticket.closedAt ?? ticket.resolvedAt ?? null;
        if (completionDate) {
          resolutionDurations.push(completionDate.getTime() - ticket.createdAt.getTime());
          if (ticket.closedAt) {
            closedDurations.push(ticket.closedAt.getTime() - ticket.createdAt.getTime());
          }
          const target = ticket.targetDate ?? defaultSlaTarget(ticket.createdAt);
          if (target && completionDate <= target) {
            slaMetTickets.push(ticket.id);
          }
        }
      }

      const aiAuditLogs = aiTicketIds.size
        ? await tx.auditLog.findMany({
            where: {
              entity: 'ticket',
              entityId: { in: Array.from(aiTicketIds) },
              at: { gte: startDate },
            },
            select: { entityId: true, action: true, metadata: true },
          })
        : [];

      const aiOverrideSet = new Set<string>();
      aiAuditLogs.forEach((log) => {
        if (log.action === 'update' && log.metadata) {
          const metadata = log.metadata as any;
          if (metadata?.priority || metadata?.categoryId || metadata?.type) {
            aiOverrideSet.add(log.entityId);
          }
        }
      });

      const openTicketCount = await tx.ticket.count({
        where: { status: { in: ['open', 'in_progress'] } },
      });

      const firstResponseMeanHours = msToHours(mean(firstResponseDurations));
      const firstResponseMedianHours = msToHours(median(firstResponseDurations));
      const mttrHours = msToHours(mean(resolutionDurations));
      const mttrClosedHours = msToHours(mean(closedDurations));

      const completedCount = completedTickets.length;
      const slaAttainmentRate = completedCount
        ? (slaMetTickets.length / completedCount) * 100
        : 0;
      const reopenRate = completedCount
        ? (completedTickets.filter((t) => (t.reopenCount ?? 0) > 0).length / completedCount) * 100
        : 0;
      const aiTicketCount = aiTicketIds.size;
      const aiOverrideRate = aiTicketCount
        ? (aiOverrideSet.size / aiTicketCount) * 100
        : 0;
      const aiAutoClassificationAccuracy = aiTicketCount
        ? ((aiTicketCount - aiOverrideSet.size) / aiTicketCount) * 100
        : 0;
      const aiCompleted = completedTickets.filter((t) => t.source === 'nl_gateway');
      const aiResolutionDurations: number[] = [];
      aiCompleted.forEach((ticket) => {
        const completion = ticket.closedAt ?? ticket.resolvedAt;
        if (completion) {
          aiResolutionDurations.push(completion.getTime() - ticket.createdAt.getTime());
        }
      });
      const aiResolutionHours = msToHours(mean(aiResolutionDurations));

      const urgentOrPastDue = recentTickets.filter((t) => {
        const isUrgent = t.priority === 'urgent';
        const target = t.targetDate ?? defaultSlaTarget(t.createdAt);
        const pastDue = target < now;
        return openStatuses.has(t.status) && (isUrgent || pastDue);
      });

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

        const aiCreated = recentTickets.filter(
          (t) => t.createdAt >= date && t.createdAt < nextDate && t.source === 'nl_gateway'
        ).length;

        const resolved = recentTickets.filter(
          (t) =>
            (t.status === 'resolved' || t.status === 'closed') &&
            ((t.closedAt ?? t.resolvedAt) ?? t.updatedAt) >= date &&
            ((t.closedAt ?? t.resolvedAt) ?? t.updatedAt) < nextDate
        ).length;

        const aiResolved = recentTickets.filter(
          (t) =>
            t.source === 'nl_gateway' &&
            (t.status === 'resolved' || t.status === 'closed') &&
            ((t.closedAt ?? t.resolvedAt) ?? t.updatedAt) >= date &&
            ((t.closedAt ?? t.resolvedAt) ?? t.updatedAt) < nextDate
        ).length;

        backlogTrend.push({
          date: date.toISOString().split('T')[0],
          created,
          resolved,
          delta: created - resolved,
          aiCreated,
          aiResolved,
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

      const statusCounts = recentTickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byPriority = {
        low: recentTickets.filter((t) => t.priority === 'low').length,
        medium: recentTickets.filter((t) => t.priority === 'medium').length,
        high: recentTickets.filter((t) => t.priority === 'high').length,
        urgent: recentTickets.filter((t) => t.priority === 'urgent').length,
      };

      // Customer Feedback (CSAT) metrics
      const csatTickets = completedTickets.filter((t) => t.csat !== null && t.csat !== undefined);
      const csatScores = csatTickets.map((t) => t.csat!);
      const avgCsat = csatScores.length > 0
        ? parseFloat((csatScores.reduce((sum, score) => sum + score, 0) / csatScores.length).toFixed(2))
        : 0;
      const csatResponseRate = completedCount > 0
        ? parseFloat(((csatTickets.length / completedCount) * 100).toFixed(2))
        : 0;

      const csatDistribution = {
        excellent: csatScores.filter((s) => s === 5).length,
        good: csatScores.filter((s) => s === 4).length,
        neutral: csatScores.filter((s) => s === 3).length,
        poor: csatScores.filter((s) => s === 2).length,
        veryPoor: csatScores.filter((s) => s === 1).length,
      };

      // Impact Level distribution
      const byImpact = {
        P1: recentTickets.filter((t) => t.impactLevel === 'P1').length,
        P2: recentTickets.filter((t) => t.impactLevel === 'P2').length,
        P3: recentTickets.filter((t) => t.impactLevel === 'P3').length,
        P4: recentTickets.filter((t) => t.impactLevel === 'P4').length,
      };

      // Escalation metrics
      const escalatedTickets = recentTickets.filter((t) => t.escalationCount > 0);
      const totalEscalations = escalatedTickets.reduce((sum, t) => sum + t.escalationCount, 0);
      const escalationRate = recentTickets.length > 0
        ? parseFloat(((escalatedTickets.length / recentTickets.length) * 100).toFixed(2))
        : 0;

      const escalationReasons = {
        sla_breach: escalatedTickets.filter((t) => t.escalationReason === 'sla_breach').length,
        impact_level: escalatedTickets.filter((t) => t.escalationReason === 'impact_level').length,
        manual: escalatedTickets.filter((t) => t.escalationReason === 'manual').length,
      };

      const unassignedOpen = recentTickets.filter((t) => {
        if (!openStatuses.has(t.status)) return false;
        const extra = Array.isArray(t.assignedTechnicians) ? t.assignedTechnicians : [];
        return !t.assignedTo && (!extra || extra.length === 0);
      }).length;

      const ticketsPerTechnician = Array.from(technicianWorkload.entries()).map(
        ([technicianId, count]) => ({
          technicianId,
          ticketCount: count,
          shareOfOpen: openTicketCount
            ? parseFloat(((count / openTicketCount) * 100).toFixed(2))
            : 0,
        }),
      ).sort((a, b) => b.ticketCount - a.ticketCount);

      const normalizedStatusCounts = {
        open: statusCounts.open ?? 0,
        in_progress: statusCounts.in_progress ?? 0,
        resolved: statusCounts.resolved ?? 0,
        closed: statusCounts.closed ?? 0,
      };

      return {
        summary: {
          total,
          open: openTickets,
          closed: closedTickets,
          openRate: total > 0 ? (openTickets / total) * 100 : 0,
          statusCounts: normalizedStatusCounts,
        },
        timeToValue: {
          meanFirstResponseHours: parseFloat(firstResponseMeanHours.toFixed(2)),
          medianFirstResponseHours: parseFloat(firstResponseMedianHours.toFixed(2)),
          mttrHours: parseFloat(mttrHours.toFixed(2)),
          mttrClosedHours: parseFloat(mttrClosedHours.toFixed(2)),
          slaAttainmentRate: parseFloat(slaAttainmentRate.toFixed(2)),
          openSlaBreaches: slaBreachesOpen.length,
          reopenRate: parseFloat(reopenRate.toFixed(2)),
        },
        workload: {
          ticketsPerTechnician,
          backlogAging,
          unassignedOpen,
          urgentOrPastDue: urgentOrPastDue.length,
          totalEscalations,
          escalationRate,
          escalationReasons,
        },
        aiImpact: {
          totalAiTickets: aiTicketCount,
          aiSharePercent: total ? parseFloat(((aiTicketCount / total) * 100).toFixed(2)) : 0,
          openAiTickets: recentTickets.filter(
            (t) => t.source === 'nl_gateway' && openStatuses.has(t.status),
          ).length,
          humanOverrideRate: parseFloat(aiOverrideRate.toFixed(2)),
          autoClassificationAccuracy: parseFloat(aiAutoClassificationAccuracy.toFixed(2)),
          aiResolutionHours: parseFloat(aiResolutionHours.toFixed(2)),
          overrideCount: aiOverrideSet.size,
        },
        trends: {
          backlog: backlogTrend,
          byPriority,
          byImpact,
          aiUsage: backlogTrend.map((row) => ({
            date: row.date,
            created: row.aiCreated,
            resolved: row.aiResolved,
          })),
        },
        customerFeedback: {
          avgCsat,
          csatResponseRate,
          csatDistribution,
          totalResponses: csatTickets.length,
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
