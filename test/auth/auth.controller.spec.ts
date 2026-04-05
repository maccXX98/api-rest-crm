import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    validateRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [{ ttl: 60, limit: 10 }],
        }),
      ],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call validateUser with correct credentials', async () => {
      // Arrange
      const loginDto: LoginDto = { login: 'testuser', password: 'password123' };
      const expectedResult = {
        access_token: 'test-token',
        refresh_token: 'refresh-token',
      };
      mockAuthService.validateUser.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.login,
        loginDto.password,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refreshToken', () => {
    it('should call validateRefreshToken with refresh token from body', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const expectedResult = {
        access_token: 'new-token',
        refresh_token: 'new-refresh-token',
      };
      mockAuthService.validateRefreshToken.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.refreshToken(refreshToken);

      // Assert
      expect(authService.validateRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
