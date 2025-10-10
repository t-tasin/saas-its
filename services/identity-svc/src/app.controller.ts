import { 
  Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, ParseUUIDPipe 
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { OTPService } from './otp.service';
import { Public } from './auth/public.decorator';
import { Roles } from './auth/roles.decorator';
import { 
  RegisterDto, LoginDto, UpdateUserDto, ChangePasswordDto, CreateUserDto,
  RequestOTPDto, VerifyOTPDto, UserRole
} from './dto/user.dto';
import { generateToken, generateRefreshToken, generateTempToken, verifyTempToken } from './jwt.util';
import { PrismaClient } from '../generated/client';

@ApiTags('auth')
@Controller()
export class AppController {
  private readonly prisma = new PrismaClient();

  constructor(
    private readonly userService: UserService,
    private readonly otpService: OTPService,
  ) {}

  /**
   * Register a new user (public - for general users self-registration)
   * Creates user and sends OTP for verification
   */
  @Public()
  @Post('/auth/register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.userService.register(dto);
    
    // Generate and send OTP
    const otpResponse = await this.otpService.requestOTPForUser(this.prisma, user.id);

    return {
      success: true,
      message: 'User registered successfully. Please verify OTP.',
      userId: user.id,
    };
  }

  /**
   * Login for operators/admins (public)
   * Validates password and sends OTP for two-factor authentication
   */
  @Public()
  @Post('/auth/login')
  async login(@Body() dto: LoginDto) {
    // Validate credentials
    const user = await this.userService.login(dto);
    
    // Generate and send OTP
    const otpResponse = await this.otpService.requestOTPForUser(this.prisma, user.id);
    
    // Generate temporary token for OTP verification
    const tempToken = generateTempToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      message: 'OTP sent to email',
      tempToken,
      expiresIn: otpResponse.expiresIn,
    };
  }

  /**
   * Get current user profile (requires authentication)
   */
  @ApiBearerAuth()
  @Get('/auth/me')
  async getProfile(@Req() req: any) {
    const userId = req.user?.sub;
    if (!userId) {
      return { user: null };
    }
    return this.userService.findById(userId);
  }

  /**
   * Update current user profile
   */
  @ApiBearerAuth()
  @Patch('/auth/me')
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    const userId = req.user?.sub;
    return this.userService.updateProfile(userId, dto);
  }

  /**
   * Change password
   */
  @ApiBearerAuth()
  @Post('/auth/change-password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const userId = req.user?.sub;
    return this.userService.changePassword(userId, dto);
  }

  /**
   * Request OTP (passwordless auth for general users)
   */
  @Public()
  @Post('/auth/request-otp')
  async requestOTP(@Body() dto: RequestOTPDto) {
    return this.otpService.requestOTP(this.prisma, dto.email);
  }

  /**
   * Verify OTP and login
   * Supports both passwordless auth (general users) and two-factor auth (operators/admins with tempToken)
   */
  @Public()
  @Post('/auth/verify-otp')
  async verifyOTP(@Body() dto: VerifyOTPDto) {
    let email = dto.email;
    
    // If tempToken provided, verify it first (for operator/admin two-factor auth)
    if (dto.tempToken) {
      const decoded = verifyTempToken(dto.tempToken);
      if (!decoded) {
        throw new Error('Invalid or expired temporary token');
      }
      email = decoded.email;
    }
    
    // Verify OTP
    const user = await this.otpService.verifyOTP(this.prisma, email, dto.otp);
    
    // Generate final JWT token
    const token = generateToken(user);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * List all users (admin only) with pagination
   */
  @ApiBearerAuth()
  @Roles('admin')
  @Get('/users')
  async listUsers(
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.userService.listUsers({
      role,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  /**
   * Create a new user (admin only - for creating operators/admins)
   */
  @ApiBearerAuth()
  @Roles('admin')
  @Post('/users')
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  /**
   * Get user by ID (admin only)
   */
  @ApiBearerAuth()
  @Roles('admin')
  @Get('/users/:id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }

  /**
   * Update user (admin only)
   */
  @ApiBearerAuth()
  @Roles('admin')
  @Patch('/users/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(id, dto);
  }

  /**
   * Deactivate user (admin only)
   */
  @ApiBearerAuth()
  @Roles('admin')
  @Delete('/users/:id')
  async deactivateUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deactivateUser(id);
  }

  /**
   * Update user role (admin only)
   */
  @ApiBearerAuth()
  @Roles('admin')
  @Patch('/users/:userId/role')
  async updateUserRole(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: { role: UserRole },
  ) {
    await this.userService.updateProfile(userId, { role: body.role });
    return {
      success: true,
      message: 'User role updated successfully',
    };
  }
}
