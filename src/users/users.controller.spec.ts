/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { CanActivate } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserOwnershipGuard } from './guards/user-ownership.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let module: TestingModule;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    create: jest.fn((dto) => Promise.resolve({ id: 'test-id', ...dto })),
    findAll: jest.fn(() => Promise.resolve([mockUser])),
    findOne: jest.fn(() => Promise.resolve(mockUser)),
    update: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn(() => Promise.resolve(undefined)),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(UserOwnershipGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'StrongP@ssw0rd',
      };

      const result = await controller.create(createUserDto);
      expect(result).toEqual({
        id: expect.any(String),
        ...createUserDto,
      });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users when authenticated', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user when authenticated', async () => {
      const result = await controller.findOne(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('update', () => {
    let jwtGuard: CanActivate & { canActivate: jest.Mock };
    let ownershipGuard: CanActivate & { canActivate: jest.Mock };

    beforeEach(() => {
      jwtGuard = module.get<CanActivate & { canActivate: jest.Mock }>(
        JwtAuthGuard,
      );
      ownershipGuard = module.get<CanActivate & { canActivate: jest.Mock }>(
        UserOwnershipGuard,
      );
    });

    it('should update a user when authenticated and owner', async () => {
      jwtGuard.canActivate.mockReturnValue(true);
      ownershipGuard.canActivate.mockReturnValue(true);

      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
      };
      const result = await controller.update(mockUser.id, updateUserDto);

      expect(service.update).toHaveBeenCalledWith(mockUser.id, updateUserDto);
      expect(result).toEqual({ id: mockUser.id, ...updateUserDto });
    });
  });

  describe('remove', () => {
    let jwtGuard: CanActivate & { canActivate: jest.Mock };
    let ownershipGuard: CanActivate & { canActivate: jest.Mock };

    beforeEach(() => {
      jwtGuard = module.get<CanActivate & { canActivate: jest.Mock }>(
        JwtAuthGuard,
      );
      ownershipGuard = module.get<CanActivate & { canActivate: jest.Mock }>(
        UserOwnershipGuard,
      );
    });

    it('should remove a user when authenticated and owner', async () => {
      jwtGuard.canActivate.mockReturnValue(true);
      ownershipGuard.canActivate.mockReturnValue(true);

      await controller.remove(mockUser.id);
      expect(service.remove).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
