import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { EnvConfig } from '../config/env.validation';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly envConfig: EnvConfig,
  ) {}

  async validateUser(
    login: string,
    pass: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    firstname: string;
    photo: Buffer;
    role: string;
  }> {
    const user = await this.usersService.findByLogin(login);
    if (!user || !(await bcrypt.compare(pass, user.Password))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.UserID, username: user.Username, role: user.Role };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: this.envConfig.jwtSecretToken,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.envConfig.jwtRefreshToken,
      }),
      firstname: user.FirstName,
      photo: user.Photo,
      role: user.Role,
    };
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.envConfig.jwtRefreshToken,
      });
      
      const newPayload = { sub: payload.sub, username: payload.username, role: payload.role };
      return {
        access_token: await this.jwtService.signAsync(newPayload, {
          expiresIn: '1h',
          secret: this.envConfig.jwtSecretToken,
        }),
        refresh_token: await this.jwtService.signAsync(newPayload, {
          expiresIn: '7d',
          secret: this.envConfig.jwtRefreshToken,
        }),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
