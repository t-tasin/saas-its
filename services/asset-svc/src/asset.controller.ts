/**
 * AssetController (v1)
 * - GET /v1/assets: list with q= search (assetTag|summary) + cursor pagination
 * - POST /v1/assets: create asset (validated payload; 409 on duplicate assetTag)
 * - POST /v1/assets/:id/assign: enforce single active assignment (409 on conflict), update status
 * - POST /v1/assets/:id/unassign: idempotent unassign, update status
 * Writes are audited via AuditLog.
 */
import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { withTx } from './with-tenant';
import { Roles } from './auth/roles.decorator';
import { AuditService } from './shared/audit.service';
import {
  CreateAssetDto,
  AssignDto,
  ListAssetsQueryDto,
} from './dto/asset.dto';
import { Prisma } from '../generated/client';

@ApiTags('assets')
@ApiBearerAuth()
@Controller('/assets')
export class AssetController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  @Roles('operator', 'admin')
  async list(@Req() _req: Request, @Query() q: ListAssetsQueryDto) {
    return withTx(async (tx) => {
      const take = Math.min(Math.max(Number(q.limit || 50), 1), 100);

      let cursorId: string | undefined;
      if (q.cursor) {
        // cursor is base64("id|updatedAtISO")
        const [id] = Buffer.from(q.cursor, 'base64').toString('utf8').split('|');
        cursorId = id;
      }

      const where: any = {};
      if (q.q) {
        where.OR = [
          { assetTag: { contains: q.q, mode: 'insensitive' } },
          { summary:  { contains: q.q, mode: 'insensitive' } },
        ];
      }

      const items = await tx.asset.findMany({
        where,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take,
        ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {}),
        include: {
          assetType: true,
          assignments: { where: { unassignedAt: null } },
        },
      });

      const nextCursor =
        items.length === take
          ? Buffer.from(
              `${items[items.length - 1].id}|${
                items[items.length - 1].updatedAt.toISOString()
              }`,
              'utf8',
            ).toString('base64')
          : null;

      return { items, nextCursor };
    });
  }

  @Post()
  @Roles('operator', 'admin')
  async create(@Req() req: any, @Body() dto: CreateAssetDto) {
    return withTx(async (tx) => {
      try {
        const a = await tx.asset.create({
          data: {
            assetTag: dto.assetTag,
            assetTypeId: dto.assetTypeId,
            summary: dto.summary ?? null,
            location: dto.location ?? null,
            status: 'available',
          },
        });

        await this.audit.log(tx, {
          entity: 'asset',
          entityId: a.id,
          action: 'create',
          actorId: req.user?.sub,
        });

        return a;
      } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          throw new ConflictException('Asset tag already exists');
        }
        throw e;
      }
    });
  }

  @Post(':id/assign')
  @Roles('operator', 'admin')
  async assign(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignDto,
  ) {
    return withTx(async (tx) => {
      const existing = await tx.assetAssignment.findFirst({
        where: { assetId: id, unassignedAt: null },
      });
      if (existing) {
        throw new ConflictException('Asset already assigned');
      }

      const assignment = await tx.assetAssignment.create({
        data: {
          assetId: id,
          personId: dto.personId,
        },
      });

      await tx.asset.update({ where: { id }, data: { status: 'assigned' } });

      await tx.lifecycleEvent.create({
        data: {
          assetId: id,
          action: 'assigned',
          actorId: req.user?.sub,
          metadata: { personId: dto.personId },
        },
      });

      await this.audit.log(tx, {
        entity: 'asset',
        entityId: id,
        action: 'assign',
        actorId: req.user?.sub,
      });

      return assignment;
    });
  }

  @Post(':id/unassign')
  @Roles('operator', 'admin')
  async unassign(@Req() req: any, @Param('id', new ParseUUIDPipe()) id: string) {
    return withTx(async (tx) => {
      const active = await tx.assetAssignment.findFirst({
        where: { assetId: id, unassignedAt: null },
        orderBy: { assignedAt: 'desc' },
      });

      if (!active) {
        return { ok: true, message: 'No active assignment' };
      }

      await tx.assetAssignment.update({
        where: { id: active.id },
        data: { unassignedAt: new Date() },
      });

      await tx.asset.update({ where: { id }, data: { status: 'available' } });

      await tx.lifecycleEvent.create({
        data: {
          assetId: id,
          action: 'unassigned',
          actorId: req.user?.sub,
          metadata: { personId: active.personId },
        },
      });

      await this.audit.log(tx, {
        entity: 'asset',
        entityId: id,
        action: 'unassign',
        actorId: req.user?.sub,
      });

      return { ok: true };
    });
  }
}
