import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfig {
  constructor(private configService: ConfigService) {}

  get jwtSecretToken(): string {
    const secret = this.configService.get<string>('JWT_SECRET_TOKEN');
    if (!secret) {
      throw new Error('JWT_SECRET_TOKEN environment variable is not defined');
    }
    return secret;
  }

  get jwtRefreshToken(): string {
    const secret = this.configService.get<string>('JWT_REFRESH_TOKEN');
    if (!secret) {
      throw new Error('JWT_REFRESH_TOKEN environment variable is not defined');
    }
    return secret;
  }
}
