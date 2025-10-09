/**
 * DTOs for Reservation endpoints
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, IsInt, Min, MaxLength, IsDateString, IsEmail, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReservationStatus {
  pending = 'pending',
  approved = 'approved',
  denied = 'denied',
  active = 'active',
  returned = 'returned',
  cancelled = 'cancelled',
}

export class ReservationItemDto {
  @ApiProperty({ description: 'Asset Type ID (from asset service)' })
  @IsUUID()
  assetTypeId!: string;

  @ApiProperty({ description: 'Asset Type Name' })
  @IsString()
  @MaxLength(100)
  assetTypeName!: string;

  @ApiPropertyOptional({ description: 'Quantity needed', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ description: 'Notes for this item' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class CreateReservationDto {
  @ApiPropertyOptional({ description: 'Requester email (for unauthenticated)' })
  @IsOptional()
  @IsEmail()
  requesterEmail?: string;

  @ApiPropertyOptional({ description: 'Requester name (for unauthenticated)' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  requesterName?: string;

  @ApiProperty({ description: 'When user wants to pick up equipment', example: '2025-10-15T10:00:00Z' })
  @IsDateString()
  requestDate!: string;

  @ApiProperty({ description: 'Expected return date', example: '2025-10-20T17:00:00Z' })
  @IsDateString()
  returnDate!: string;

  @ApiProperty({ description: 'Items to reserve', type: [ReservationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReservationItemDto)
  items!: ReservationItemDto[];

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class ApproveReservationDto {
  @ApiProperty({ description: 'Asset IDs to assign to reservation items (in order)', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  assetIds!: string[];

  @ApiPropertyOptional({ description: 'Notes from approver' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class DenyReservationDto {
  @ApiProperty({ description: 'Reason for denial' })
  @IsString()
  @MaxLength(500)
  reason!: string;
}

export class ReturnReservationDto {
  @ApiPropertyOptional({ description: 'Notes about the return' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class ListReservationsQueryDto {
  @ApiPropertyOptional({ enum: ReservationStatus })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({ description: 'Filter by requester ID' })
  @IsOptional()
  @IsUUID()
  requesterId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;
}

