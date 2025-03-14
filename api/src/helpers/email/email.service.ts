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
      from: {
        name: 'Clubs Management',
        address: process.env.EMAIL_USER,
      },
      to,
      subject: 'Código de autenticação Clubs Management',
      html: `
      <p>Olá,</p>
        <p>Você recebeu este email porque solicitou um código de autenticação para acessar o Clubs Management.</p>
        <p>Seu código de autenticação é: <strong>${otp}</strong></p>
        <p>Este código é válido até <u>${validate}</u>.</p>
        <p>Se você não solicitou este código, por favor, ignore este email.</p>
        <p>Atenciosamente,</p>
        <p><i>Equipe Clubs Management</i></p>
      `,
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
