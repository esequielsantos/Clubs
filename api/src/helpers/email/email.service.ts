import { HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface StatusReturn {
  message: string;
  status: HttpStatus;
}

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendOtpEmail(
    to: string,
    otp: string,
    validate: string,
  ): Promise<StatusReturn> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Código de autenticação Prestação de contas CPESC',
      text: `\nPrestação de contas CPESC \nSeu código para acesso é: ${otp}. Valído até ${validate}`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      if (info.response.startsWith('250')) {
        return {
          message: `Um novo código de autenticação foi enviado para o email ${to}`,
          status: HttpStatus.OK,
        };
      } else {
        return {
          message: `Erro ao enviar email: ${info.response}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    } catch (error) {
      if (error.message.includes('Invalid login')) {
        return {
          message: 'Erro ao enviar OTP: Credenciais de email inválidas.',
          status: HttpStatus.BAD_REQUEST,
        };
      } else if (error.message.includes('connect ETIMEDOUT')) {
        return {
          message:
            'Erro ao enviar OTP: Não foi possível conectar ao servidor de email.',
          status: HttpStatus.REQUEST_TIMEOUT,
        };
      } else {
        return {
          message: `Erro ao enviar OTP: ${error.message} `,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }
}
