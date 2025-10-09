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
  RequestOTPDto, VerifyOTPDto
} from './dto/user.dto';
import { generateToken, generateRefreshToken } from './jwt.util';
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
   */
  @Public()
  @Post('/auth/register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.userService.register(dto);
    const token = generateToken(user);
    const refreshToken = generateRefreshToken();

    return {
      user,
      token,
      refreshToken,
    };
  }

  /**
   * Login (public)
   */
  @Public()
  @Post('/auth/login')
  async login(@Body() dto: LoginDto) {
    const user = await this.userService.login(dto);
    const token = generateToken(user);
    const refreshToken = generateRefreshToken();

    return {
      user,
      token,
      refreshToken,
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
  @Post('/auth/otp/request')
  async requestOTP(@Body() dto: RequestOTPDto) {
    return this.otpService.requestOTP(this.prisma, dto.email);
  }

  /**
   * Verify OTP and login (passwordless auth)
   */
  @Public()
  @Post('/auth/otp/verify')
  async verifyOTP(@Body() dto: VerifyOTPDto) {
    const user = await this.otpService.verifyOTP(this.prisma, dto.email, dto.code);
    const token = generateToken(user);
    const refreshToken = generateRefreshToken();

    return {
      user,
      token,
      refreshToken,
    };
  }

  /**
   * List all users (admin only)
   */
  @ApiBearerAuth()
  @Roles('admin')
  @Get('/users')
  async listUsers(@Query('role') role?: string, @Query('isActive') isActive?: string) {
    return this.userService.listUsers({
      role,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
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
}
