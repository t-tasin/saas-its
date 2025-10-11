import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

// Create mock functions that will be used in the mock
const mockUserFindUnique = jest.fn();
const mockUserCreate = jest.fn();
const mockUserUpdate = jest.fn();
const mockUserFindMany = jest.fn();
const mockUserCount = jest.fn();

// Mock Prisma Client - must be before imports that use it
jest.mock('../generated/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: mockUserFindUnique,
        create: mockUserCreate,
        update: mockUserUpdate,
        findMany: mockUserFindMany,
        count: mockUserCount,
      },
    })),
  };
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };

      mockUserFindUnique.mockResolvedValue(null);
      mockUserCreate.mockResolvedValue({
        id: '1',
        email: registerDto.email,
        password: 'hashed_password',
        name: registerDto.name,
        role: 'general',
        isActive: true,
        createdAt: new Date(),
      });

      const result = await service.register(registerDto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(registerDto.email);
      expect(result.role).toBe('general');
      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Existing User',
      };

      mockUserFindUnique.mockResolvedValue({
        id: '1',
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      mockUserFindUnique.mockResolvedValue({
        id: '1',
        email: loginDto.email,
        password: hashedPassword,
        role: 'general',
        isActive: true,
        name: 'Test User',
        createdAt: new Date(),
      });

      const result = await service.login(loginDto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(loginDto.email);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUserFindUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nonexistent@example.com', password: 'password' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      mockUserFindUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password',
        isActive: false,
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'password' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      mockUserFindUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        isActive: true,
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong_password' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findById', () => {
    it('should return user without password', async () => {
      const userId = '1';
      mockUserFindUnique.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        password: 'hashed_password',
        name: 'Test User',
        role: 'general',
        isActive: true,
        createdAt: new Date(),
      });

      const result = await service.findById(userId);

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(userId);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      mockUserFindUnique.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const userId = '1';
      const updateDto = { name: 'Updated Name' };

      mockUserUpdate.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        password: 'hashed_password',
        name: updateDto.name,
        role: 'general',
        isActive: true,
        createdAt: new Date(),
      });

      const result = await service.updateProfile(userId, updateDto);

      expect(result).not.toHaveProperty('password');
      expect(result.name).toBe(updateDto.name);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = '1';
      const changePasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };

      const hashedOldPassword = await bcrypt.hash(changePasswordDto.currentPassword, 10);
      mockUserFindUnique.mockResolvedValue({
        id: userId,
        password: hashedOldPassword,
      });
      mockUserUpdate.mockResolvedValue({});

      const result = await service.changePassword(userId, changePasswordDto);

      expect(result.message).toBe('Password changed successfully');
      expect(mockUserUpdate).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for incorrect current password', async () => {
      const userId = '1';
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      mockUserFindUnique.mockResolvedValue({
        id: userId,
        password: hashedPassword,
      });

      await expect(
        service.changePassword(userId, {
          currentPassword: 'wrong_password',
          newPassword: 'NewPassword123!',
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('listUsers', () => {
    it('should return paginated users list', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', password: 'hash1', role: 'general', isActive: true, createdAt: new Date() },
        { id: '2', email: 'user2@example.com', password: 'hash2', role: 'operator', isActive: true, createdAt: new Date() },
      ];

      mockUserCount.mockResolvedValue(2);
      mockUserFindMany.mockResolvedValue(mockUsers);

      const result = await service.listUsers({ page: 1, limit: 10 });

      expect(result.users).toHaveLength(2);
      expect(result.users[0]).not.toHaveProperty('password');
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should filter users by role', async () => {
      mockUserCount.mockResolvedValue(1);
      mockUserFindMany.mockResolvedValue([
        { id: '1', email: 'admin@example.com', password: 'hash', role: 'admin', isActive: true, createdAt: new Date() },
      ]);

      const result = await service.listUsers({ role: 'admin' });

      expect(mockUserFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ role: 'admin' }),
        })
      );
    });
  });
});

