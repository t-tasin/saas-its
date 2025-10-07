import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { withTenant } from './prisma-tenant';

@Controller('assets')
export class AssetController {
  @Get()
  async list(@Req() req: Request) {
    const tenant = req.tenant?.tenantId!;
    return withTenant(tenant, (tx) =>
      tx.asset.findMany({ orderBy: { updatedAt: 'desc' } })
    );
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: any) {
    const tenant = req.tenant?.tenantId!;
    return withTenant(tenant, (tx) =>
      tx.asset.create({
        data: {
          tenantId: tenant,
          assetTag: dto.assetTag,
          type: dto.type,
          summary: dto.summary ?? null,
        },
      })
    );
  }

  @Post(':id/assign')
  async assign(@Req() req: Request, @Param('id') id: string, @Body() dto: any) {
    const tenant = req.tenant?.tenantId!;
    return withTenant(tenant, (tx) =>
      tx.assetAssignment.create({
        data: {
          tenantId: tenant,
          assetId: id,
          personId: dto.personId,
        },
      })
    );
  }

  @Post(':id/unassign')
  async unassign(@Req() req: Request, @Param('id') id: string) {
    const tenant = req.tenant?.tenantId!;
    return withTenant(tenant, async (tx) => {
      const active = await tx.assetAssignment.findFirst({
        where: { tenantId: tenant, assetId: id, unassignedAt: null },
        orderBy: { assignedAt: 'desc' },
      });
      if (!active) return { ok: true, message: 'No active assignment' };
      await tx.assetAssignment.update({
        where: { id: active.id },
        data: { unassignedAt: new Date() },
      });
      return { ok: true };
    });
  }
}
