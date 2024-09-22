import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../../common/database';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;

    const user = await this.prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Dados inválidos!');
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('Dados inválidos!!');
    }

    const payload = {
      username: user.name,
      sub: { id: user.id, role: 'ADMIN' },
    };
    const token = this.jwtService.sign(payload);

    user.password = undefined;

    return {
      user,
      token,
    };
  }
}
