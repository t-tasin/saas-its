import { Body, Controller, Delete, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from './auth/roles.decorator';
import { withTx } from './with-tenant';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('asset-types')
@ApiBearerAuth()
@Controller('asset-types')
export class AssetTypeController {
  /**
   * List all asset types (operators and admins)
   */
  @Roles('operator', 'admin')
  @Get()
  async list() {
    return withTx((tx) =>
      tx.assetType.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          _count: {
            select: { assets: true },
          },
        },
      }),
    );
  }

  /**
   * Create a new asset type (admin only)
   */
  @Roles('admin')
  @Post()
  async create(@Body() body: { name: string }) {
    const name = (body.name || '').trim();
    if (!name) {
      throw new BadRequestException('Asset type name is required');
    }

    return withTx(async (tx) => {
      const existing = await tx.assetType.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      });
      if (existing) {
        return existing;
      }
      return tx.assetType.create({
        data: { name },
      });
    });
  }

  /**
   * Delete an asset type (admin only)
   */
  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return withTx(async (tx) => {
      const assetCount = await tx.asset.count({ where: { assetTypeId: id } });
      if (assetCount > 0) {
        throw new BadRequestException('Cannot delete asset type that is in use');
      }
      await tx.assetType.delete({ where: { id } });
      return { success: true };
    });
  }
}
