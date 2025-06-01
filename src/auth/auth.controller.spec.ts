import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: '1',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  };

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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
    it('should return JWT token when user logs in', async () => {
      const mockToken = { access_token: 'jwt-token' };
      mockAuthService.login.mockResolvedValue(mockToken);

      const req = { user: mockUser };
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const result = await controller.login(req);

      expect(result).toEqual(mockToken);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
