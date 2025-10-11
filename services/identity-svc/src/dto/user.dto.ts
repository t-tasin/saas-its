/**
 * DTOs for Identity/User endpoints with validation and OpenAPI tags.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';

export enum UserRole {
  general = 'general',
  operator = 'operator',
  admin = 'admin',
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ example: 'general', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password!: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword!: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'operator@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @ApiProperty({ example: 'John Operator' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @ApiProperty({ enum: UserRole, default: UserRole.operator })
  @IsEnum(UserRole)
  role!: UserRole;
}

// OTP Authentication DTOs
export class RequestOTPDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email address to send OTP to' })
  @IsEmail()
  email!: string;
}

export class VerifyOTPDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp!: string;

  @ApiPropertyOptional({ description: 'Temporary token for operator/admin two-factor auth' })
  @IsOptional()
  @IsString()
  tempToken?: string;
}

// Response DTOs
export class OTPResponseDto {
  success!: boolean;
  message!: string;
  expiresIn!: number;
}

export class LoginResponseDto {
  success!: boolean;
  message!: string;
  tempToken!: string;
  expiresIn!: number;
}

export class VerifyOTPResponseDto {
  success!: boolean;
  token!: string;
  user!: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: Date;
  };
}

export class RegisterResponseDto {
  success!: boolean;
  message!: string;
  userId!: string;
}

