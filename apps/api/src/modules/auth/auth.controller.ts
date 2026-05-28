import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { RequestEmailVerificationDto } from './dto/request-email-verification.dto';
import { ConfirmEmailVerificationDto } from './dto/confirm-email-verification.dto';
import { UsersService } from '../users/services/users.service';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('sign-up')
  signup(@Body() body: SignupDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.signup({ ...body, request, response });
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('sign-in')
  login(@Body() body: SigninDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.login({ ...body, request, response });
  }

  @Public()
  @Post('refresh')
  refresh(
    @Body() body: RefreshTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.refresh({ ...body, request, response });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  logout(@Body() body: LogoutDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout({ ...body, request, response });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() currentUser: { id: string }) {
    return this.usersService.getCurrentUser(currentUser.id);
  }

  @Public()
  @Post('password-reset/request')
  requestPasswordReset(@Body() body: RequestPasswordResetDto, @Req() request: Request) {
    return this.authService.requestPasswordReset({ email: body.email, request });
  }

  @Public()
  @Post('password-reset/confirm')
  confirmPasswordReset(@Body() body: ConfirmPasswordResetDto, @Req() request: Request) {
    return this.authService.confirmPasswordReset({ ...body, request });
  }

  @Public()
  @Post('email-verification/request')
  requestEmailVerification(@Body() body: RequestEmailVerificationDto, @Req() request: Request) {
    return this.authService.requestEmailVerification({ email: body.email, request });
  }

  @Public()
  @Post('email-verification/confirm')
  confirmEmailVerification(@Body() body: ConfirmEmailVerificationDto, @Req() request: Request) {
    return this.authService.confirmEmailVerification({ ...body, request });
  }
}
