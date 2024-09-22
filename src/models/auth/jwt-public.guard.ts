import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import authConfig from './auth';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (token) {
      try {
        const user = this.jwtService.verify(token.replace('Bearer ', ''), {
          secret: authConfig.jwt.secret,
        });
        request.user = {
          id: user.sub.id,
          name: user.username,
          role: user.sub.role,
        };
      } catch (error) {}
    }

    return true;
  }
}
