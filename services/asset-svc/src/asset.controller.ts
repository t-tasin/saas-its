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
  Delete,
  Get,
  Param,
  Patch,
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
  // Allow all authenticated users (general users see only their assets)
  async list(@Req() req: Request, @Query() q: ListAssetsQueryDto) {
    return withTx(async (tx) => {
      const take = Math.min(Math.max(Number(q.limit || 50), 1), 100);

      let cursorId: string | undefined;
      if (q.cursor) {
        // cursor is base64("id|updatedAtISO")
        const [id] = Buffer.from(q.cursor, 'base64').toString('utf8').split('|');
        cursorId = id;
      }

      const where: any = {};
      
      // General users can only see their own assigned assets
      const user = (req as any).user;
      if (user && user.role === 'general') {
        where.assignedToId = user.sub;
      }
      
      // Search filter (assetId or description)
      if (q.q) {
        where.OR = [
          { assetId: { contains: q.q, mode: 'insensitive' } },
          { description:  { contains: q.q, mode: 'insensitive' } },
          { serialNumber:  { contains: q.q, mode: 'insensitive' } },
        ];
      }
      
      // Type filter
      if (q.type) {
        where.type = { contains: q.type, mode: 'insensitive' };
      }
      
      // Status filter
      if (q.status) {
        where.status = q.status;
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

  @Get(':id')
  // Allow all authenticated users (general users can only see assets assigned to them)
  async getOne(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    return withTx(async (tx) => {
      const asset = await tx.asset.findUnique({
        where: { id },
        include: {
          assetType: true,
          assignments: {
            where: { unassignedAt: null },
            orderBy: { assignedAt: 'desc' },
          },
        },
      });

      if (!asset) {
        throw new ConflictException('Asset not found');
      }

      // General users can only view assets assigned to them
      const user = (req as any).user;
      if (user && user.role === 'general' && asset.assignedToId !== user.sub) {
        throw new ConflictException('Access denied');
      }

      return asset;
    });
  }

  @Post()
  @Roles('operator', 'admin')
  async create(@Req() req: any, @Body() dto: CreateAssetDto) {
    return withTx(async (tx) => {
      try {
        const a = await tx.asset.create({
          data: {
            assetId: dto.assetId,
            type: dto.type,
            description: dto.description,
            fundingDepartment: dto.fundingDepartment,
            manufacturer: dto.manufacturer ?? null,
            model: dto.model ?? null,
            modelGeneration: dto.modelGeneration ?? null,
            serialNumber: dto.serialNumber ?? null,
            vendor: dto.vendor ?? null,
            memory: dto.memory ?? null,
            hddSize: dto.hddSize ?? null,
            hddType: dto.hddType ?? null,
            cpuGeneration: dto.cpuGeneration ?? null,
            cpuSpeed: dto.cpuSpeed ?? null,
            gpuModel: dto.gpuModel ?? null,
            videoCard: dto.videoCard ?? null,
            wiredMac: dto.wiredMac ?? null,
            wirelessMac: dto.wirelessMac ?? null,
            output1: dto.output1 ?? null,
            output2: dto.output2 ?? null,
            receivedDate: dto.receivedDate ? new Date(dto.receivedDate) : null,
            cost: dto.cost ?? null,
            po: dto.po ?? null,
            disposalDate: dto.disposalDate ? new Date(dto.disposalDate) : null,
            disposalType: dto.disposalType ?? null,
            location: dto.location ?? null,
            status: (dto.status as any) || 'available',
            assetTypeId: dto.assetTypeId ?? null, // Backward compatibility
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
          throw new ConflictException('Asset ID or serial number already exists');
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
      // Check if already assigned using flattened field
      const asset = await tx.asset.findUnique({ where: { id } });
      if (asset?.assignedToId) {
        throw new ConflictException('Asset already assigned');
      }

      // Create assignment record (for history)
      const assignment = await tx.assetAssignment.create({
        data: {
          assetId: id,
          personId: dto.userId,
        },
      });

      // Update asset with flattened assignment fields
      await tx.asset.update({
        where: { id },
        data: {
          status: 'assigned',
          assignedToId: dto.userId,
          assignedDate: new Date(),
        },
      });

      await tx.lifecycleEvent.create({
        data: {
          assetId: id,
          action: 'assigned',
          actorId: req.user?.sub,
          metadata: { userId: dto.userId },
        },
      });

      await this.audit.log(tx, {
        entity: 'asset',
        entityId: id,
        action: 'assign',
        actorId: req.user?.sub,
      });

      return {
        success: true,
        message: 'Asset assigned successfully',
        assignment: {
          assetId: id,
          userId: dto.userId,
          assignedDate: new Date(),
        },
      };
    });
  }

  @Post(':id/unassign')
  @Roles('operator', 'admin')
  async unassign(@Req() req: any, @Param('id', new ParseUUIDPipe()) id: string) {
    return withTx(async (tx) => {
      const asset = await tx.asset.findUnique({ where: { id } });
      
      if (!asset?.assignedToId) {
        return { success: true, message: 'No active assignment' };
      }

      // Mark assignment record as complete
      const active = await tx.assetAssignment.findFirst({
        where: { assetId: id, unassignedAt: null },
        orderBy: { assignedAt: 'desc' },
      });

      if (active) {
        await tx.assetAssignment.update({
          where: { id: active.id },
          data: { unassignedAt: new Date() },
        });
      }

      // Update asset with flattened fields
      await tx.asset.update({
        where: { id },
        data: {
          status: 'available',
          assignedToId: null,
          assignedDate: null,
        },
      });

      await tx.lifecycleEvent.create({
        data: {
          assetId: id,
          action: 'unassigned',
          actorId: req.user?.sub,
          metadata: { userId: asset.assignedToId },
        },
      });

      await this.audit.log(tx, {
        entity: 'asset',
        entityId: id,
        action: 'unassign',
        actorId: req.user?.sub,
      });

      return { success: true, message: 'Asset unassigned successfully' };
    });
  }

  @Get('types')
  @Roles('operator', 'admin')
  async getAssetTypes(@Req() _req: any) {
    return withTx(async (tx) => {
      // Get all asset types with counts
      const types = await tx.asset.groupBy({
        by: ['type'],
        _count: true,
      });

      return {
        types: types.map((t) => ({
          name: t.type,
          count: t._count,
        })),
      };
    });
  }

  @Get('user/:userId')
  @Roles('operator', 'admin')
  async getUserAssets(@Req() _req: any, @Param('userId') userId: string) {
    return withTx(async (tx) => {
      const assets = await tx.asset.findMany({
        where: { assignedToId: userId },
        include: {
          assetType: true,
        },
      });

      return { assets };
    });
  }

  @Patch(':id')
  @Roles('operator', 'admin')
  async update(
    @Req() req: any,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: any, // Using any for flexibility with UpdateAssetDto
  ) {
    return withTx(async (tx) => {
      const updateData: any = {};
      
      // Only update fields that are provided
      if (dto.assetId !== undefined) updateData.assetId = dto.assetId;
      if (dto.type !== undefined) updateData.type = dto.type;
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.fundingDepartment !== undefined) updateData.fundingDepartment = dto.fundingDepartment;
      if (dto.manufacturer !== undefined) updateData.manufacturer = dto.manufacturer;
      if (dto.model !== undefined) updateData.model = dto.model;
      if (dto.modelGeneration !== undefined) updateData.modelGeneration = dto.modelGeneration;
      if (dto.serialNumber !== undefined) updateData.serialNumber = dto.serialNumber;
      if (dto.vendor !== undefined) updateData.vendor = dto.vendor;
      if (dto.memory !== undefined) updateData.memory = dto.memory;
      if (dto.hddSize !== undefined) updateData.hddSize = dto.hddSize;
      if (dto.hddType !== undefined) updateData.hddType = dto.hddType;
      if (dto.cpuGeneration !== undefined) updateData.cpuGeneration = dto.cpuGeneration;
      if (dto.cpuSpeed !== undefined) updateData.cpuSpeed = dto.cpuSpeed;
      if (dto.gpuModel !== undefined) updateData.gpuModel = dto.gpuModel;
      if (dto.videoCard !== undefined) updateData.videoCard = dto.videoCard;
      if (dto.wiredMac !== undefined) updateData.wiredMac = dto.wiredMac;
      if (dto.wirelessMac !== undefined) updateData.wirelessMac = dto.wirelessMac;
      if (dto.output1 !== undefined) updateData.output1 = dto.output1;
      if (dto.output2 !== undefined) updateData.output2 = dto.output2;
      if (dto.receivedDate !== undefined) updateData.receivedDate = dto.receivedDate;
      if (dto.cost !== undefined) updateData.cost = dto.cost;
      if (dto.po !== undefined) updateData.po = dto.po;
      if (dto.disposalDate !== undefined) updateData.disposalDate = dto.disposalDate;
      if (dto.disposalType !== undefined) updateData.disposalType = dto.disposalType;
      if (dto.location !== undefined) updateData.location = dto.location;
      if (dto.status !== undefined) updateData.status = dto.status;

      const asset = await tx.asset.update({
        where: { id },
        data: updateData,
      });

      await this.audit.log(tx, {
        entity: 'asset',
        entityId: id,
        action: 'update',
        actorId: req.user?.sub,
        metadata: updateData,
      });

      return {
        success: true,
        asset,
      };
    });
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Req() req: any, @Param('id', new ParseUUIDPipe()) id: string) {
    return withTx(async (tx) => {
      const asset = await tx.asset.findUnique({ where: { id } });
      
      // Cannot delete assigned assets
      if (asset?.assignedToId) {
        throw new ConflictException('Cannot delete assigned asset');
      }

      await tx.asset.delete({ where: { id } });

      await this.audit.log(tx, {
        entity: 'asset',
        entityId: id,
        action: 'delete',
        actorId: req.user?.sub,
      });

      return {
        success: true,
        message: 'Asset deleted successfully',
      };
    });
  }
}
