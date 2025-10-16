/**
 * ticket.controller.ts
 * Location: services/ticket-svc/src/ticket.controller.ts
 * Purpose: Tickets API (v1) with list/get/create/status/comments
 */
import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { withTx } from './with-tenant';
import { Public } from './auth/public.decorator';
import { Roles } from './auth/roles.decorator';
import {
  CreateTicketDto,
  PatchStatusDto,
  UpdateTicketDto,
  ListQueryDto,
  CreateCommentDto,
} from './dto/ticket.dto';
import { TicketNumberService } from './ticket-number.service';
import { AuditService } from './shared/audit.service';
import { StorageService } from './storage.service';


@ApiTags('tickets')
@ApiBearerAuth()
@Controller('/tickets')
export class TicketController {
  constructor(
    private readonly num: TicketNumberService,
    private readonly audit: AuditService,
    private readonly storage: StorageService,
  ) {}

  @Get()
  async list(@Req() req: any, @Query() q: ListQueryDto) {
    return withTx(async (tx) => {
      const user = req.user; // May be undefined for unauthenticated requests
      const take = Math.min(Math.max(Number(q.limit || 50), 1), 100);

      let cursorObj: { id: string; updatedAt: Date } | undefined;
      if (q.cursor) {
        const [id, updatedAt] = Buffer.from(q.cursor, 'base64')
          .toString('utf8')
          .split('|');
        cursorObj = { id, updatedAt: new Date(updatedAt) };
      }

      const where: any = {};
      
      // Role-based filtering: general users only see their own tickets
      if (user && user.role === 'general') {
        where.requestedByUser = user.sub;
      }
      
      // Filter by status (exclude closed by default unless includeClosed is true)
      if (q.status) {
        where.status = q.status;
      } else if (!q.includeClosed) {
        // Default: exclude closed tickets
        where.status = { not: 'closed' };
      }
      
      if (q.type) where.type = q.type;
      
      // Filter by assigned technician
      if (q.assignedTo && user) {
        if (q.assignedTo === 'me') {
          // Show tickets assigned to current user (either single or multi-tech)
          where.OR = [
            { assignedTo: user.sub },
            { assignedTechnicians: { array_contains: user.sub } },
          ];
        } else {
          // Specific user ID
          where.OR = [
            { assignedTo: q.assignedTo },
            { assignedTechnicians: { array_contains: q.assignedTo } },
          ];
        }
      }
      
      // Filter by asset
      if (q.assetId) {
        where.assetId = q.assetId;
      }
      
      if (q.q) {
        where.AND = where.AND || [];
        where.AND.push({
          OR: [
            { title: { contains: q.q, mode: 'insensitive' } },
            { description: { contains: q.q, mode: 'insensitive' } },
          ],
        });
      }

      const items = await tx.ticket.findMany({
        where,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        take,
        ...(cursorObj ? { skip: 1, cursor: { id: cursorObj.id } } : {}),
        include: {
          category: true,
          subcategory: true,
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
  @Public() // Allow general users (unauthenticated) to create tickets
  async create(@Req() req: any, @Body() dto: CreateTicketDto) {
    return withTx(async (tx) => {
      const number = await this.num.next(tx);
      const user = req.user; // May be undefined for unauthenticated requests

      // FIX: Determine requester info from user or dto (use correct DTO fields)
      const requesterEmail = user?.email || dto.requesterEmail || null;
      const requesterName = user?.name || dto.requesterName || null;

      const headerSource = (req.headers?.['x-ticket-source'] as string) || (req.headers?.['x-ticket-source'.toLowerCase()] as string);
      const inferredSource = dto.source
        ?? (headerSource ? headerSource.toLowerCase() : user ? 'portal' : 'manual');
      const slaTarget = new Date();
      slaTarget.setHours(slaTarget.getHours() + 48);

      const ticket = await tx.ticket.create({
        data: {
          number,
          title: dto.title,
          description: dto.description ?? null,
          type: dto.type ?? 'incident',
          priority: dto.priority ?? 'medium',
          requestedBy: dto.requestedBy ?? null,
          requestedByUser: user?.sub ?? null,
          requesterName,
          requesterEmail,
          categoryId: dto.categoryId ?? null,
          subcategoryId: dto.subcategoryId ?? null,
          assetId: dto.assetId ?? null, // NEW: Associate asset
          assignedTechnicians: [], // NEW: Initialize empty array
          source: inferredSource,
          targetDate: slaTarget,
        },
      });

      // Audit
      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: ticket.id,
        action: 'create',
        actorId: user?.sub,
      });

      return ticket;
    });
  }

  @Get(':id')
  @Public() // Allow anyone to view tickets
  async get(@Req() req: any, @Param('id') id: string) {
    return withTx((tx) =>
      tx.ticket.findFirstOrThrow({ 
        where: { id },
        include: {
          category: true,
          subcategory: true,
          comments: {
            orderBy: { createdAt: 'asc' },
          },
        },
      }),
    );
  }

  @Patch(':id')
  @Roles('operator', 'admin') // Only operators and admins can update tickets
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
  ) {
    return withTx(async (tx) => {
      const user = req.user;
      
      // Build update data object
      const updateData: any = {};
      if (dto.assetId !== undefined) updateData.assetId = dto.assetId;
      if (dto.title) updateData.title = dto.title;
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.priority) updateData.priority = dto.priority;

      const ticket = await tx.ticket.update({
        where: { id },
        data: updateData,
      });

      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: id,
        action: 'update',
        actorId: user?.sub,
        metadata: dto,
      });

      return ticket;
    });
  }

  @Patch(':id/status')
  @Roles('operator', 'admin') // Only operators and admins can change status
  async patchStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: PatchStatusDto,
  ) {
    return withTx(async (tx) => {
      const user = req.user;
      const ticketBefore = await tx.ticket.findUniqueOrThrow({
        where: { id },
        select: {
          status: true,
          firstResponseAt: true,
          reopenCount: true,
          resolvedAt: true,
        },
      });

      const updateData: any = { status: dto.status };

      // Auto-set timestamps based on status
      if (dto.status === 'resolved') {
        updateData.resolvedAt = new Date();
      }
      if (dto.status === 'closed') {
        updateData.closedAt = new Date();
        if (!ticketBefore.resolvedAt) {
          updateData.resolvedAt = new Date();
        }
      }

      if (
        (!ticketBefore.firstResponseAt) &&
        user &&
        (user.role === 'operator' || user.role === 'admin')
      ) {
        updateData.firstResponseAt = new Date();
        updateData.firstResponseBy = user.sub ?? null;
      }

      if (
        (ticketBefore.status === 'resolved' || ticketBefore.status === 'closed') &&
        (dto.status === 'open' || dto.status === 'in_progress')
      ) {
        updateData.reopenCount = (ticketBefore.reopenCount ?? 0) + 1;
      }

      const t = await tx.ticket.update({
        where: { id },
        data: updateData,
      });

      // If comment provided, add it
      if ((dto as any).comment) {
        await tx.ticketComment.create({
          data: {
            ticketId: id,
            authorId: user?.sub ?? null,
            authorName: user?.name ?? null,
            authorRole: user?.role ?? null,
            body: (dto as any).comment,
          },
        });
      }

      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: id,
        action: 'status',
        actorId: user?.sub,
        metadata: { status: dto.status },
      });

      return t;
    });
  }

  @Patch(':id/assign')
  @Roles('operator', 'admin') // Only operators and admins can assign tickets
  async assignTicket(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { operatorId: string },
  ) {
    return withTx(async (tx) => {
      const ticket = await tx.ticket.update({
        where: { id },
        data: {
          assignedTo: body.operatorId,
          status: 'in_progress', // Auto-update status when assigned
        },
      });

      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: id,
        action: 'assign',
        actorId: req.user?.sub,
        metadata: { assignedTo: body.operatorId },
      });

      if (
        req.user &&
        (req.user.role === 'operator' || req.user.role === 'admin')
      ) {
        if (!ticket.firstResponseAt) {
          await tx.ticket.update({
            where: { id },
            data: {
              firstResponseAt: new Date(),
              firstResponseBy: req.user.sub ?? null,
            },
          });
        }
      }

      return {
        success: true,
        message: 'Ticket assigned successfully',
      };
    });
  }

  @Post(':id/assign-technician')
  @Roles('operator', 'admin') // Only operators and admins can assign additional technicians
  async assignAdditionalTechnician(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { technicianId: string },
  ) {
    return withTx(async (tx) => {
      const ticket = await tx.ticket.findUniqueOrThrow({
        where: { id },
        select: {
          assignedTechnicians: true,
          firstResponseAt: true,
        },
      });
      const techs = (ticket.assignedTechnicians as string[]) || [];
      
      // Add technician if not already assigned
      if (!techs.includes(body.technicianId)) {
        techs.push(body.technicianId);
        
        await tx.ticket.update({
          where: { id },
          data: { assignedTechnicians: techs },
        });
        
        if (
          req.user &&
          (req.user.role === 'operator' || req.user.role === 'admin')
        ) {
          if (!ticket.firstResponseAt) {
            await tx.ticket.update({
              where: { id },
              data: {
                firstResponseAt: new Date(),
                firstResponseBy: req.user.sub ?? null,
              },
            });
          }
        }

        await this.audit.log(tx, {
          entity: 'ticket',
          entityId: id,
          action: 'assign-technician',
          actorId: req.user?.sub,
          metadata: { technicianId: body.technicianId },
        });
      }
      
      return {
        success: true,
        message: 'Technician assigned successfully',
        assignedTechnicians: techs,
      };
    });
  }

  @Delete(':id/assign-technician/:technicianId')
  @Roles('operator', 'admin') // Only operators and admins can remove technicians
  async removeAssignedTechnician(
    @Req() req: any,
    @Param('id') id: string,
    @Param('technicianId') technicianId: string,
  ) {
    return withTx(async (tx) => {
      const ticket = await tx.ticket.findUniqueOrThrow({ where: { id } });
      let techs = (ticket.assignedTechnicians as string[]) || [];
      
      // Remove technician
      techs = techs.filter(t => t !== technicianId);
      
      await tx.ticket.update({
        where: { id },
        data: { assignedTechnicians: techs },
      });
      
      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: id,
        action: 'remove-technician',
        actorId: req.user?.sub,
        metadata: { technicianId },
      });
      
      return {
        success: true,
        message: 'Technician removed successfully',
        assignedTechnicians: techs,
      };
    });
  }

  @Get(':id/comments')
  @Public()
  async listComments(@Req() req: any, @Param('id') id: string) {
    return withTx((tx) =>
      tx.ticketComment.findMany({
        where: { ticketId: id },
        orderBy: { createdAt: 'asc' },
      }),
    );
  }

  @Post(':id/comments')
  @Public() // Allow unauthenticated comments
  async createComment(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return withTx(async (tx) => {
      const user = req.user; // May be undefined

      const c = await tx.ticketComment.create({
        data: {
          ticketId: id,
          authorId: user?.sub ?? null,
          authorName: (user?.name || dto.authorName) ?? null,
          authorRole: user?.role ?? null,
          body: dto.body,
        },
      });

      if (user && (user.role === 'operator' || user.role === 'admin')) {
        const ticketMeta = await tx.ticket.findUnique({
          where: { id },
          select: { firstResponseAt: true },
        });
        if (ticketMeta && !ticketMeta.firstResponseAt) {
          await tx.ticket.update({
            where: { id },
            data: {
              firstResponseAt: new Date(),
              firstResponseBy: user.sub ?? null,
            },
          });
        }
      }

      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: id,
        action: 'comment',
        actorId: user?.sub,
      });

      return c;
    });
  }

  @Post(':id/attachments/upload-url')
  @Public() // Allow anyone to request upload URL for a ticket
  async requestAttachmentUpload(
    @Req() req: any,
    @Param('id') ticketId: string,
    @Body() body: { filename: string; contentType: string },
  ) {
    const { uploadUrl, key, attachmentId } = await this.storage.generateUploadUrl(
      body.filename,
      body.contentType,
      ticketId,
    );

    // Store attachment metadata in ticket
    await withTx(async (tx) => {
      const ticket = await tx.ticket.findUniqueOrThrow({ where: { id: ticketId } });
      const attachments = (ticket.attachments as any[]) || [];
      
      attachments.push({
        id: attachmentId,
        key,
        filename: body.filename,
        contentType: body.contentType,
        size: 0, // Will be updated after upload if needed
        uploadedAt: new Date().toISOString(),
        uploadedBy: req.user?.sub || 'anonymous',
      });

      await tx.ticket.update({
        where: { id: ticketId },
        data: { attachments: attachments as any },
      });

      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: ticketId,
        action: 'attachment-upload',
        actorId: req.user?.sub,
        metadata: { filename: body.filename, attachmentId },
      });
    });

    return { uploadUrl, attachmentId };
  }

  @Get(':id/attachments/:attachmentId/download-url')
  @Public() // Allow anyone to get download URL
  async getAttachmentDownloadUrl(
    @Param('id') ticketId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return withTx(async (tx) => {
      const ticket = await tx.ticket.findUniqueOrThrow({ where: { id: ticketId } });
      const attachments = (ticket.attachments as any[]) || [];
      
      const attachment = attachments.find((a) => a.id === attachmentId);
      if (!attachment) {
        throw new Error('Attachment not found');
      }

      const downloadUrl = await this.storage.generateDownloadUrl(attachment.key);
      return { downloadUrl, attachment };
    });
  }

  @Post(':id/attachments/:attachmentId/delete')
  @Roles('operator', 'admin') // Only operators and admins can delete attachments
  async deleteAttachment(
    @Req() req: any,
    @Param('id') ticketId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return withTx(async (tx) => {
      const ticket = await tx.ticket.findUniqueOrThrow({ where: { id: ticketId } });
      const attachments = (ticket.attachments as any[]) || [];
      
      const attachment = attachments.find((a) => a.id === attachmentId);
      if (!attachment) {
        throw new Error('Attachment not found');
      }

      // Delete from S3
      await this.storage.deleteFile(attachment.key);

      // Remove from ticket metadata
      const updatedAttachments = attachments.filter((a) => a.id !== attachmentId);
      await tx.ticket.update({
        where: { id: ticketId },
        data: { attachments: updatedAttachments as any },
      });

      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: ticketId,
        action: 'attachment-delete',
        actorId: req.user?.sub,
        metadata: { filename: attachment.filename, attachmentId },
      });

      return { success: true, message: 'Attachment deleted successfully' };
    });
  }
}
