import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '../generated/client';
import { EmailService } from './email.service';

@Injectable()
export class OTPService {
  constructor(private readonly email: EmailService) {}

  /**
   * Generate a 6-digit OTP code
   */
  private generateOTPCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Request an OTP for a user (for login or registration)
   */
  async requestOTP(prisma: PrismaClient, email: string): Promise<{ message: string }> {
    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user with OTP-only authentication (no password)
      user = await prisma.user.create({
        data: {
          email,
          password: null,  // OTP users don't have passwords
          role: 'general',
          isActive: true,
        },
      });

      // Send welcome email
      await this.email.sendWelcomeEmail(email, user.name || '');
    }

    // Check if there's a recent unexpired OTP
    const recentOTP = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() },
        createdAt: { gt: new Date(Date.now() - 60000) }, // Created within last minute
      },
    });

    if (recentOTP) {
      throw new BadRequestException('Please wait before requesting another OTP');
    }

    // Generate new OTP
    const otpCode = this.generateOTPCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save OTP to database
    await prisma.oTP.create({
      data: {
        userId: user.id,
        code: otpCode,
        expiresAt,
        used: false,
      },
    });

    // Send OTP via email
    await this.email.sendOTP(email, otpCode);

    return {
      message: 'OTP sent to your email',
    };
  }

  /**
   * Verify OTP and return user
   */
  async verifyOTP(prisma: PrismaClient, email: string, code: string) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or OTP');
    }

    // Find valid OTP
    const otp = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: otp.id },
      data: { used: true },
    });

    // Mark user as active
    if (!user.isActive) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isActive: true },
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    };
  }

  /**
   * Clean up expired OTPs (can be called periodically)
   */
  async cleanupExpiredOTPs(prisma: PrismaClient): Promise<number> {
    const result = await prisma.oTP.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { used: true, createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Delete used OTPs older than 24h
        ],
      },
    });

    return result.count;
  }
}

