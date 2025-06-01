import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    username: 'johndoe',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if validation is successful', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await service.validateUser('johndoe', 'password123');
      const { password: _, ...expectedUser } = mockUser; // eslint-disable-line @typescript-eslint/no-unused-vars

      expect(result).toEqual(expectedUser);
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('johndoe');
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');
      expect(result).toBeNull();
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(
        'nonexistent',
      );
    });

    it('should return null if password is invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await service.validateUser('johndoe', 'wrongpassword');

      expect(result).toBeNull();
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('johndoe');
    });
  });

  describe('login', () => {
    it('should return JWT token when login is successful', async () => {
      const mockToken = 'jwt-token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const { password: _, ...userData } = mockUser; // eslint-disable-line @typescript-eslint/no-unused-vars
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const result = await service.login(userData);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userData.id,
        username: userData.username,
      });
    });
  });
});
