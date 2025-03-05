import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request } from 'express';
import { MembersService } from '../entities/members/members.service';
import { authCookie } from './config';
import { TokenService } from '../helpers/token.service';
import { JwtPayload } from './auth.service';

export interface RequisicaoAutenticada extends Request {
  member: AuthenticatedCredential | null;
}

export interface AuthenticatedCredential {
  id: number | null;
  level: number | null;
  name: string | null;
  email: string | null;
  status: HttpStatus | null;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private membersService: MembersService,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const credentials = await this.getCredentials(request);

    if (credentials === null) {
      throw new UnauthorizedException();
    }

    // Permite que as rotas acessem o usuário logado
    (request as RequisicaoAutenticada).member = credentials;

    return true;
  }

  async getCredentials(
    request: Request,
  ): Promise<AuthenticatedCredential | null> {
    const token = this.getToken(request);

    if (
      token === null ||
      token === undefined ||
      token.length < 150 ||
      this.tokenService.isTokenInvalid(token)
    ) {
      return null;
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      if (
        payload &&
        typeof payload === 'object' &&
        Number.isInteger(payload.exp)
      ) {
        const expirationDate = new Date(payload.exp * 1000); // Convert seconds to milliseconds
        if (expirationDate < new Date()) {
          return {
            id: null,
            level: null,
            name: null,
            email: null,
            status: HttpStatus.UNAUTHORIZED, // 401
          };
        }
      } else {
        return {
          id: null,
          level: null,
          name: null,
          email: null,
          status: HttpStatus.NOT_ACCEPTABLE, // 406
        };
      }
      const member = await this.membersService.getMemberById(
        payload.sub as number,
      );

      if (member) {
        return {
          id: member.id, //  member
          level: payload.user as number, //level do member ou member
          name: member.name,
          email: member.email,
          status: HttpStatus.OK, // 200
        };
      } else {
        return {
          id: null,
          level: null,
          name: null,
          email: null,
          status: HttpStatus.NOT_FOUND, // 404
        };
      }
    } catch (error) {
      const currentDate = new Date();
      console.log(`Token expiration date: ${error.expiredAt}`);
      console.log(`Current server date: ${currentDate}`);

      if (error instanceof TokenExpiredError) {
        return {
          id: null,
          level: null,
          name: null,
          email: null,
          status: HttpStatus.UNAUTHORIZED, // 401
        };
      }
      console.log(error);
      return {
        id: null,
        level: null,
        name: null,
        email: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR, // 500
      };
    }
  }

  private getToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return request.cookies[authCookie];
  }
}
