import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
    internalConfig: {},
    isCacheEnabled: false,
    skipProcessEnv: false,
    cache: new Map(),
    getOrThrow: jest.fn(),
    validate: jest.fn(),
    validationSchema: null,
    validationOptions: {},
  } as unknown as ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the payload if valid', () => {
      const payload = {
        sub: '1',
        username: 'johndoe',
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        id: payload.sub,
        username: payload.username,
      });
    });
  });

  describe('constructor', () => {
    it('should throw error if JWT_SECRET is not defined', () => {
      mockConfigService.get = jest.fn().mockReturnValue(undefined);

      expect(() => {
        new JwtStrategy(mockConfigService);
      }).toThrow('JWT_SECRET is not defined');
    });
  });
});
