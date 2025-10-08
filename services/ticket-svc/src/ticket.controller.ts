// services/ticket-svc/src/ticket.controller.ts
import { Body, Controller, Get, Param, Post, Patch, Req, Headers } from '@nestjs/common';
import { Request } from 'express';
import { withTenant } from './with-tenant';
import { Prisma } from '../generated/client';

@Controller('tickets')
export class TicketController {
  @Get()
  async list(@Req() req: Request) {
    const tenant = req.tenant!.tenantId;
    return withTenant(tenant, (tx) =>
      tx.ticket.findMany({ orderBy: { updatedAt: 'desc' }, take: 50 })
    );
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: any) {
    const tenant = req.tenant!.tenantId;
    return withTenant(tenant, (tx) =>
      tx.ticket.create({
        data: {
          tenantId: tenant,
          title: dto.title,
          description: dto.description ?? '',
          type: dto.type ?? 'incident',
        },
      })
    );
  }

  @Get(':id')
  async get(@Req() req: Request, @Param('id') id: string) {
    const tenant = req.tenant!.tenantId;
    return withTenant(tenant, (tx) =>
      tx.ticket.findFirst({ where: { id, tenantId: tenant } })
    );
  }

  @Patch(':id/status')
  async setStatus(@Req() req: Request, @Param('id') id: string, @Body() dto: any) {
    const tenant = req.tenant!.tenantId;
    return withTenant(tenant, (tx) =>
      tx.ticket.update({ where: { id }, data: { status: dto.status } })
    );
  }

  @Post(':id/comments')
  async comment(@Req() req: Request, @Param('id') id: string, @Body() dto: any) {
    const tenant = req.tenant!.tenantId;
    const author = req.tenant!.sub || 'system';
    return withTenant(tenant, async (tx) => {
      const exists = await tx.ticket.findFirst({ where: { id, tenantId: tenant } });
      if (!exists) return { statusCode: 404, message: 'Ticket not found' };
      return tx.ticketComment.create({
        data: { tenantId: tenant, ticketId: id, authorId: author, body: dto.body },
      });
    });
  }

  @Get(':id/comments')
  async listComments(
    @Param('id') id: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    // In DEV_MODE, x-tenant-id must be present; in PROD you'll pull from JWT claims.
    if (!tenantId) {
      // keep consistent with your API error style; 400 is reasonable in dev
      throw new Error('X-Tenant-Id header is required in dev');
    }

    return withTenant(tenantId, async (tx: Prisma.TransactionClient) => {
      return tx.ticketComment.findMany({
        where: { ticketId: id },
        orderBy: { createdAt: 'asc' },
      });
    });
  }
}
