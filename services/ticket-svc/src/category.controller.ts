/**
 * CategoryController - Manage ticket categories and subcategories
 */
import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe, ConflictException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { withTx } from './with-tenant';
import { Roles } from './auth/roles.decorator';
import { Public } from './auth/public.decorator';
import { CreateCategoryDto, UpdateCategoryDto, CreateSubCategoryDto, UpdateSubCategoryDto } from './dto/category.dto';
import { Prisma } from '../generated/client';

@ApiTags('ticket-catalog')
@ApiBearerAuth()
@Controller('tickets/catalog')
export class CategoryController {
  /**
   * List all categories with their subcategories
   */
  @Roles('operator', 'admin')
  @Get('categories')
  async listCategories() {
    try {
      return withTx((tx) =>
        tx.category.findMany({
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        }),
      );
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  /**
   * Get single category with subcategories
   */
  @Public()
  @Get('categories/:id')
  async getCategory(@Param('id', ParseUUIDPipe) id: string) {
    return withTx(async (tx) => {
      return tx.category.findUniqueOrThrow({
        where: { id },
        include: {
          subcategories: {
            orderBy: { name: 'asc' },
          },
        },
      });
    });
  }

  /**
   * Create category (operator/admin only)
   */
  @Roles('operator', 'admin')
  @Post('categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return withTx(async (tx) => {
      try {
        return await tx.category.create({
          data: { name: dto.name },
          include: {
            subcategories: true,
          },
        });
      } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          throw new ConflictException('Category name already exists');
        }
        throw e;
      }
    });
  }

  /**
   * Update category (operator/admin only)
   */
  @Roles('operator', 'admin')
  @Patch('categories/:id')
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return withTx(async (tx) => {
      try {
        return await tx.category.update({
          where: { id },
          data: { name: dto.name },
          include: {
            subcategories: true,
          },
        });
      } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          throw new ConflictException('Category name already exists');
        }
        throw e;
      }
    });
  }

  /**
   * Delete category (admin only)
   */
  @Roles('admin')
  @Delete('categories/:id')
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return withTx(async (tx) => {
      await tx.category.delete({ where: { id } });
      return { message: 'Category deleted successfully' };
    });
  }

  /**
   * List subcategories for a category
   */
  @Public()
  @Get('categories/:id/subcategories')
  async listSubCategories(@Param('id', ParseUUIDPipe) categoryId: string) {
    return withTx(async (tx) => {
      return tx.subCategory.findMany({
        where: { categoryId },
        orderBy: { name: 'asc' },
      });
    });
  }

  /**
   * Create subcategory (operator/admin only)
   */
  @Roles('operator', 'admin')
  @Post('categories/:id/subcategories')
  async createSubCategory(
    @Param('id', ParseUUIDPipe) categoryId: string,
    @Body() dto: CreateSubCategoryDto,
  ) {
    return withTx(async (tx) => {
      try {
        return await tx.subCategory.create({
          data: {
            categoryId,
            name: dto.name,
          },
        });
      } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          throw new ConflictException('SubCategory name already exists in this category');
        }
        throw e;
      }
    });
  }

  /**
   * Update subcategory (operator/admin only)
   */
  @Roles('operator', 'admin')
  @Patch('subcategories/:id')
  async updateSubCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return withTx(async (tx) => {
      try {
        return await tx.subCategory.update({
          where: { id },
          data: { name: dto.name },
        });
      } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          throw new ConflictException('SubCategory name already exists in this category');
        }
        throw e;
      }
    });
  }

  /**
   * Delete subcategory (admin only)
   */
  @Roles('admin')
  @Delete('subcategories/:id')
  async deleteSubCategory(@Param('id', ParseUUIDPipe) id: string) {
    return withTx(async (tx) => {
      await tx.subCategory.delete({ where: { id } });
      return { message: 'SubCategory deleted successfully' };
    });
  }
}
