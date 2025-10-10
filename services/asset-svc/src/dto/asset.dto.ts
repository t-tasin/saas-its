/**
 * DTOs for asset-svc
 * Purpose: validate request payloads and drive Swagger schemas.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsNumber, IsDateString, Length, MaxLength, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssetDto {
  // Mandatory fields
  @ApiProperty({ description: 'Unique asset identifier (e.g., LAP-2024-001)' })
  @IsString() @Length(1, 64)
  assetId!: string;

  @ApiProperty({ description: 'Asset type (e.g., Laptop, Monitor)' })
  @IsString() @MaxLength(100)
  type!: string;

  @ApiProperty({ description: 'Detailed description of the asset' })
  @IsString() @MaxLength(500)
  description!: string;

  @ApiProperty({ description: 'Funding department' })
  @IsString() @MaxLength(200)
  fundingDepartment!: string;

  // Hardware details
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  manufacturer?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  model?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  modelGeneration?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  serialNumber?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  vendor?: string;

  // Technical specifications
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)
  memory?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)
  hddSize?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)
  hddType?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)
  cpuGeneration?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)
  cpuSpeed?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  gpuModel?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  videoCard?: string;

  // Network specifications
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(17)
  wiredMac?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(17)
  wirelessMac?: string;

  // Display outputs
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)
  output1?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)
  output2?: string;

  // Procurement information
  @ApiPropertyOptional() @IsOptional() @IsDateString()
  receivedDate?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  cost?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  po?: string;

  // Disposal information
  @ApiPropertyOptional() @IsOptional() @IsDateString()
  disposalDate?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  disposalType?: string;

  // Location and status
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200)
  location?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  status?: string;

  // Backward compatibility
  @ApiPropertyOptional({ description: 'Asset Type UUID (optional)' })
  @IsOptional() @IsUUID()
  assetTypeId?: string;
}

export class UpdateAssetDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500)
  description?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200)
  fundingDepartment?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  manufacturer?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  model?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  serialNumber?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)
  memory?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50)
  hddSize?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200)
  location?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  status?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  cost?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  po?: string;
}

export class AssignDto {
  @ApiProperty({ description: 'User ID to assign the asset to' })
  @IsString() // Changed from @IsUUID to support any string user ID
  userId!: string;
}

export class ListAssetsQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  q?: string; // Search in assetId or description

  @ApiPropertyOptional() @IsOptional() @IsString()
  type?: string; // Filter by asset type

  @ApiPropertyOptional() @IsOptional() @IsString()
  status?: string; // Filter by status

  @ApiPropertyOptional() @IsOptional() @IsString()
  cursor?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number;
}
