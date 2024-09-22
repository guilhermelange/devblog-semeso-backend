import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FavoritePostDto, UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { Public } from 'src/common/decorator/public.decorator';
import { JwtGuard } from '../auth/jwt-public.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar postagem' })
  create(@Req() request: Request, @Body() createPostDto: CreatePostDto) {
    const { id: id } = request.user;
    return this.postsService.create(+id, createPostDto);
  }

  @Get()
  @Public()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Buscar postagens' })
  findAll(@Req() request: Request, @Query() params) {
    const { id: userId } = request?.user ?? { id: 0 };
    return this.postsService.findAll(+userId, params);
  }

  @Get(':id')
  @Public()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Buscar postagem pelo ID' })
  findOne(@Req() request: Request, @Param('id') id: string) {
    const { id: userId } = request?.user ?? {};
    return this.postsService.findOne(+userId, +id);
  }

  @Get(':slug/slug')
  @Public()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Buscar postagem pelo slug' })
  findOneSlug(@Req() request: Request, @Param('slug') slug: string) {
    const { id: userId } = request?.user ?? {};
    return this.postsService.findOneSlug(+userId, slug);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar postagem' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Put(':id/favorite')
  @ApiOperation({ summary: 'Atualizar postagem favoritada' })
  favorite(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() favoritePostDto: FavoritePostDto,
  ) {
    const { id: userId } = request?.user ?? {};
    return this.postsService.favorite(+id, +userId, favoritePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar postagem' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Atualizar imagem da postagem' })
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    return this.postsService.updateImage(+id, file);
  }
}
