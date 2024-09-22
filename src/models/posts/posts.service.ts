import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FavoritePostDto, UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../../common/database';
import { S3 } from '@aws-sdk/client-s3';
@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    const currentPost = await this.prisma.posts.findFirst({
      where: {
        slug: createPostDto.slug,
      },
    });

    if (currentPost) {
      throw new HttpException('Identificador indisponível', 400);
    }

    const createdPost = await this.prisma.posts.create({
      data: {
        content: createPostDto.content,
        description: createPostDto.description,
        title: createPostDto.title,
        slug: createPostDto.slug,
        time_read: createPostDto.time_read,
        user_id: userId,
        upload_image: createPostDto.upload_image ?? false,
      },
    });
    return createdPost;
  }

  async findAll(userId: number, params: any) {
    const take = 12;
    let offset = 0;
    const filter = {} as any;

    if (params?.page) {
      if (+params?.page > 1) {
        offset = (+params?.page - 1) * take;
      }
    }

    if (params?.user_id) {
      filter.user_id = +params?.user_id;
    }

    if (params?.favorite) {
      filter.posts_users_favorites = {
        some: {
          user_id: userId,
        },
      };
    }

    if (params?.q) {
      filter.OR = [
        {
          title: {
            contains: params.q,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: params.q,
            mode: 'insensitive',
          },
        },
      ];
    }

    const queryParams: any = {
      select: {
        id: true,
        create_date: true,
        title: true,
        description: true,
        time_read: true,
        upload_image: true,
        users: {
          select: {
            name: true,
            id: true,
          },
        },
        slug: true,
      },
      where: filter,
      orderBy: {
        id: 'desc',
      },
      take: take,
      skip: offset,
    };

    if (userId) {
      queryParams.select.posts_users_favorites = {
        where: {
          user_id: userId,
        },
      };
    }

    const data: any = await this.prisma.posts.findMany(queryParams);
    const transformedData = data.map((item) => {
      const newItem = {
        ...item,
      };
      newItem.favorite = false;
      if (item?.posts_users_favorites) {
        newItem.favorite = item.posts_users_favorites.length > 0;
      }
      delete newItem.posts_users_favorites;
      return newItem;
    });

    const aggregations = await this.prisma.posts.aggregate({
      _count: {
        _all: true,
      },
      where: filter,
    });

    return {
      count: aggregations._count._all,
      data: transformedData,
    };
  }

  async findOneSlug(userId: number, slug: string) {
    const queryParams: any = {
      where: {
        slug: slug,
      },
      select: {
        content: true,
        create_date: true,
        description: true,
        id: true,
        slug: true,
        time_read: true,
        title: true,
        upload_image: true,
        update_date: true,
        users: {
          select: {
            id: true,
            email: true,
            name: true,
            description: true,
          },
        },
        comments: true,
      },
    };

    if (userId) {
      queryParams.select.posts_users_favorites = {
        where: {
          user_id: userId,
        },
      };
    }

    const currentPost: any = await this.prisma.posts.findFirst(queryParams);

    if (!currentPost) {
      throw new HttpException('Post não localizado', 404);
    }

    const transformedData = {
      ...currentPost,
    };
    transformedData.favorite = false;
    if (transformedData?.posts_users_favorites) {
      transformedData.favorite =
        transformedData.posts_users_favorites.length > 0;
    }
    delete transformedData.posts_users_favorites;

    return transformedData;
  }

  async findOne(userId: number, id: number) {
    const queryParams: any = {
      where: {
        id: id,
      },
      select: {
        content: true,
        create_date: true,
        description: true,
        id: true,
        slug: true,
        time_read: true,
        title: true,
        update_date: true,
        upload_image: true,
        users: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        comments: true,
      },
    };

    if (userId) {
      queryParams.select.posts_users_favorites = {
        where: {
          user_id: userId,
        },
      };
    }

    const currentPost: any = await this.prisma.posts.findUnique(queryParams);

    if (!currentPost) {
      throw new HttpException('Post não localizado', 404);
    }

    const transformedData = {
      ...currentPost,
    };
    transformedData.favorite = false;
    if (transformedData?.posts_users_favorites) {
      transformedData.favorite =
        transformedData.posts_users_favorites.length > 0;
    }
    delete transformedData.posts_users_favorites;

    return transformedData;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const currentPost = await this.prisma.posts.findUnique({
      where: {
        id: id,
      },
    });

    if (!currentPost) {
      throw new HttpException('Post não localizado', 404);
    }

    const updatedPost = await this.prisma.posts.update({
      where: {
        id: id,
      },
      data: {
        ...updatePostDto,
      },
    });
    return updatedPost;
  }

  async favorite(id: number, userId: number, favoritePostDto: FavoritePostDto) {
    const currentPost = await this.prisma.posts.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });

    if (!currentPost) {
      throw new HttpException('Post não localizado', 404);
    }

    if (favoritePostDto.favorite) {
      await this.prisma.posts_users_favorites.upsert({
        where: {
          user_id_post_id: {
            post_id: id,
            user_id: userId,
          },
        },
        create: {
          post_id: id,
          user_id: userId,
        },
        update: {},
      });
    } else {
      try {
        await this.prisma.posts_users_favorites.delete({
          where: {
            user_id_post_id: {
              post_id: id,
              user_id: userId,
            },
          },
        });
      } catch (error) {}
    }

    return '';
  }

  async remove(id: number) {
    const currentPost = await this.prisma.posts.findUnique({
      where: {
        id: id,
      },
    });

    if (!currentPost) {
      throw new HttpException('Post não localizado', 404);
    }
    await this.prisma.posts.delete({
      where: {
        id: id,
      },
    });
    return '';
  }

  async updateImage(id: number, file: Express.Multer.File) {
    const post = await this.prisma.posts.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      // deleteLocalFile();
      throw new HttpException('Post não localizado.', 404);
    }

    const s3 = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: 'us-east-1',
    });

    await uploadFileToBucket(file);

    await this.prisma.posts.update({
      where: {
        id,
      },
      data: {
        upload_image: true,
      },
    });

    return '';

    async function uploadFileToBucket(file: Express.Multer.File) {
      try {
        await s3.putObject({
          Bucket: process.env.BUCKET_NAME,
          Key: post.slug,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
          // ACL: 'public-read',
        });
      } catch (error) {
        throw new HttpException(
          'Não foi possível efetuar upload do arquivo',
          500,
        );
      }
    }
  }
}
