import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { id: string } }>();

    if (!request.user) {
      throw new ForbiddenException('User is not authenticated');
    }

    const requestedUserId = request.params.id;

    if (request.user.id !== requestedUserId) {
      throw new ForbiddenException('You can only modify your own user data');
    }

    return true;
  }
}
