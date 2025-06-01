import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserOwnershipGuard } from './user-ownership.guard';

describe('UserOwnershipGuard', () => {
  let guard: UserOwnershipGuard;

  beforeEach(() => {
    guard = new UserOwnershipGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when user is owner', () => {
    const userId = '123';
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: userId },
          params: { id: userId },
        }),
      }),
    } as ExecutionContext;

    expect(guard.canActivate(mockContext)).toBeTruthy();
  });

  it('should deny access when user is not owner', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: '123' },
          params: { id: '456' },
        }),
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  it('should deny access when user is not authenticated', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { id: '123' },
        }),
      }),
    } as ExecutionContext;

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });
});
