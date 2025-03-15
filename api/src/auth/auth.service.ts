import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { generate } from 'otp-generator';
import {
  numberOnly,
  validatedocId,
  validateEmail,
  anonymizeEmail,
} from 'src/helpers/functions';
import {
  EmailService,
  type StatusReturn,
} from '../helpers/email/email.service';
import type { Members } from '../entities/members/members.entity';
import { MembersService } from '../entities/members/members.service';
import { profile } from 'console';

/**
 * Payload do JWT armazenado no cliente (num cookie seguro).
 */
export interface JwtPayload {
  /**
   * Contém o ID do usuário autenticado. Utilizado o name 'sub' pois é uma 'registered claim' do JWT:
   * https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims#registered-claims
   * lista completa em https://www.iana.org/assignments/jwt/jwt.xhtml#claims
   * user : true = members , false = member
   */
  sub: number;
  user: number;
  exp?: number;
  iat?: number;
}

export interface ResultLogin extends StatusReturn {
  token: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private membersService: MembersService,
    private emailService: EmailService,
  ) {}

  public async loginOTP(
    email: string,
    code: string | null = null,
  ): Promise<ResultLogin> {
    if (!validateEmail(email)) {
      return {
        message: `O e-mail [${email}] não é permitido. \nPor favor, utilize um e-mail válido.`,
        status: HttpStatus.BAD_REQUEST,
        token: null,
      };
    }
    const member = await this.membersService.getMemberByEmail(email);
    if (member) {
      if (code) {
        const returnData = await this.validateOTP(
          member.codeOtp,
          code,
          member.id,
          member.profile_id,
          member.otpExpiration,
        );
        if (returnData.status === HttpStatus.OK) {
          member.dtLastAccess = new Date();
          member.otpExpiration = new Date(0);
          member.codeOtp = '';
          await this.membersService.updatedMember(member);
        }
        return returnData;
      } else {
        const returnData = await this.setMemberOTP(member);
        return {
          message: returnData.message,
          status: returnData.status,
          token: null,
        };
      }
    } else {
      return {
        message: `Email [${email}] não encontrado. Verifique junto ao seu Clube.`,
        status: HttpStatus.BAD_REQUEST,
        token: null,
      };
    }
  }

  public async setMemberOTP(member: Members): Promise<StatusReturn> {
    const idMember: number = member.id;
    const expireIn = new Date(Date.now());

    if (member.otpExpiration > expireIn) {
      return {
        message: `Código já enviado para o e-mail [${member.email}]... \nVerifique sua caixa de entrada ou spam.`,
        status: HttpStatus.FOUND,
      };
    }

    const { otp, otpExpiration } = this.createOTP();

    const salt = await bcrypt.genSalt();
    const cryptOTP = await bcrypt.hash(otp, salt);

    const updatedMember = await this.membersService.getMemberById(idMember);
    if (!updatedMember) {
      return {
        message: `Ocorreu um erro ao procurar o membro. Verifique junto ao seu Clube. ID: ${idMember}`,
        status: HttpStatus.BAD_REQUEST,
      };
    }
    updatedMember.codeOtp = cryptOTP;
    updatedMember.otpExpiration = otpExpiration;

    if (await this.membersService.updatedMember(updatedMember)) {
      const emailSendReturn = await this.emailSend(
        member.email,
        otp,
        otpExpiration,
      );

      if (emailSendReturn.status === HttpStatus.OK) {
        return emailSendReturn;
      } else {
        return {
          message: `Um novo código foi enviado para o e-mail [${member.email}]... \nVerifique sua caixa de entrada ou spam.`,
          status: HttpStatus.FOUND,
        };
      }
    } else {
      return {
        message:
          'Ocorreu um erro ao criar o código. \nPor favor tente novamente mais tarde',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  private createOTP(): { otp: string; otpExpiration: Date } {
    //gera otp
    const otp = generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const expirationSeconds: number = numberOnly(
      process.env.JWT_EXPIRATION_TIME,
    );
    const otpExpiration = new Date(Date.now() + expirationSeconds * 1000);

    return { otp, otpExpiration };
  }

  private async emailSend(
    email: string,
    otp: string,
    otpExpiration: Date,
  ): Promise<StatusReturn> {
    const expirateAt = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(otpExpiration);

    const emailSendReturn = await this.emailService.sendOtpEmail(
      email,
      otp,
      expirateAt,
    );
    return emailSendReturn;
  }

  private async validateOTP(
    otpBase: string,
    enteredOtp: string,
    id: number,
    profile_id: number,
    otpExpiration: Date,
  ): Promise<ResultLogin> {
    if (!id) {
      return {
        message: `Ocorreu um erro ao processar o código ${id}`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        token: null,
      };
    }

    const nowTime = new Date(Date.now());

    if (otpExpiration < nowTime) {
      return {
        message: `Erro: Nenhum código válido. \nVolte e tente novamente...`,
        status: HttpStatus.BAD_REQUEST,
        token: null,
      };
    }

    const match = await bcrypt.compare(enteredOtp, otpBase);

    const returnData: ResultLogin = {
      message: '',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      token: null,
    };

    if (match) {
      const expireIn =
        Math.floor(Date.now() / 1000) +
        parseInt(process.env.JWT_EXPIRATION_TIME!);
      const payload: JwtPayload = {
        sub: id,
        user: profile_id,
      };
      returnData.token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: expireIn,
      });
      returnData.message = 'Sucesso: Redirecionando...';
      returnData.status = HttpStatus.OK;
    } else {
      returnData.message = `Erro: Código inválido. \nVerifique se você digitou corretamente o código recebido em seu email e tente novamente...`;
      returnData.status = HttpStatus.BAD_REQUEST; // 400 - Requisição inválida
    }

    return returnData;
  }

  async recoverEmail(docId: string, birthDate: string): Promise<StatusReturn> {
    const cleanId = numberOnly(docId)
      .toString()
      .padStart(numberOnly(process.env.LENGHT_ID), '0');

    if (!validatedocId(cleanId)) {
      return {
        message:
          'Documento de identidade inválido. Por favor, verifique e tente novamente.',
        status: HttpStatus.BAD_REQUEST,
      };
    }

    const member = await this.membersService.getMemberById(numberOnly(cleanId));

    if (!member) {
      return {
        message:
          'Se os dados estiverem corretos, você receberá um email com instruções.',
        status: HttpStatus.OK,
      };
    }

    const memberBirthDate = new Date(member.birthdate)
      .toISOString()
      .split('T')[0];
    if (memberBirthDate !== birthDate) {
      return {
        message:
          'Se os dados estiverem corretos, você receberá um email com instruções.',
        status: HttpStatus.OK,
      };
    }

    // Mascara o email para exibição
    const maskedEmail = anonymizeEmail(member.email);

    // Envia email com código OTP para o email cadastrado
    await this.setMemberOTP(member);

    return {
      message: `Um código de verificação foi enviado para o email ${maskedEmail}`,
      status: HttpStatus.OK,
    };
  }
}
