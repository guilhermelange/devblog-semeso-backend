import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import authConfig from './auth';
import { JwtStrategy } from './jwt.strategy';
import { JwtGuard } from './jwt-public.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: authConfig.jwt.secret,
      signOptions: { expiresIn: authConfig.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController, JwtStrategy],
  providers: [AuthService, JwtGuard],
})
export class AuthModule {}
