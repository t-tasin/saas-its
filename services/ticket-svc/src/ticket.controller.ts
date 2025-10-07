import { Body, Controller, Get, Param, Post, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { withTenant } from './with-tenant';

const prisma = new PrismaClient();

@Controller('tickets')
export class TicketController {
  @Get()
  async list(@Req() req: Request) {
    const tenant = req.tenant!.tenantId;
    return withTenant(tenant, (tx) =>
      tx.ticket.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 50,
      })
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

  @Get(':id/comments')
    async listComments(@Req() req: Request, @Param('id') id: string) {
    const tenant = req.tenant!.tenantId;
    return withTenant(tenant, (tx) =>
        tx.ticketComment.findMany({
        where: { tenantId: tenant, ticketId: id },
        orderBy: { createdAt: 'asc' },
        })
    );
    }

    @Get(':id')
    async get(@Req() req: Request, @Param('id') id: string) {
      const tenant = req.tenant!.tenantId;
      const t = await withTenant(tenant, (tx) =>
        tx.ticket.findFirst({ where: { id, tenantId: tenant } })
      );
      if (!t) return { statusCode: 404, message: 'Ticket not found' };
      return t;
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
      // ensure ticket exists & belongs to tenant
      const t = await tx.ticket.findFirst({ where: { id, tenantId: tenant } });
      if (!t) return { error: 'Not found' };
      return tx.ticketComment.create({
        data: {
          tenantId: tenant,
          ticketId: id,
          authorId: author,
          body: dto.body,
        },
      });
    });
  }
}
