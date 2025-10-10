import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { OTPService } from './otp.service';
import { EmailService } from './email.service';

const mockEmailService = {
  sendOTP: jest.fn(),
};

const mockPrismaOTP = {
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  deleteMany: jest.fn(),
};

const mockPrismaUser = {
  findUnique: jest.fn(),
  update: jest.fn(),
};

const mockPrisma = {
  oTP: mockPrismaOTP,
  user: mockPrismaUser,
} as any;

describe('OTPService', () => {
  let service: OTPService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OTPService,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<OTPService>(OTPService);
    jest.clearAllMocks();
  });

  describe('requestOTP', () => {
    it('should generate and send OTP successfully', async () => {
      const email = 'test@example.com';
      mockPrismaUser.findUnique.mockResolvedValue({
        id: '1',
        email,
        isActive: true,
      });
      mockPrismaOTP.findFirst.mockResolvedValue(null); // No recent OTP
      mockPrismaOTP.create.mockResolvedValue({
        id: '1',
        userId: '1',
        code: '123456',
        expiresAt: new Date(Date.now() + 300000),
        used: false,
      });

      const result = await service.requestOTP(mockPrisma, email);

      expect(result.success).toBe(true);
      expect(result.expiresIn).toBe(300);
      expect(mockEmailService.sendOTP).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      await expect(service.requestOTP(mockPrisma, 'nonexistent@example.com')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        isActive: false,
      });

      await expect(service.requestOTP(mockPrisma, 'test@example.com')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw BadRequestException if recent OTP exists', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        isActive: true,
      });
      mockPrismaOTP.findFirst.mockResolvedValue({
        id: '1',
        userId: '1',
        code: '123456',
        expiresAt: new Date(Date.now() + 200000),
        used: false,
        createdAt: new Date(Date.now() - 30000), // 30 seconds ago
      });

      await expect(service.requestOTP(mockPrisma, 'test@example.com')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP and return user', async () => {
      const email = 'test@example.com';
      const code = '123456';

      mockPrismaUser.findUnique.mockResolvedValue({
        id: '1',
        email,
        name: 'Test User',
        role: 'general',
        isActive: true,
        createdAt: new Date(),
      });

      mockPrismaOTP.findFirst.mockResolvedValue({
        id: '1',
        userId: '1',
        code,
        expiresAt: new Date(Date.now() + 100000),
        used: false,
      });

      mockPrismaOTP.update.mockResolvedValue({});

      const result = await service.verifyOTP(mockPrisma, email, code);

      expect(result.email).toBe(email);
      expect(mockPrismaOTP.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { used: true },
      });
    });

    it('should throw UnauthorizedException for invalid OTP', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
      });
      mockPrismaOTP.findFirst.mockResolvedValue(null);

      await expect(service.verifyOTP(mockPrisma, 'test@example.com', '999999')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should activate inactive user on successful OTP verification', async () => {
      mockPrismaUser.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        isActive: false,
        role: 'general',
        createdAt: new Date(),
      });

      mockPrismaOTP.findFirst.mockResolvedValue({
        id: '1',
        userId: '1',
        code: '123456',
        expiresAt: new Date(Date.now() + 100000),
        used: false,
      });

      mockPrismaOTP.update.mockResolvedValue({});
      mockPrismaUser.update.mockResolvedValue({});

      await service.verifyOTP(mockPrisma, 'test@example.com', '123456');

      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: true },
      });
    });
  });

  describe('cleanupExpiredOTPs', () => {
    it('should delete expired OTPs', async () => {
      mockPrismaOTP.deleteMany.mockResolvedValue({ count: 5 });

      const result = await service.cleanupExpiredOTPs(mockPrisma);

      expect(result).toBe(5);
      expect(mockPrismaOTP.deleteMany).toHaveBeenCalled();
    });
  });
});

