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

  @ApiProperty({ description: 'Type of equipment to reserve (e.g., Laptop, Projector)' })
  @IsString()
  @MaxLength(100)
  equipmentType!: string;

  @ApiProperty({ description: 'Quantity needed', default: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ description: 'Purpose of reservation' })
  @IsString()
  @MaxLength(500)
  purpose!: string;

  @ApiProperty({ description: 'When user wants to pick up equipment', example: '2025-10-15T10:00:00Z' })
  @IsDateString()
  requestDate!: string;

  @ApiProperty({ description: 'Expected return date (max 14 days from request)', example: '2025-10-20T17:00:00Z' })
  @IsDateString()
  returnDate!: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class ApproveReservationDto {
  @ApiProperty({ description: 'Asset IDs to assign (comma-separated or array)', type: [String] })
  @IsArray()
  @IsString({ each: true })
  assetIds!: string[];

  @ApiPropertyOptional({ description: 'Notes from approver' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

export class CancelReservationDto {
  @ApiProperty({ description: 'Reason for cancellation' })
  @IsString()
  @MaxLength(500)
  reason!: string;
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

