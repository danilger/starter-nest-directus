import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';


/** Проверяет access_token на валидность */
@Injectable()
export class JWTguard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_SAME_AS_IN_DIRECTUS);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
