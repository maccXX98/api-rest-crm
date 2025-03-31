import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByLogin: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user tokens and info when credentials are valid', async () => {
      // Arrange
      const mockUser = {
        UserID: 1,
        Username: 'testuser',
        Password: 'hashedPassword',
        FirstName: 'Test',
        Photo: Buffer.from('test-photo'),
        Role: 'admin',
      };

      mockUsersService.findByLogin.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockJwtService.signAsync.mockImplementation((payload, options) => {
        if (options.expiresIn === '1h') {
          return Promise.resolve('access-token-value');
        } else {
          return Promise.resolve('refresh-token-value');
        }
      });

      // Act
      const result = await service.validateUser('testuser', 'password123');

      // Assert
      expect(usersService.findByLogin).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedPassword',
      );
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        access_token: 'access-token-value',
        refresh_token: 'refresh-token-value',
        firstname: 'Test',
        photo: Buffer.from('test-photo'),
        role: 'admin',
      });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      mockUsersService.findByLogin.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.validateUser('nonexistent', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      const mockUser = {
        UserID: 1,
        Username: 'testuser',
        Password: 'hashedPassword',
      };

      mockUsersService.findByLogin.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.validateUser('testuser', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateRefreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      // Arrange
      const mockUser = {
        UserID: 1,
        Username: 'testuser',
      };

      mockJwtService.signAsync.mockImplementation((payload, options) => {
        if (options.expiresIn === '1h') {
          return Promise.resolve('new-access-token');
        } else {
          return Promise.resolve('new-refresh-token');
        }
      });

      // Act
      const result = await service.validateRefreshToken(mockUser as any);

      // Assert
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      });
    });
  });
});
