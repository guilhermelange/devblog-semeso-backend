import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Autenticar o usuário' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
}
