import { Body, Controller, Request, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshTokensEntity } from './entities/refresh-tokens.entity';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  registration(
    @Body() userDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: RefreshTokensEntity }> {
    const agent = req.headers['user-agent'];
    return this.authService.registration(userDto, agent);
  }

  @Post('login')
  login(
    @Body() userDto: LoginUserDto,
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: RefreshTokensEntity }> {
    const agent = req.headers['user-agent'];
    return this.authService.login(userDto, agent);
  }
}
