import { Module } from '@nestjs/common';
import { PrismaModule } from './common/database';
import { AuthModule } from './models/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './models/auth/jwt-auth.guard';
import { UsersModule } from './models/users/users.module';
import { PostsModule } from './models/posts/posts.module';
import { CommentsModule } from './models/comments/comments.module';
import { AppController } from './models/app/app.controller';
import patch from './common/patch';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, PostsModule, CommentsModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    patch();
  }
}
