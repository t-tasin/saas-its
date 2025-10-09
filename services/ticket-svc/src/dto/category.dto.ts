/**
 * DTOs for Category and SubCategory endpoints
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, Length, MaxLength, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Hardware Issues' })
  @IsString()
  @Length(1, 100)
  name!: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Hardware Problems' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;
}

export class CreateSubCategoryDto {
  @ApiProperty({ example: 'Laptop' })
  @IsString()
  @Length(1, 100)
  name!: string;
}

export class UpdateSubCategoryDto {
  @ApiPropertyOptional({ example: 'Desktop Computer' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;
}

