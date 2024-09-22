import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, JwtService],
})
export class PostsModule {}
