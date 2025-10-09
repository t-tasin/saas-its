/**
 * DTOs for asset-svc
 * Purpose: validate request payloads and drive Swagger schemas.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length, MaxLength } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty() @IsString() @Length(1, 64)
  assetTag!: string;

  @ApiProperty({ description: 'Asset Type UUID' }) @IsUUID()
  assetTypeId!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200)
  summary?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(120)
  location?: string;
}

export class AssignDto {
  @ApiProperty({ description: 'User ID to assign the asset to' }) @IsUUID()
  personId!: string;
}

export class ListAssetsQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  q?: string; // tag or summary

  @ApiPropertyOptional() @IsOptional() @IsString()
  cursor?: string;

  @ApiPropertyOptional() @IsOptional()
  limit?: number;
}
