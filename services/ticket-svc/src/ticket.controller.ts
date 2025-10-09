/**
 * ticket.controller.ts
 * Location: services/ticket-svc/src/ticket.controller.ts
 * Purpose: Tickets API (v1) with list/get/create/status/comments
 */
import {
  Controller, Get, Post, Patch, Param, Body, Query, Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { withTx } from './with-tenant';
import { Public } from './auth/public.decorator';
import { Roles } from './auth/roles.decorator';
import {
  CreateTicketDto,
  PatchStatusDto,
  ListQueryDto,
  CreateCommentDto,
} from './dto/ticket.dto';
import { TicketNumberService } from './ticket-number.service';
import { AuditService } from './shared/audit.service';


@ApiTags('tickets')
@ApiBearerAuth()
@Controller('/tickets')
export class TicketController {
  constructor(
    private readonly num: TicketNumberService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  async list(@Req() req: any, @Query() q: ListQueryDto) {
    return withTx(async (tx) => {
      const take = Math.min(Math.max(Number(q.limit || 50), 1), 100);

      let cursorObj: { id: string; updatedAt: Date } | undefined;
      if (q.cursor) {
        const [id, updatedAt] = Buffer.from(q.cursor, 'base64')
          .toString('utf8')
          .split('|');
        cursorObj = { id, updatedAt: new Date(updatedAt) };
      }

      const where: any = {};
      if (q.status) where.status = q.status;
      if (q.type) where.type = q.type;
      if (q.q) {
        where.OR = [
          { title: { contains: q.q, mode: 'insensitive' } },
          { description: { contains: q.q, mode: 'insensitive' } },
        ];
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

      const ticket = await tx.ticket.create({
        data: {
          number,
          title: dto.title,
          description: dto.description ?? null,
          type: dto.type,
          priority: dto.priority,
          requestedBy: dto.requestedBy ?? null,
          requestedByUser: user?.sub ?? null,
          categoryId: dto.categoryId ?? null,
          subcategoryId: dto.subcategoryId ?? null,
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

  @Patch(':id/status')
  @Roles('operator', 'admin') // Only operators and admins can change status
  async patchStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: PatchStatusDto,
  ) {
    return withTx(async (tx) => {
      const t = await tx.ticket.update({
        where: { id },
        data: { status: dto.status },
      });

      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: id,
        action: 'status',
        actorId: req.user?.sub,
        metadata: { status: dto.status },
      });

      return t;
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
          authorName: dto.authorName ?? null,
          body: dto.body,
        },
      });

      await this.audit.log(tx, {
        entity: 'ticket',
        entityId: id,
        action: 'comment',
        actorId: user?.sub,
      });

      return c;
    });
  }
}
