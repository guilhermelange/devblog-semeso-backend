import { Controller, Get, Post, Body, Put, Req, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Criar usuário' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Buscar por usuários' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Buscar dados de usuário por ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put()
  @ApiOperation({ summary: 'Atualizar dados de usuário' })
  update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const { id: id } = request.user;
    return this.usersService.update(+id, updateUserDto);
  }
}
