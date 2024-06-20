import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RefreshTokensEntity } from './entities/refresh-tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshTokensEntity)
    private readonly tokenRepository: Repository<RefreshTokensEntity>,
  ) {}

  async registration(
    userDto: CreateUserDto,
    agent: string,
  ): Promise<{ accessToken: string; refreshToken: RefreshTokensEntity }> {
    if (await this.userService.getUserByEmail(userDto.email)) {
      throw new UnauthorizedException({
        message: 'User with such email already exists',
      });
    }
    const hashPassword = await this.getHashPassword(userDto.password);
    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });
    return this.generateTokens(user, agent);
  }

  async login(
    userDto: LoginUserDto,
    agent: string,
  ): Promise<{ accessToken: string; refreshToken: RefreshTokensEntity }> {
    const user = await this.validateUser(userDto);
    return this.generateTokens(user, agent);
  }

  private async getHashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 5);
  }

  private async validateUser(userDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }

  private async generateTokens(
    user: UserEntity,
    agent: string,
  ): Promise<{ accessToken: string; refreshToken: RefreshTokensEntity }> {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      username: user.name,
    });
    const refreshToken = await this.generateRefreshToken(user, agent);
    return { accessToken, refreshToken };
  }

  private async generateRefreshToken(
    user: UserEntity,
    agent: string,
  ): Promise<RefreshTokensEntity> {
    const token = v4();
    await this.tokenRepository.upsert(
      {
        token: token,
        exp: add(new Date(), { months: 1 }).toString(),
        user_agent: agent,
        user: user,
      },
      ['user_agent', 'user'],
    );
    return await this.tokenRepository.findOne({ where: { token: token } });
  }
}
