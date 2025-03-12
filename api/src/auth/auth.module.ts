import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { TokenService } from '../helpers/token.service';
import { MembersModule } from 'src/entities/members/members.module';
import { EmailModule } from 'src/helpers/email/email.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
    MembersModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthGuard, AuthService, TokenService],
  exports: [TokenService, JwtModule],
})
export class AuthModule {}
