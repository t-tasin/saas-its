/**
 * DTOs for Ticket endpoints with validation and OpenAPI tags.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, Length, MaxLength, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum TicketStatus { open='open', in_progress='in_progress', resolved='resolved', closed='closed' }
export enum TicketType   { incident='incident', request='request' }
export enum TicketPriority { low='low', medium='medium', high='high', urgent='urgent' }

export class CreateTicketDto {
  @ApiProperty() @IsString() @Length(3, 120)
  title!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: TicketType, default: TicketType.incident }) 
  @IsOptional() @IsEnum(TicketType)
  type?: TicketType;

  @ApiPropertyOptional({ enum: TicketPriority, default: TicketPriority.medium }) 
  @IsOptional() @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({ description: 'Email or name of requester (for unauthenticated users)' })
  @IsOptional() @IsString() @MaxLength(200)
  requestedBy?: string;

  @ApiPropertyOptional({ description: 'Name of the requester' })
  @IsOptional() @IsString() @MaxLength(200)
  requesterName?: string;

  @ApiPropertyOptional({ description: 'Email of the requester' })
  @IsOptional() @IsString() @MaxLength(200)
  requesterEmail?: string;

  @ApiPropertyOptional({ description: 'Category UUID' })
  @IsOptional() @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'SubCategory UUID' })
  @IsOptional() @IsUUID()
  subcategoryId?: string;

  @ApiPropertyOptional({ description: 'Asset UUID to associate with this ticket' })
  @IsOptional() @IsUUID()
  assetId?: string;
}

export class PatchStatusDto {
  @ApiProperty({ enum: TicketStatus }) @IsEnum(TicketStatus)
  status!: TicketStatus;
}

export class UpdateTicketDto {
  @ApiPropertyOptional({ description: 'Asset UUID to associate with this ticket (null to remove)' })
  @IsOptional() @IsUUID()
  assetId?: string | null;

  @ApiPropertyOptional({ description: 'Ticket title' })
  @IsOptional() @IsString() @Length(3, 120)
  title?: string;

  @ApiPropertyOptional({ description: 'Ticket description' })
  @IsOptional() @IsString() @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: TicketPriority })
  @IsOptional() @IsEnum(TicketPriority)
  priority?: TicketPriority;
}

export class CreateCommentDto {
  @ApiPropertyOptional({ description: 'Name for unauthenticated comments' })
  @IsOptional() @IsString() @MaxLength(100)
  authorName?: string;

  @ApiProperty() @IsString() @Length(1, 2000)
  body!: string;
}

export class ListQueryDto {
  @ApiPropertyOptional({ enum: TicketStatus }) @IsOptional() @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: TicketType }) @IsOptional() @IsEnum(TicketType)
  type?: TicketType;

  @ApiPropertyOptional() @IsOptional() @IsString()
  q?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  cursor?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by assignee: "me" for current user, or specific userId' })
  @IsOptional() @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Filter by asset ID' })
  @IsOptional() @IsUUID()
  assetId?: string;

  @ApiPropertyOptional({ description: 'Include closed tickets (default: false)' })
  @IsOptional()
  includeClosed?: boolean;
}
