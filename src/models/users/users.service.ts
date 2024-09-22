import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../common/database';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const currentUser = await this.prisma.users.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (currentUser) {
      throw new HttpException('Dados inválidos.', 400);
    }

    const hashedPassword = await hash(createUserDto.password, 8);
    createUserDto.password = hashedPassword;

    const createdUser = await this.prisma.users.create({
      data: createUserDto,
    });
    delete createdUser.password;

    return createdUser;
  }

  async findAll() {
    return await this.prisma.users.findMany({
      select: {
        description: true,
        email: true,
        id: true,
        image: true,
        name: true,
      },
    });
  }

  async findOne(id: number) {
    const currentUser = await this.prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        description: true,
        email: true,
        id: true,
        image: true,
        name: true,
        posts: {
          select: {
            create_date: true,
            description: true,
            id: true,
            slug: true,
            time_read: true,
            title: true,
            update_date: true,
          },
        },
      },
    });

    if (!currentUser) {
      throw new HttpException('Usuário não localizado.', 404);
    }
    return currentUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const currentUser = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!currentUser) {
      throw new HttpException('Dados inválidos.', 400);
    }

    const updatedUser = await this.prisma.users.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
    delete updatedUser.password;

    return updatedUser;
  }
}
