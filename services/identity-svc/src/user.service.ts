/**
 * UserService - Handles user authentication and management
 */
import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '../generated/client';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, UpdateUserDto, ChangePasswordDto, CreateUserDto } from './dto/user.dto';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10;

  /**
   * Register a new user (self-registration for general users)
   */
  async register(dto: RegisterDto) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create user (always default to general role for self-registration)
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name ?? null,
        role: 'general', // Always general for public registration
      },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Login user and return user data (frontend will handle JWT generation)
   */
  async login(dto: LoginDto) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Check if user has a password (OTP users don't have passwords)
    if (!user.password) {
      throw new UnauthorizedException('This account uses OTP authentication. Please use OTP login.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user by ID
   */
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get user by email
   */
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        // Only allow role change if specified (admin can change roles)
        ...(dto.role && { role: dto.role }),
        ...(typeof dto.isActive === 'boolean' && { isActive: dto.isActive }),
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has a password (OTP users don't have passwords)
    if (!user.password) {
      throw new UnauthorizedException('This account uses OTP authentication and does not have a password to change.');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, this.SALT_ROUNDS);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * List all users (admin only)
   */
  async listUsers(filters?: { role?: string; isActive?: boolean }) {
    const users = await prisma.user.findMany({
      where: {
        ...(filters?.role && { role: filters.role as any }),
        ...(typeof filters?.isActive === 'boolean' && { isActive: filters.isActive }),
      },
      orderBy: { createdAt: 'desc' },
    });

    // Remove passwords from response
    return users.map(({ password, ...user }) => user);
  }

  /**
   * Create user (admin only - for creating operators/admins)
   */
  async createUser(dto: CreateUserDto) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name ?? null,
        role: dto.role,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Delete/deactivate user (admin only)
   */
  async deactivateUser(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return { message: 'User deactivated successfully' };
  }
}

