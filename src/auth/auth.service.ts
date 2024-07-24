import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
    const payload = { sub: user.UserID, username: user.Username };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET_TOKEN,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '180d',
        secret: process.env.JWT_REFRESH_TOKEN,
      }),
      firstname: user.FirstName,
      photo: user.Photo,
      role: user.Role,
    };
  }

  async validateRefreshToken(user: User) {
    const payload = { sub: user.UserID, username: user.Username };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET_TOKEN,
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '180d',
        secret: process.env.JWT_REFRESH_TOKEN,
      }),
    };
  }
}
