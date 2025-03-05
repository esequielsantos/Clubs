import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidadorHttp } from 'src/helpers/ValidadorHttp';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { getOpcoesCookieAutenticacao, authCookie } from './config';
import { TokenService } from '../helpers/token.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authGuard: AuthGuard,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('loginotp')
  async loginOtp(
    @Res({ passthrough: true }) response: Response,
    @Body() payload: { email: string; codeOTP?: string },
  ) {
    const validador = new ValidadorHttp(payload);
    const email = validador.lerString('email');
    const codeOTP = payload.codeOTP ? validador.lerString('codeOTP') : null;
    const returnData = await this.authService.loginOTP(email, codeOTP ?? null);
    const opcoes = getOpcoesCookieAutenticacao();
    response.cookie(authCookie, returnData.token, opcoes);
    return returnData;
  }

  @HttpCode(HttpStatus.OK)
  @Post('recoveremail')
  async recoveremail(
    @Res({ passthrough: true }) response: Response,
    @Body() payload: { docId: string; cartao: string },
  ) {
    const validador = new ValidadorHttp(payload);
    const docId = validador.lerString('docId');
    const cartao = validador.lerString('cartao');
    const recoverTry = await this.authService.recoverEmail(docId, cartao);
    response.status(recoverTry.status).json({ message: recoverTry.message });
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const token: string = request.cookies[authCookie];
    if (token) {
      this.tokenService.addInvalidToken(token);
    }
    response.clearCookie(authCookie, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/auth/',
    });
    response.clearCookie(authCookie, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });
    response.status(200).json({ message: 'Logout sucessfull!' });
  }

  @HttpCode(HttpStatus.OK)
  @Get('credentials')
  async credentials(@Req() request: Request) {
    const credentials = await this.authGuard.getCredentials(request);
    return { credentials };
  }
}
